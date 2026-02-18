#!/bin/bash

echo "=========================================="
echo "Starting Backend + Database"
echo "=========================================="

# Start Docker containers
docker-compose up -d

# Wait for services to be ready
echo "Waiting for services to start..."
sleep 10

# Show status
docker-compose ps

echo ""
echo "=========================================="
echo "Services Started!"
echo "=========================================="
echo "Backend API: http://localhost:8000"
echo "API Docs: http://localhost:8000/docs"
echo "Database: localhost:5432"
echo ""
echo "View logs: docker-compose logs -f"
echo "=========================================="
