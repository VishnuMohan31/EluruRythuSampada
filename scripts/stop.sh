#!/bin/bash

echo "=========================================="
echo "Stopping Backend + Database"
echo "=========================================="

docker-compose down

echo ""
echo "Services stopped successfully!"
