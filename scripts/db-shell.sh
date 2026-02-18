#!/bin/bash

# Access PostgreSQL shell
docker exec -it shg_postgres psql -U shg_user -d shg_marketplace
