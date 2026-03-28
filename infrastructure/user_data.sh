#!/bin/bash
set -e

# Redirect all output to log and console
exec > >(tee -a /var/log/arohan-deploy.log | logger -t user-data -s 2>/dev/console) 2>&1

# Add user's SSH key for recovery (since AWS key name mismatch)
echo "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDsqZv4dMULmIaU3gcpJjJlraX0nkhsBQppNsUDXvKzA4+tR2eyK3BW00U1kuf1izkB3AAtJyAp9LGdR/b6YunhuAdCpaOtnJ+dKAGSDPFOg4r5QmdWMU38V42qjnZKHg+P59Gd5YBJoEPuFpoXarfLlvfU8KXjxAIlejJRcEopo3B0pW7vneQ69VTtzntlkxICBwFCM5uec3e4rdpwl2mu8t0vlrvTqYH0p7o2ztA5lr8okgTSZJn/dDQiN7qAvexBWES1ulH28IIv5i8WVTpvEpxjaVqOxKGGeiyy2nZ456cwPtM56qwp2soP7T7yveCipmGdzz4+lp6MkZimm/Rf" >> /home/ubuntu/.ssh/authorized_keys

# Setup Swap Space (Prevents OOM on t3.micro)
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# Update and install Docker
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg lsb-release

# Add Docker GPG
sudo mkdir -m 0755 -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Set up repository
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Add ubuntu user to docker group
sudo usermod -aG docker ubuntu

# Install Git and MySQL Client
sudo apt-get install -y git mysql-client

# Create Project Directory
mkdir -p /home/ubuntu/app
chown ubuntu:ubuntu /home/ubuntu/app

cd /home/ubuntu/app
# Clear directory safely without failing on . and ..
sudo -u ubuntu sh -c 'rm -rf ./* ./.??* 2>/dev/null || true'
sudo -u ubuntu git clone https://github.com/phxbombay/Arohan.git .

# Create .env file with full production configuration
cat <<EOF > /home/ubuntu/app/.env
# Database Configuration
DB_HOST=${db_host}
DB_NAME=${db_name}
DB_USER=${db_user}
DB_PASSWORD=${db_password}
NODE_ENV=production
PORT=5000

# JWT Secrets
JWT_SECRET=${jwt_secret}
JWT_EXPIRE=7d

# Allowed Origins
ALLOWED_ORIGINS=${allowed_origins}

# SMTP Email Configuration
SMTP_HOST=${smtp_host}
SMTP_PORT=${smtp_port}
SMTP_USER=${smtp_user}
SMTP_PASSWORD=${smtp_password}
ADMIN_EMAIL=${admin_email}

# Razorpay Configuration
RAZORPAY_KEY_ID=${razorpay_key_id}
RAZORPAY_KEY_SECRET=${razorpay_key_secret}

# Frontend Configuration
VITE_API_URL=${vite_api_url}
EOF
chown ubuntu:ubuntu /home/ubuntu/app/.env

# Start containers (run as root since we are in cloud-init)
cd /home/ubuntu/app
cp .env /home/ubuntu/app/.env.production
mkdir -p /home/ubuntu/app/ssl  # Ensure ssl dir exists for volume mount
docker compose -f docker-compose.prod.yml up --build -d

# ---------------------------------------------------------
# Step 6: Database Initialization (Automated for First Run)
# ---------------------------------------------------------
echo "Waiting for containers to stabilize (120s)..."
for i in {1..12}; do
    echo "Check $i of 12..."
    BACKEND_CONTAINER=$(sudo docker ps --filter "name=backend" --format '{{.Names}}' | head -n 1)
    if [ -n "$BACKEND_CONTAINER" ]; then
        echo "Backend is UP: $BACKEND_CONTAINER"
        break
    fi
    sleep 10
done

if [ -n "$BACKEND_CONTAINER" ]; then
    # Initialize DB schema
    echo "Running schema initialization..."
    docker exec $BACKEND_CONTAINER sh -c "mysql -h ${db_host} -u ${db_user} -p'${db_password}' ${db_name} < schema_mysql.sql" && echo "Schema initialized successfully." || echo "Schema already exists or initialization skipped."
    
    # Run migrations
    echo "Running migrations..."
    docker exec $BACKEND_CONTAINER node migrate.js && echo "Migrations completed successfully." || echo "Migrations failed or already applied."
else
    echo "ERROR: Backend container not found after 120s. Checking logs..."
    docker compose -f docker-compose.prod.yml logs
fi

echo "Docker & App Configured Successfully" > /home/ubuntu/install_status.txt
