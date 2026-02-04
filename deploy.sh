#!/bin/bash
# Deployment Script for Arohan Health Platform
# Run this script on your production server

set -e  # Exit on error

echo "🚀 Arohan Health Platform - Production Deployment"
echo "=================================================="

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${RED}❌ ERROR: .env file not found${NC}"
    echo "Please create .env file from .env.production.template"
    exit 1
fi

# Check if required environment variables are set
echo -e "${YELLOW}📋 Checking environment variables...${NC}"
required_vars=("POSTGRES_PASSWORD" "JWT_SECRET" "SMTP_HOST" "SMTP_USER" "SMTP_PASSWORD")
missing_vars=()

for var in "${required_vars[@]}"; do
    if ! grep -q "^${var}=" .env || grep -q "^${var}=CHANGE" .env; then
        missing_vars+=("$var")
    fi
done

if [ ${#missing_vars[@]} -ne 0 ]; then
    echo -e "${RED}❌ ERROR: Missing or unchanged environment variables:${NC}"
    printf '%s\n' "${missing_vars[@]}"
    echo "Please update .env file with production values"
    exit 1
fi

echo -e "${GREEN}✅ Environment variables configured${NC}"

# Pull latest code (if using git)
echo -e "${YELLOW}📥 Pulling latest code...${NC}"
if [ -d .git ]; then
    git pull origin main || echo "Not a git repository, skipping pull"
fi

# Stop existing containers
echo -e "${YELLOW}🛑 Stopping existing containers...${NC}"
docker compose -f docker-compose.prod.yml down

# Build and start containers
echo -e "${YELLOW}🏗️  Building and starting containers...${NC}"
docker compose -f docker-compose.prod.yml up -d --build

# Wait for services to be healthy
echo -e "${YELLOW}⏳ Waiting for services to start...${NC}"
sleep 10

# Check container status
echo -e "${YELLOW}🔍 Checking container status...${NC}"
docker compose -f docker-compose.prod.yml ps

# Run health checks
echo -e "${YELLOW}🏥 Running health checks...${NC}"

# Check database
if docker exec arohan-db pg_isready -U postgres > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Database: Healthy${NC}"
else
    echo -e "${RED}❌ Database: Not responding${NC}"
    exit 1
fi

# Check backend
if curl -f http://localhost:5000/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend API: Healthy${NC}"
else
    echo -e "${YELLOW}⚠️  Backend API: Not responding on /health${NC}"
fi

# Check frontend
if curl -f http://localhost:80 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Frontend: Healthy${NC}"
else
    echo -e "${YELLOW}⚠️  Frontend: Not responding${NC}"
fi

# Create backup directory
echo -e "${YELLOW}📁 Setting up backup directory...${NC}"
mkdir -p ~/arohan-backups

# Create initial database backup
echo -e "${YELLOW}💾 Creating initial database backup...${NC}"
docker exec arohan-db pg_dump -U postgres arohan_health_db > ~/arohan-backups/initial_backup_$(date +%Y%m%d_%H%M%S).sql
echo -e "${GREEN}✅ Backup created${NC}"

echo ""
echo -e "${GREEN}✅ Deployment Complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Check logs: docker compose -f docker-compose.prod.yml logs -f"
echo "2. Verify application at: http://your-server-ip"
echo "3. Set up SSL certificate"
echo "4. Configure daily backups"
echo ""
echo "Backups location: ~/arohan-backups/"
echo ""
