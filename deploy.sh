#!/bin/bash

# ============================================
# Production Deployment Script
# Domain: elururythusampada.in
# Server IP: 62.171.191.132
# ============================================

set -e  # Exit on error

echo "=========================================="
echo "Eluru Rythu Sampada - Production Deployment"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running as root or with sudo
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}Please run with sudo${NC}"
    exit 1
fi

# Configuration
DOMAIN="elururythusampada.in"
SERVER_IP="62.171.191.132"
EMAIL="datalegos@gmail.com"
PROJECT_DIR="/opt/EluruRythuSampada"
SHARED_DATA_DIR="/opt/EluruRythuSampada_Shared_data"

echo -e "${YELLOW}Step 1: Checking prerequisites...${NC}"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Docker is not installed. Installing Docker...${NC}"
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    systemctl start docker
    systemctl enable docker
    rm get-docker.sh
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}Docker Compose is not installed. Installing...${NC}"
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
fi

echo -e "${GREEN}✓ Prerequisites checked${NC}"
echo ""

echo -e "${YELLOW}Step 2: Creating directories...${NC}"
mkdir -p $PROJECT_DIR
mkdir -p $SHARED_DATA_DIR/{postgres/pgdata,backups,logs,storage}
chmod -R 755 $SHARED_DATA_DIR
echo -e "${GREEN}✓ Directories created${NC}"
echo ""

echo -e "${YELLOW}Step 3: Copying production environment files...${NC}"
if [ -f ".env.production" ]; then
    cp .env.production .env
    echo -e "${GREEN}✓ Root .env configured${NC}"
fi

if [ -f "backend/.env.production" ]; then
    cp backend/.env.production backend/.env
    echo -e "${GREEN}✓ Backend .env configured${NC}"
fi

if [ -f "frontend/.env.production" ]; then
    cp frontend/.env.production frontend/.env
    echo -e "${GREEN}✓ Frontend .env configured${NC}"
fi
echo ""

echo -e "${YELLOW}Step 4: Generating secure secrets...${NC}"
# Generate random SECRET_KEY
SECRET_KEY=$(openssl rand -base64 32)
DB_PASSWORD=$(openssl rand -base64 24 | tr -d "=+/" | cut -c1-32)

# Update .env files with generated secrets
sed -i "s/CHANGE_THIS_TO_RANDOM_32_CHAR_SECRET_KEY_IN_PRODUCTION/$SECRET_KEY/g" .env backend/.env
sed -i "s/CHANGE_THIS_STRONG_PASSWORD_IN_PRODUCTION_123!@#/$DB_PASSWORD/g" .env backend/.env

echo -e "${GREEN}✓ Secure secrets generated${NC}"
echo -e "${YELLOW}IMPORTANT: Save these credentials securely!${NC}"
echo "Database Password: $DB_PASSWORD"
echo "JWT Secret Key: $SECRET_KEY"
echo ""

echo -e "${YELLOW}Step 5: Building Docker images...${NC}"
docker-compose -f docker-compose.prod.yml build --no-cache
echo -e "${GREEN}✓ Docker images built${NC}"
echo ""

echo -e "${YELLOW}Step 6: Starting services...${NC}"
docker-compose -f docker-compose.prod.yml up -d
echo -e "${GREEN}✓ Services started${NC}"
echo ""

echo -e "${YELLOW}Step 7: Waiting for services to be healthy...${NC}"
sleep 10

# Check service health
if docker-compose -f docker-compose.prod.yml ps | grep -q "healthy"; then
    echo -e "${GREEN}✓ Services are healthy${NC}"
else
    echo -e "${RED}⚠ Some services may not be healthy. Check logs:${NC}"
    echo "docker-compose -f docker-compose.prod.yml logs"
fi
echo ""

echo -e "${YELLOW}Step 8: Setting up SSL with Let's Encrypt...${NC}"
echo "Run the following command to obtain SSL certificate:"
echo ""
echo -e "${GREEN}docker-compose -f docker-compose.prod.yml run --rm certbot certonly --webroot --webroot-path=/var/www/certbot -d $DOMAIN -d www.$DOMAIN --email $EMAIL --agree-tos --no-eff-email${NC}"
echo ""
echo "After obtaining the certificate, restart nginx:"
echo -e "${GREEN}docker-compose -f docker-compose.prod.yml restart nginx${NC}"
echo ""

echo "=========================================="
echo -e "${GREEN}Deployment Complete!${NC}"
echo "=========================================="
echo ""
echo "Application URLs:"
echo "  - HTTP:  http://$DOMAIN"
echo "  - HTTPS: https://$DOMAIN (after SSL setup)"
echo "  - API:   https://$DOMAIN/api/"
echo ""
echo "Useful Commands:"
echo "  - View logs:     docker-compose -f docker-compose.prod.yml logs -f"
echo "  - Stop services: docker-compose -f docker-compose.prod.yml down"
echo "  - Restart:       docker-compose -f docker-compose.prod.yml restart"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "1. Point your domain DNS A record to: $SERVER_IP"
echo "2. Wait for DNS propagation (5-30 minutes)"
echo "3. Run the SSL certificate command shown above"
echo "4. Create super admin user via API or database"
echo ""
