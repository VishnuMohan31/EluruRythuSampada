#!/bin/bash

echo "=========================================="
echo "Starting All Services (Frontend + Backend + Database)"
echo "=========================================="

# Start Docker containers with build
docker-compose up -d --build

# Wait for services to be ready
echo "Waiting for services to start..."
sleep 15

# Show status
docker-compose ps

echo ""
echo "=========================================="
echo "Services Started!"
echo "=========================================="
echo "Frontend: http://localhost:3004"
echo "Backend API: http://localhost:8004"
echo "API Docs: http://localhost:8004/docs"
echo "Database: localhost:5434"
echo ""
echo "View logs: docker-compose logs -f"
echo "Stop services: docker-compose down"
echo "=========================================="
