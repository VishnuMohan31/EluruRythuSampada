#!/bin/bash

# ============================================
# SHG India Marketplace Portal
# Database Setup Script for PostgreSQL
# ============================================

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "============================================"
echo "SHG India Marketplace - Database Setup"
echo "============================================"
echo ""

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo -e "${RED}Error: PostgreSQL is not installed${NC}"
    echo "Please install PostgreSQL 14+ first"
    exit 1
fi

# Database configuration
read -p "Enter PostgreSQL username (default: postgres): " DB_USER
DB_USER=${DB_USER:-postgres}

read -p "Enter database name (default: shg_marketplace): " DB_NAME
DB_NAME=${DB_NAME:-shg_marketplace}

read -sp "Enter PostgreSQL password: " DB_PASSWORD
echo ""

# Export password for psql
export PGPASSWORD=$DB_PASSWORD

echo ""
echo -e "${YELLOW}Step 1: Creating database...${NC}"

# Create database
psql -U $DB_USER -h localhost -c "CREATE DATABASE $DB_NAME;" 2>/dev/null

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Database '$DB_NAME' created successfully${NC}"
else
    echo -e "${YELLOW}⚠ Database '$DB_NAME' may already exist, continuing...${NC}"
fi

echo ""
echo -e "${YELLOW}Step 2: Creating tables, triggers, and admin user...${NC}"

# Run create tables script (includes everything)
psql -U $DB_USER -h localhost -d $DB_NAME -f 01_create_tables.sql

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Database setup completed successfully${NC}"
else
    echo -e "${RED}✗ Error setting up database${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}Database setup completed successfully!${NC}"
echo -e "${GREEN}============================================${NC}"
echo ""
echo "Database Details:"
echo "  - Database Name: $DB_NAME"
echo "  - Username: $DB_USER"
echo "  - Host: localhost"
echo "  - Port: 5432"
echo ""
echo "Default Admin Credentials:"
echo "  - Email: admin@shgindia.gov.in"
echo "  - Password: Admin@123"
echo ""
echo -e "${YELLOW}⚠ IMPORTANT: Change the default admin password after first login!${NC}"
echo ""
echo "Connection String for .env file:"
echo "DATABASE_URL=postgresql://$DB_USER:YOUR_PASSWORD@localhost:5432/$DB_NAME"
echo ""

# Unset password
unset PGPASSWORD
