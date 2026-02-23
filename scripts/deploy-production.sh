#!/bin/bash

# Production Deployment Script
# This script deploys the application to production with HTTPS

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Production Deployment Script${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Check if .env.production exists
if [ ! -f .env.production ]; then
    echo -e "${RED}Error: .env.production file not found!${NC}"
    echo "Please create .env.production file first"
    exit 1
fi

# Load environment variables
source .env.production

# Validate required variables
echo -e "${GREEN}Validating configuration...${NC}"
REQUIRED_VARS=("DOMAIN" "POSTGRES_PASSWORD" "SECRET_KEY" "CORS_ORIGINS")
for var in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!var}" ]; then
        echo -e "${RED}Error: $var is not set in .env.production${NC}"
        exit 1
    fi
done

# Check if SECRET_KEY is still default
if [[ "$SECRET_KEY" == *"CHANGE_THIS"* ]]; then
    echo -e "${RED}Error: Please change SECRET_KEY in .env.production${NC}"
    exit 1
fi

# Check if POSTGRES_PASSWORD is still default
if [[ "$POSTGRES_PASSWORD" == *"CHANGE_THIS"* ]]; then
    echo -e "${RED}Error: Please change POSTGRES_PASSWORD in .env.production${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Configuration validated${NC}"
echo ""

# Build frontend for production
echo -e "${GREEN}Building frontend for production...${NC}"
cd frontend
npm run build
cd ..
echo -e "${GREEN}✓ Frontend built successfully${NC}"
echo ""

# Stop existing containers
echo -e "${YELLOW}Stopping existing containers...${NC}"
docker-compose -f docker-compose.prod.yml down
echo -e "${GREEN}✓ Containers stopped${NC}"
echo ""

# Build and start containers
echo -e "${GREEN}Building and starting containers...${NC}"
docker-compose -f docker-compose.prod.yml up -d --build
echo -e "${GREEN}✓ Containers started${NC}"
echo ""

# Wait for services to be healthy
echo -e "${YELLOW}Waiting for services to be healthy...${NC}"
sleep 10

# Check service health
echo -e "${GREEN}Checking service health...${NC}"
docker-compose -f docker-compose.prod.yml ps

echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Deployment Complete!${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Run SSL setup: ${GREEN}bash scripts/setup-ssl.sh${NC}"
echo "2. Access your site: ${GREEN}https://$DOMAIN${NC}"
echo ""
echo -e "${YELLOW}Useful commands:${NC}"
echo "- View logs: ${GREEN}docker-compose -f docker-compose.prod.yml logs -f${NC}"
echo "- Restart: ${GREEN}docker-compose -f docker-compose.prod.yml restart${NC}"
echo "- Stop: ${GREEN}docker-compose -f docker-compose.prod.yml down${NC}"
