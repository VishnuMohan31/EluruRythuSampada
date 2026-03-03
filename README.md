# Eluru Rythu Sampada - Farmers Marketplace Portal

## Quick Start Guide

### Prerequisites
- Docker Desktop installed and running
- Git (optional)

### Setup & Run (3 Simple Steps)

#### Step 1: Run Setup Script
**Windows:**
```bash
setup.bat
```

**Linux/Mac:**
```bash
chmod +x setup.sh
./setup.sh
```

This will:
- Create `shared_data` folder structure
- Create `.env` configuration files
- Set up storage directories

#### Step 2: Start All Services
```bash
docker-compose up -d
```

This automatically:
- Starts PostgreSQL database on port 5434
- Creates all tables from `backend/database/01_create_tables.sql`
- Starts FastAPI backend on port 8004
- Starts React frontend on port 3004
- Creates default admin user

#### Step 3: Access Application
- **Frontend (UI)**: http://localhost:3004
- **Backend API Docs**: http://localhost:8004/docs
- **Default Login**: admin@shg.com / admin123

---

## Port Configuration

| Port | Service | Description |
|------|---------|-------------|
| 3004 | Frontend | React UI (Nginx) |
| 8004 | Backend | FastAPI API Server |
| 5434 | PostgreSQL | Database |

---

## Project Structure

```
EluruRythuSapmadha_Development/
├── backend/              # FastAPI backend
│   ├── app/             # Application code
│   ├── database/        # SQL initialization scripts
│   └── Dockerfile
├── frontend/            # React frontend
│   ├── src/            # React source code
│   └── Dockerfile
├── shared_data/         # Auto-created by setup script
│   ├── postgres/       # Database files
│   ├── storage/        # Uploaded images
│   ├── logs/           # Application logs
│   └── backups/        # Database backups
├── docker-compose.yml   # Docker orchestration
├── setup.bat           # Windows setup script
└── setup.sh            # Linux/Mac setup script
```

---

## Common Commands

### Start Services
```bash
docker-compose up -d
```

### Stop Services
```bash
docker-compose down
```

### View Logs
```bash
# All services
docker-compose logs -f

# Backend only
docker logs shg_backend -f

# Frontend only
docker logs shg_frontend -f

# Database only
docker logs shg_postgres -f
```

### Restart Services
```bash
# Restart all
docker-compose restart

# Restart backend only
docker-compose restart backend

# Restart frontend only
docker-compose restart frontend
```

### Check Service Status
```bash
docker-compose ps
```

### Access Database Shell
```bash
docker exec -it shg_postgres psql -U postgres -d shg_marketplace
```

### Reset Database (WARNING: Deletes all data)
```bash
docker-compose down -v
docker-compose up -d
```

---

## Development Workflow

### Backend Development
1. Edit files in `backend/app/`
2. Changes auto-reload (FastAPI hot-reload enabled)
3. No need to restart container

### Frontend Development
For live development with hot-reload:
```bash
cd frontend
npm install
npm run dev
```
Access at: http://localhost:5173

For production build (Docker):
```bash
docker-compose up -d --build frontend
```

### Database Changes
1. Edit SQL files in `backend/database/`
2. Reset database to apply changes:
```bash
docker-compose down -v
docker-compose up -d
```

---

## Configuration Files

### Root `.env`
Main configuration for Docker Compose
- Database credentials
- Port mappings
- Shared data path

### `backend/.env`
Backend-specific configuration
- JWT secrets
- AWS S3 credentials
- Email settings
- Rate limiting

### `frontend/.env`
Frontend-specific configuration
- API URL
- reCAPTCHA keys
- Feature flags

---

## Troubleshooting

### Port Already in Use
If ports 3004, 8004, or 5434 are already in use:
1. Stop the conflicting service
2. Or edit `.env` to use different ports

### Database Connection Failed
```bash
# Check if postgres is healthy
docker-compose ps

# View postgres logs
docker logs shg_postgres -f

# Restart postgres
docker-compose restart postgres
```

### Backend Not Starting
```bash
# View backend logs
docker logs shg_backend -f

# Rebuild backend
docker-compose up -d --build backend
```

### Frontend Not Loading
```bash
# View frontend logs
docker logs shg_frontend -f

# Rebuild frontend
docker-compose up -d --build frontend
```

### Clear Everything and Start Fresh
```bash
# Stop and remove all containers, volumes, and networks
docker-compose down -v

# Remove shared_data (optional - deletes all data)
# Windows: rmdir /s shared_data
# Linux: rm -rf shared_data

# Run setup again
setup.bat  # or ./setup.sh

# Start services
docker-compose up -d
```

---

## Application Features

- **Multi-language Support**: English + Telugu
- **6 Themes**: Government Heritage, SHG Earth, Modern Marketplace, Vibrant Festival, Eco Sustainable, Dark Theme
- **Role-Based Access**: Admin, Super Admin, Buyer, Guest
- **Product Management**: Upload, approve, manage products
- **Vendor Contact System**: Rate-limited buyer-vendor communication
- **Analytics Dashboard**: Product views, engagement metrics
- **Soft Delete**: Safe deletion with audit trail

---

## Default Credentials

**Admin Account:**
- Email: admin@shg.com
- Password: admin123

**Important**: Change the default password after first login!

---

## Technology Stack

- **Frontend**: React 18 + Vite
- **Backend**: FastAPI (Python 3.11)
- **Database**: PostgreSQL 14
- **Web Server**: Nginx
- **Containerization**: Docker + Docker Compose

---

## Support & Documentation

- **API Documentation**: http://localhost:8004/docs (when running)
- **Requirements**: See `REQUIREMENTS.md`
- **Database Schema**: See `DATABASE_SCHEMA.md`
- **API Endpoints**: See `API_ENDPOINTS.md`
- **Application Flow**: See `APPLICATION_FLOW.md`

---

## Production Deployment

For production deployment on Hostinger VPS:
1. Use `docker-compose.prod.yml`
2. Configure SSL certificates
3. Set up proper environment variables
4. Enable automated backups
5. Configure AWS S3 for image storage

See `DEPLOYMENT_ISSUES_RESOLVED.md` for detailed deployment guide.

---

**Powered by DataLegos Tech Solutions Pvt. Ltd.**
