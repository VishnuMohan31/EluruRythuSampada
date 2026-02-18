#!/bin/bash

echo "=========================================="
echo "Restarting Backend + Database"
echo "=========================================="

docker-compose restart

echo ""
echo "Services restarted successfully!"
