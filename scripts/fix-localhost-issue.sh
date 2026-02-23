#!/bin/bash

# Script to fix localhost:8000 hardcoded URLs in production
# This script should be run on the production server

set -e

echo "========================================="
echo "Fixing localhost:8000 hardcoded URLs"
echo "========================================="

# Navigate to project directory
cd /opt/SwayamEluruConnect

echo ""
echo "Step 1: Pulling latest code from GitHub..."
git pull origin main

echo ""
echo "Step 2: Verifying code changes..."
echo "Checking api.js for correct API_BASE_URL..."
grep "const API_BASE_URL" frontend/src/utils/api.js

echo ""
echo "Step 3: Checking for any remaining localhost:8000 references..."
if grep -r "localhost:8000" frontend/src/ --exclude-dir=node_modules 2>/dev/null; then
    echo "ERROR: Found localhost:8000 references in source code!"
    exit 1
else
    echo "✓ No localhost:8000 found in source code"
fi

echo ""
echo "Step 4: Cleaning old build..."
rm -rf frontend/dist

echo ""
echo "Step 5: Rebuilding frontend with production environment..."
cd frontend
npm run build

echo ""
echo "Step 6: Verifying build does not contain localhost:8000..."
if grep -r "localhost:8000" dist/ 2>/dev/null; then
    echo "ERROR: Build still contains localhost:8000!"
    exit 1
else
    echo "✓ Build is clean - no localhost:8000 found"
fi

echo ""
echo "Step 7: Checking dist folder contents..."
ls -lh dist/

echo ""
echo "Step 8: Restarting nginx container..."
cd /opt/SwayamEluruConnect
sudo docker-compose -f docker-compose.prod.yml --env-file .env.production restart nginx

echo ""
echo "Step 9: Waiting for nginx to start..."
sleep 5

echo ""
echo "Step 10: Verifying nginx has the new files..."
docker-compose -f docker-compose.prod.yml exec nginx ls -la /usr/share/nginx/html/

echo ""
echo "========================================="
echo "✓ Fix completed successfully!"
echo "========================================="
echo ""
echo "Next steps:"
echo "1. Clear your browser cache (Ctrl+Shift+Delete)"
echo "2. Hard refresh the page (Ctrl+Shift+R)"
echo "3. Check browser console for any remaining errors"
echo ""
