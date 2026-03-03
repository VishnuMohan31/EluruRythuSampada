#!/bin/bash

# ============================================
# Pre-Deployment Checklist Script
# Validates configuration before deployment
# ============================================

set -e

echo "=========================================="
echo "Pre-Deployment Checklist"
echo "=========================================="
echo ""

ERRORS=0
WARNINGS=0

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}Checking for localhost references...${NC}"

# Check for localhost in source code (excluding node_modules, dist, build)
if grep -r "localhost" --include="*.js" --include="*.jsx" --include="*.ts" --include="*.tsx" --include="*.py" \
    --exclude-dir="node_modules" --exclude-dir="dist" --exclude-dir="build" --exclude-dir="__pycache__" \
    --exclude="pre-deploy-check.sh" --exclude="*.example" --exclude="README.md" --exclude="*.md" \
    frontend/src backend/app 2>/dev/null | grep -v "// " | grep -v "# " | grep -v "/\*"; then
    echo -e "${RED}✗ Found localhost references in source code!${NC}"
    ERRORS=$((ERRORS + 1))
else
    echo -e "${GREEN}✓ No localhost references in source code${NC}"
fi

echo ""
echo -e "${YELLOW}Checking environment files...${NC}"

# Check if production env files exist
if [ ! -f ".env.production" ]; then
    echo -e "${RED}✗ .env.production not found${NC}"
    ERRORS=$((ERRORS + 1))
else
    echo -e "${GREEN}✓ .env.production exists${NC}"
    
    # Check for placeholder values
    if grep -q "CHANGE_THIS" .env.production; then
        echo -e "${RED}✗ .env.production contains placeholder values${NC}"
        ERRORS=$((ERRORS + 1))
    else
        echo -e "${GREEN}✓ .env.production configured${NC}"
    fi
fi

if [ ! -f "backend/.env.production" ]; then
    echo -e "${RED}✗ backend/.env.production not found${NC}"
    ERRORS=$((ERRORS + 1))
else
    echo -e "${GREEN}✓ backend/.env.production exists${NC}"
fi

if [ ! -f "frontend/.env.production" ]; then
    echo -e "${RED}✗ frontend/.env.production not found${NC}"
    ERRORS=$((ERRORS + 1))
else
    echo -e "${GREEN}✓ frontend/.env.production exists${NC}"
fi

echo ""
echo -e "${YELLOW}Checking Docker configuration...${NC}"

if [ ! -f "docker-compose.prod.yml" ]; then
    echo -e "${RED}✗ docker-compose.prod.yml not found${NC}"
    ERRORS=$((ERRORS + 1))
else
    echo -e "${GREEN}✓ docker-compose.prod.yml exists${NC}"
fi

if [ ! -f "nginx/conf.d/production.conf" ]; then
    echo -e "${RED}✗ nginx/conf.d/production.conf not found${NC}"
    ERRORS=$((ERRORS + 1))
else
    echo -e "${GREEN}✓ nginx production config exists${NC}"
fi

echo ""
echo -e "${YELLOW}Checking Git status...${NC}"

# Check if there are uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo -e "${YELLOW}⚠ You have uncommitted changes${NC}"
    WARNINGS=$((WARNINGS + 1))
else
    echo -e "${GREEN}✓ No uncommitted changes${NC}"
fi

# Check if .env files are in gitignore
if git check-ignore .env.production > /dev/null 2>&1; then
    echo -e "${GREEN}✓ .env.production is in .gitignore${NC}"
else
    echo -e "${RED}✗ .env.production is NOT in .gitignore${NC}"
    ERRORS=$((ERRORS + 1))
fi

echo ""
echo "=========================================="
echo "Summary"
echo "=========================================="
echo -e "Errors: ${RED}$ERRORS${NC}"
echo -e "Warnings: ${YELLOW}$WARNINGS${NC}"
echo ""

if [ $ERRORS -gt 0 ]; then
    echo -e "${RED}✗ Pre-deployment check FAILED${NC}"
    echo "Please fix the errors above before deploying."
    exit 1
else
    echo -e "${GREEN}✓ Pre-deployment check PASSED${NC}"
    if [ $WARNINGS -gt 0 ]; then
        echo -e "${YELLOW}Note: There are warnings to review${NC}"
    fi
    echo ""
    echo "You can proceed with deployment:"
    echo "  1. Commit and push your code to Git"
    echo "  2. SSH to your server"
    echo "  3. Clone/pull the repository"
    echo "  4. Run: sudo bash deploy.sh"
    exit 0
fi
