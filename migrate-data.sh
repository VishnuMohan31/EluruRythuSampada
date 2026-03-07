#!/bin/bash

# ============================================
# Data Migration Script
# From: 62.171.191.132 (Old Server)
# To: 31.97.205.38 (New Server)
# ============================================

set -e

echo "=========================================="
echo "Data Migration - Old Server to New Server"
echo "=========================================="
echo ""

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

OLD_SERVER="vishnu@62.171.191.132"
OLD_PATH="/opt/EluruRythu/EluruRythuSampada_Shared_data"
NEW_PATH="/opt/EluruRythu/EluruRythuSampada_Shared_data"
BACKUP_NAME="EluruRythuSampada_Migration_$(date +%Y%m%d_%H%M%S).tar.gz"

echo -e "${BLUE}Migration Details:${NC}"
echo "Old Server: $OLD_SERVER"
echo "New Server: 31.97.205.38 (current server)"
echo "Backup File: $BACKUP_NAME"
echo ""

# Check if running on new server
if [ ! -d "/opt/EluruRythu/EluruRythuSampada" ]; then
    echo -e "${RED}Error: This script must run on NEW server (31.97.205.38)${NC}"
    exit 1
fi

echo -e "${YELLOW}Step 1: Testing SSH connection to old server...${NC}"
if ssh -o ConnectTimeout=5 $OLD_SERVER "echo 'Connection OK'" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ SSH connection successful${NC}"
else
    echo -e "${RED}✗ Cannot connect to old server${NC}"
    echo "Please ensure:"
    echo "1. You can SSH to $OLD_SERVER"
    echo "2. SSH keys are set up or you have the password"
    exit 1
fi
echo ""

echo -e "${YELLOW}Step 2: Stopping containers on NEW server...${NC}"
cd /opt/EluruRythu/EluruRythuSampada
docker compose -f docker-compose.prod.yml down
echo -e "${GREEN}✓ Containers stopped${NC}"
echo ""

echo -e "${YELLOW}Step 3: Creating backup on OLD server...${NC}"
echo "This will:"
echo "  - Stop old server containers temporarily"
echo "  - Create compressed backup"
echo "  - Restart old server containers"
echo ""

ssh $OLD_SERVER << 'ENDSSH'
set -e
cd /opt/EluruRythu/EluruRythuSampada
echo "Stopping old server containers..."
sudo docker-compose -f docker-compose.prod.yml down

cd /opt/EluruRythu
echo "Creating backup..."
sudo tar -czf EluruRythuSampada_Migration_*.tar.gz EluruRythuSampada_Shared_data/ 2>/dev/null || \
sudo tar -czf EluruRythuSampada_Migration_$(date +%Y%m%d_%H%M%S).tar.gz EluruRythuSampada_Shared_data/

echo "Restarting old server containers..."
cd /opt/EluruRythu/EluruRythuSampada
sudo docker-compose -f docker-compose.prod.yml up -d

echo "Backup created successfully!"
ls -lh /opt/EluruRythu/EluruRythuSampada_Migration_*.tar.gz | tail -1
ENDSSH

echo -e "${GREEN}✓ Backup created on old server${NC}"
echo ""

echo -e "${YELLOW}Step 4: Transferring backup to new server...${NC}"
cd /opt/EluruRythu

# Get the latest backup file name
LATEST_BACKUP=$(ssh $OLD_SERVER "ls -t /opt/EluruRythu/EluruRythuSampada_Migration_*.tar.gz | head -1")
echo "Transferring: $LATEST_BACKUP"

scp $OLD_SERVER:$LATEST_BACKUP .

BACKUP_FILE=$(basename $LATEST_BACKUP)
echo -e "${GREEN}✓ Transfer complete${NC}"
echo "Backup size: $(ls -lh $BACKUP_FILE | awk '{print $5}')"
echo ""

echo -e "${YELLOW}Step 5: Backing up current new server data...${NC}"
if [ -d "$NEW_PATH" ]; then
    mv $NEW_PATH ${NEW_PATH}.backup_$(date +%Y%m%d_%H%M%S)
    echo -e "${GREEN}✓ Current data backed up${NC}"
else
    echo -e "${YELLOW}⚠ No existing data to backup${NC}"
fi
echo ""

echo -e "${YELLOW}Step 6: Extracting old server data...${NC}"
tar -xzf $BACKUP_FILE
echo -e "${GREEN}✓ Data extracted${NC}"
echo ""

echo -e "${YELLOW}Step 7: Verifying extracted data...${NC}"
echo "Checking directories:"
ls -la $NEW_PATH/
echo ""
echo "Storage contents:"
ls -la $NEW_PATH/storage/
echo ""
echo "Database size:"
du -sh $NEW_PATH/postgres/
echo -e "${GREEN}✓ Data verified${NC}"
echo ""

echo -e "${YELLOW}Step 8: Starting containers with migrated data...${NC}"
cd /opt/EluruRythu/EluruRythuSampada
docker compose -f docker-compose.prod.yml up -d
echo -e "${GREEN}✓ Containers started${NC}"
echo ""

echo -e "${YELLOW}Step 9: Waiting for containers to be healthy (60 seconds)...${NC}"
sleep 60
docker compose -f docker-compose.prod.yml ps
echo ""

echo -e "${YELLOW}Step 10: Verifying database data...${NC}"
echo "Products count:"
docker exec farmers_postgres psql -U farmers_user -d farmers_marketplace -c "SELECT COUNT(*) FROM products;" 2>/dev/null || echo "Database still starting..."
echo ""
echo "Farmers count:"
docker exec farmers_postgres psql -U farmers_user -d farmers_marketplace -c "SELECT COUNT(*) FROM farmers;" 2>/dev/null || echo "Database still starting..."
echo ""
echo "Users count:"
docker exec farmers_postgres psql -U farmers_user -d farmers_marketplace -c "SELECT COUNT(*) FROM users;" 2>/dev/null || echo "Database still starting..."
echo ""

echo "=========================================="
echo -e "${GREEN}✓ MIGRATION COMPLETED!${NC}"
echo "=========================================="
echo ""
echo "Summary:"
echo "  - Old server data backed up: $BACKUP_FILE"
echo "  - Data transferred to new server"
echo "  - Containers running with migrated data"
echo ""
echo "Next Steps:"
echo "1. Test the application:"
echo "   curl -H 'Host: elururythusampada.in' http://localhost"
echo ""
echo "2. Check if all data is present:"
echo "   - Login to admin panel"
echo "   - Verify products are visible"
echo "   - Check images load correctly"
echo ""
echo "3. If everything works, change DNS in GoDaddy"
echo ""
echo "Backup files location:"
echo "  - New server: /opt/EluruRythu/$BACKUP_FILE"
echo "  - Old server: $LATEST_BACKUP"
echo ""
