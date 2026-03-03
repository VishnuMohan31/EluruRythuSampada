#!/bin/bash

echo "=========================================="
echo "Eluru Rythu Sampada - Setup Script"
echo "=========================================="
echo ""

# Create shared_data directory structure
echo "Creating EluruRythuSampada_Shared_data directory structure..."
mkdir -p ../EluruRythuSampada_Shared_data/postgres
mkdir -p ../EluruRythuSampada_Shared_data/storage/products
mkdir -p ../EluruRythuSampada_Shared_data/storage/temp
mkdir -p ../EluruRythuSampada_Shared_data/logs
mkdir -p ../EluruRythuSampada_Shared_data/backups

echo "✓ Shared data directories created"
echo ""

# Create .env files if they don't exist
if [ ! -f .env ]; then
    echo "Creating root .env file..."
    cp .env.example .env
    echo "✓ Root .env created"
else
    echo "✓ Root .env already exists"
fi

if [ ! -f backend/.env ]; then
    echo "Creating backend .env file..."
    cp backend/.env.example backend/.env
    echo "✓ Backend .env created"
else
    echo "✓ Backend .env already exists"
fi

if [ ! -f frontend/.env ]; then
    echo "Creating frontend .env file..."
    cp frontend/.env.example frontend/.env
    echo "✓ Frontend .env created"
else
    echo "✓ Frontend .env already exists"
fi

echo ""
echo "=========================================="
echo "Setup Complete!"
echo "=========================================="
echo ""
echo "Port Configuration:"
echo "  - Frontend (UI):    http://localhost:3004"
echo "  - Backend (API):    http://localhost:8004"
echo "  - PostgreSQL:       localhost:5434"
echo ""
echo "Next Steps:"
echo "  1. Review and update .env files if needed"
echo "  2. Run: docker-compose up -d"
echo "  3. Access application at http://localhost:3004"
echo ""
echo "Default Login:"
echo "  Email: admin@shg.com"
echo "  Password: admin123"
echo ""
