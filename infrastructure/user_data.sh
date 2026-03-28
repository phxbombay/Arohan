#!/bin/bash
set -e

# Setup Swap Space (Prevents OOM on t3.micro)
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# Update and install Docker
sudo apt-get update -y
sudo apt-get install -y ca-certificates curl gnupg lsb-release git mysql-client

# Add Docker GPG
sudo mkdir -m 0755 -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Set up repository
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine
sudo apt-get update -y
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Add ubuntu user to docker group
sudo usermod -aG docker ubuntu

# Clone the project from GitHub
mkdir -p /home/ubuntu/app
chown ubuntu:ubuntu /home/ubuntu/app
cd /home/ubuntu/app
sudo -u ubuntu rm -rf ./* ./.* 2>/dev/null || true
sudo -u ubuntu git clone https://github.com/phxbombay/Arohan.git .

# Write the production .env file (RDS-backed, no local MySQL)
cat <<EOF > /home/ubuntu/app/.env
# Database Configuration (AWS RDS MySQL)
DB_HOST=${db_host}
DB_NAME=${db_name}
DB_USER=${db_user}
DB_PASSWORD=${db_password}
DB_CONNECTION_LIMIT=20
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

# Start containers using the PRODUCTION compose file (no local MySQL - uses RDS)
cd /home/ubuntu/app
sudo -u ubuntu docker compose -f docker-compose.prod.yml up --build -d

# Wait for containers to stabilize
echo "Waiting 90s for containers and DB to stabilize..."
sleep 90

# Seed the database schema against RDS
BACKEND_CONTAINER=$(sudo docker ps --format '{{.Names}}' | grep "backend" | head -n 1)

if [ -n "$BACKEND_CONTAINER" ]; then
    echo "Backend container found: $BACKEND_CONTAINER"

    # Initialize DB schema (idempotent - uses IF NOT EXISTS)
    echo "Running schema initialization against RDS..."
    sudo docker exec "$BACKEND_CONTAINER" sh -c \
      "mysql -h ${db_host} -u ${db_user} -p'${db_password}' ${db_name} < schema_mysql.sql" \
      && echo "Schema initialized successfully." \
      || echo "Schema already exists or initialization skipped."

    # Run migrations
    echo "Running migrations..."
    sudo docker exec "$BACKEND_CONTAINER" node migrate.js \
      && echo "Migrations completed successfully." \
      || echo "Migrations failed or already applied."
else
    echo "ERROR: Backend container not found after 90s."
    sudo docker compose -f docker-compose.prod.yml logs
fi

echo "Deployment complete." > /home/ubuntu/install_status.txt
