# Setup Swap Space (Prevents OOM on t3.micro)
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/etc/fstab

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

# Install Git
sudo apt-get install -y git

# Create Project Directory
mkdir -p /home/ubuntu/app
chown ubuntu:ubuntu /home/ubuntu/app

cd /home/ubuntu/app
sudo -u ubuntu rm -rf ./* ./.* 2>/dev/null
sudo -u ubuntu git clone https://github.com/phxbombay/Arohan.git .

# Create .env file with DB configuration
cat <<EOF > /home/ubuntu/app/.env
DB_HOST=${db_host}
DB_NAME=${db_name}
DB_USER=${db_user}
DB_PASSWORD=${db_password}
NODE_ENV=production
EOF
chown ubuntu:ubuntu /home/ubuntu/app/.env

# Start containers
sudo docker compose up --build -d

echo "Docker & App Configured Successfully" > /home/ubuntu/install_status.txt
