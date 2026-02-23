#!/bin/bash

# SSL Certificate Setup Script for Let's Encrypt
# This script sets up SSL certificates using Certbot

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}SSL Certificate Setup Script${NC}"
echo -e "${GREEN}========================================${NC}"

# Check if .env.production exists
if [ ! -f .env.production ]; then
    echo -e "${RED}Error: .env.production file not found!${NC}"
    echo "Please create .env.production file with DOMAIN and ADMIN_EMAIL variables"
    exit 1
fi

# Load environment variables
source .env.production

# Check required variables
if [ -z "$DOMAIN" ] || [ -z "$ADMIN_EMAIL" ]; then
    echo -e "${RED}Error: DOMAIN and ADMIN_EMAIL must be set in .env.production${NC}"
    exit 1
fi

echo -e "${YELLOW}Domain: $DOMAIN${NC}"
echo -e "${YELLOW}Admin Email: $ADMIN_EMAIL${NC}"
echo ""

# Create required directories
echo -e "${GREEN}Creating required directories...${NC}"
mkdir -p certbot/conf
mkdir -p certbot/www
mkdir -p nginx/conf.d

# Update nginx configuration with actual domain
echo -e "${GREEN}Updating Nginx configuration with your domain...${NC}"
sed -i "s/yourdomain.com/$DOMAIN/g" nginx/conf.d/app.conf

# Create temporary nginx config for initial certificate request
echo -e "${GREEN}Creating temporary Nginx configuration...${NC}"
cat > nginx/conf.d/temp.conf << EOF
server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN www.$DOMAIN;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 200 'OK';
        add_header Content-Type text/plain;
    }
}
EOF

# Start nginx temporarily for certificate generation
echo -e "${GREEN}Starting Nginx for certificate generation...${NC}"
docker-compose -f docker-compose.prod.yml up -d nginx

# Wait for nginx to start
echo -e "${YELLOW}Waiting for Nginx to start...${NC}"
sleep 5

# Request SSL certificate
echo -e "${GREEN}Requesting SSL certificate from Let's Encrypt...${NC}"
docker-compose -f docker-compose.prod.yml run --rm certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email $ADMIN_EMAIL \
    --agree-tos \
    --no-eff-email \
    -d $DOMAIN \
    -d www.$DOMAIN

# Check if certificate was created successfully
if [ -d "certbot/conf/live/$DOMAIN" ]; then
    echo -e "${GREEN}✓ SSL certificate created successfully!${NC}"
    
    # Remove temporary config
    rm nginx/conf.d/temp.conf
    
    # Restart nginx with SSL configuration
    echo -e "${GREEN}Restarting Nginx with SSL configuration...${NC}"
    docker-compose -f docker-compose.prod.yml restart nginx
    
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}SSL Setup Complete!${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo -e "${YELLOW}Your site is now accessible at:${NC}"
    echo -e "${GREEN}https://$DOMAIN${NC}"
    echo ""
    echo -e "${YELLOW}Certificate will auto-renew every 12 hours${NC}"
else
    echo -e "${RED}✗ Failed to create SSL certificate${NC}"
    echo -e "${YELLOW}Please check:${NC}"
    echo "1. DNS A record points to your server IP"
    echo "2. Ports 80 and 443 are open in firewall"
    echo "3. Domain is accessible from the internet"
    exit 1
fi
