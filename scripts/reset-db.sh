#!/bin/bash

echo "=========================================="
echo "WARNING: This will delete all data!"
echo "=========================================="
read -p "Are you sure? (yes/no): " confirm

if [ "$confirm" = "yes" ]; then
    echo "Stopping containers..."
    docker-compose down -v
    
    echo "Starting fresh..."
    docker-compose up -d
    
    echo ""
    echo "Database reset complete!"
else
    echo "Cancelled."
fi
