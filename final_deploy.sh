#!/bin/bash

# ============================================
# Automated Deployment Script
# Domain: elururythusampada.in
# Server: 31.97.205.38
# ============================================

set -e

echo "=========================================="
echo "EluruRythuSampada - Deployment"
echo "=========================================="
echo ""

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}Error: Run as root${NC}"
    exit 1
fi

DOMAIN="elururythusampada.in"
SERVER_IP="31.97.205.38"
SSL_EMAIL="datalegos@gmail.com"

echo -e "${YELLOW}Generating passwords...${NC}"
POSTGRES_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-32)
SECRET_KEY=$(openssl rand -base64 48 | tr -d "=+/" | cut -c1-48)
echo -e "${GREEN}✓ Done${NC}"
echo ""

BASE_DIR="/opt/EluruRythu"
APP_DIR="$BASE_DIR/EluruRythuSampada"
SHARED_DATA_DIR="$BASE_DIR/EluruRythuSampada_Shared_data"

# Check if we're in the correct directory
if [ ! -d "$APP_DIR" ]; then
    echo -e "${RED}Error: Application directory not found!${NC}"
    echo "Please run this script from: $APP_DIR"
    echo ""
    echo "Steps:"
    echo "1. mkdir -p /opt/EluruRythu"
    echo "2. cd /opt/EluruRythu"
    echo "3. git clone https://github.com/VishnuMohan31/EluruRythuSampada.git"
    echo "4. cd EluruRythuSampada"
    echo "5. bash final_deploy.sh"
    exit 1
fi

cd "$APP_DIR"

echo -e "${YELLOW}Step 1: Creating shared data directories...${NC}"
mkdir -p "$SHARED_DATA_DIR/postgres"
mkdir -p "$SHARED_DATA_DIR/storage/farmers"
mkdir -p "$SHARED_DATA_DIR/storage/products"
mkdir -p "$SHARED_DATA_DIR/storage/temp"
mkdir -p "$SHARED_DATA_DIR/logs"
mkdir -p "$SHARED_DATA_DIR/backups"
echo -e "${GREEN}✓ Done${NC}"
echo ""

echo -e "${YELLOW}Step 2: Creating .env...${NC}"
cat > .env << EOF
SHARED_DATA_PATH=$SHARED_DATA_DIR
POSTGRES_DB=farmers_marketplace
POSTGRES_USER=farmers_user
POSTGRES_PASSWORD=$POSTGRES_PASSWORD
POSTGRES_PORT=5434
BACKEND_PORT=8004
DB_ECHO=False
SECRET_KEY=$SECRET_KEY
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=180
REFRESH_TOKEN_EXPIRE_DAYS=7
CORS_ORIGINS=https://$DOMAIN,https://www.$DOMAIN,http://$DOMAIN,http://www.$DOMAIN
STORAGE_PATH=storage
MAX_IMAGE_SIZE_MB=5
ALLOWED_IMAGE_FORMATS=jpg,jpeg,png,webp
FRONTEND_PORT=3004
DOMAIN=$DOMAIN
SERVER_IP=$SERVER_IP
SSL_EMAIL=$SSL_EMAIL
EOF
echo -e "${GREEN}✓ Done${NC}"
echo ""

echo -e "${YELLOW}Step 3: Saving credentials...${NC}"
cat > "$BASE_DIR/CREDENTIALS.txt" << EOF
========================================
EluruRythuSampada Credentials
Generated: $(date)
========================================
PostgreSQL Password: $POSTGRES_PASSWORD
SECRET_KEY: $SECRET_KEY
========================================
EOF
chmod 600 "$BASE_DIR/CREDENTIALS.txt"
echo -e "${GREEN}✓ Saved to: $BASE_DIR/CREDENTIALS.txt${NC}"
echo ""

echo -e "${YELLOW}Step 4: Installing Docker...${NC}"
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
fi
if ! command -v docker-compose &> /dev/null; then
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
fi
echo -e "${GREEN}✓ Done${NC}"
echo ""

echo -e "${YELLOW}Step 5: Starting containers...${NC}"
docker-compose -f docker-compose.prod.yml up -d
echo -e "${GREEN}✓ Done${NC}"
echo ""

echo -e "${YELLOW}Step 6: Waiting 60 seconds...${NC}"
sleep 60
docker-compose -f docker-compose.prod.yml ps
echo ""

echo -e "${YELLOW}Step 7: Installing Nginx...${NC}"
if ! command -v nginx &> /dev/null; then
    apt-get update
    apt-get install -y nginx
fi
echo -e "${GREEN}✓ Done${NC}"
echo ""

echo -e "${YELLOW}Step 8: Configuring Nginx (HTTP only)...${NC}"
cat > /etc/nginx/sites-available/$DOMAIN << 'NGINXCONF'
server {
    listen 80;
    listen [::]:80;
    server_name elururythusampada.in www.elururythusampada.in;

    access_log /var/log/nginx/elururythusampada_access.log;
    error_log /var/log/nginx/elururythusampada_error.log;
    client_max_body_size 10M;

    location / {
        proxy_pass http://127.0.0.1:3004;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:8004/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    location /storage/ {
        proxy_pass http://127.0.0.1:8004/storage/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        expires 1h;
        add_header Cache-Control "public, immutable";
    }

    location /health {
        proxy_pass http://127.0.0.1:8004/health;
        access_log off;
    }
}
NGINXCONF

ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/$DOMAIN
rm -f /etc/nginx/sites-enabled/default
nginx -t
echo -e "${GREEN}✓ Done${NC}"
echo ""

echo -e "${YELLOW}Step 9: Starting Nginx...${NC}"
systemctl stop nginx 2>/dev/null || true
sleep 5
systemctl start nginx
systemctl enable nginx
echo -e "${GREEN}✓ Done${NC}"
echo ""

echo "=========================================="
echo -e "${GREEN}✓ DEPLOYMENT COMPLETE!${NC}"
echo "=========================================="
echo ""
echo "Domain: http://$DOMAIN"
echo "Server IP: $SERVER_IP"
echo "App Path: $APP_DIR"
echo "Data Path: $SHARED_DATA_DIR"
echo "Credentials: $BASE_DIR/CREDENTIALS.txt"
echo ""
echo "IMPORTANT - Save These:"
echo "PostgreSQL Password: $POSTGRES_PASSWORD"
echo "SECRET_KEY: $SECRET_KEY"
echo ""
echo "Test now: http://$DOMAIN"
echo ""
echo "For SSL later run:"
echo "certbot --nginx -d $DOMAIN -d www.$DOMAIN --email $SSL_EMAIL"
echo ""
