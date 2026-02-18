# SHG India Marketplace Portal

## Quick Start

### 1. Start Backend + Database (Docker)
```bash
docker-compose up -d
```

This automatically:
- Starts PostgreSQL database
- Creates all tables from `backend/database/01_create_tables.sql`
- Starts FastAPI backend
- Creates default admin user

### 2. Start Frontend (Local)
```bash
cd frontend
npm install  # first time only
npm run dev
```

### 3. Access Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000/docs
- Login: admin@shg.com / admin123

---

## Shell Scripts (Optional)

Located in `scripts/` folder:

| Script | Command | Purpose |
|--------|---------|---------|
| start.sh | `bash scripts/start.sh` | Start backend + database |
| stop.sh | `bash scripts/stop.sh` | Stop all services |
| restart.sh | `bash scripts/restart.sh` | Restart services |
| logs.sh | `bash scripts/logs.sh` | View live logs |
| db-shell.sh | `bash scripts/db-shell.sh` | Access database shell |
| reset-db.sh | `bash scripts/reset-db.sh` | Reset database (deletes all data) |

---

## How It Works

### Database Auto-Setup
When you run `docker-compose up -d`:
1. PostgreSQL container starts
2. Automatically runs `backend/database/01_create_tables.sql`
3. Creates all tables with triggers
4. Inserts default admin user
5. Backend connects and starts

### Configuration
- Root `.env` - Docker configuration
- `backend/.env` - Backend configuration (if running locally)
- `frontend/.env` - Frontend configuration

---

## Common Commands

```bash
# Start everything
docker-compose up -d

# Stop everything
docker-compose down

# View logs
docker-compose logs -f

# Restart backend only
docker-compose restart backend

# Reset database (WARNING: deletes all data)
docker-compose down -v
docker-compose up -d

# Access database
docker exec -it shg_postgres psql -U shg_user -d shg_marketplace
```

---

## Architecture

- **Database**: PostgreSQL 14 (Docker container)
- **Backend**: FastAPI + Python 3.11 (Docker container)
- **Frontend**: React + Vite (Local npm dev server)

---

## Default Credentials

- Email: admin@shg.com
- Password: admin123
