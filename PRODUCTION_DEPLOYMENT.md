# Production Deployment Guide

## Server Details
- IP: 62.171.191.132
- Location: /opt/SwayamEluruConnect
- User: vishnu

## Prerequisites Installed ✓
- Docker: 28.2.2
- Docker Compose: 1.29.2
- Node.js: v20.20.0
- npm: 10.8.2

---

## Step-by-Step Deployment

### 1. Configure Backend Environment
```bash
cd /opt/SwayamEluruConnect
cp backend/.env.example backend/.env
nano backend/.env
```

Update these values in `backend/.env`:
```
DEBUG=False
ENVIRONMENT=production
SECRET_KEY=your-super-secret-key-min-32-chars-change-this
ACCESS_TOKEN_EXPIRE_MINUTES=120
CORS_ORIGINS=http://62.171.191.132:5173,http://62.171.191.132
```

Save: `Ctrl+O`, `Enter`, Exit: `Ctrl+X`

### 2. Configure Frontend Environment
```bash
cp frontend/.env.production frontend/.env
```

This sets `VITE_API_URL=http://62.171.191.132:8000`

### 3. Add User to Docker Group (if not done)
```bash
sudo usermod -aG docker vishnu
newgrp docker
```

### 4. Start Backend + Database
```bash
docker-compose up -d --build
```

Wait 10 seconds for database initialization:
```bash
sleep 10
```

### 5. Verify Containers Running
```bash
docker ps
```

You should see:
- shg_backend (port 8000)
- shg_postgres (port 5432)

### 6. Check Backend Logs (Optional)
```bash
docker logs shg_backend
```

### 7. Install Frontend Dependencies
```bash
cd frontend
npm install
```

### 8. Start Frontend in Screen Session
```bash
screen -S frontend
npm run dev
```

Press `Ctrl+A` then `D` to detach from screen

### 9. Verify Deployment

Backend API: http://62.171.191.132:8000/docs
Frontend App: http://62.171.191.132:5173

---

## Default Admin Credentials
- Email: admin@datalegos.com
- Password: admin123

---

## Useful Commands

### View Frontend Screen
```bash
screen -r frontend
```

### Stop Frontend (inside screen)
```bash
Ctrl+C
```

### Detach from Screen
```bash
Ctrl+A then D
```

### Stop Backend
```bash
docker-compose down
```

### View Backend Logs
```bash
docker logs -f shg_backend
```

### Restart Backend
```bash
docker-compose restart backend
```

### Clean Database (WARNING: Deletes all data)
```bash
docker-compose down -v
docker-compose up -d
```

---

## JWT Token Expiry

Current: 120 minutes (2 hours)

To change, edit `backend/.env`:
```
ACCESS_TOKEN_EXPIRE_MINUTES=240  # 4 hours
```

Then restart backend:
```bash
docker-compose restart backend
```

---

## File Storage

- Product Images: `/opt/SwayamEluruConnect/storage/products/`
- Database: Docker volume `shg_postgres_data`
- Logs: `/opt/SwayamEluruConnect/backend/logs/app.log`

---

## Troubleshooting

### Port Already in Use
```bash
# Check what's using port 8000
sudo lsof -i :8000
# Kill process if needed
sudo kill -9 <PID>
```

### Frontend Not Accessible
```bash
# Check if screen is running
screen -ls
# Reattach and check for errors
screen -r frontend
```

### Backend Not Starting
```bash
# Check logs
docker logs shg_backend
# Check database connection
docker logs shg_postgres
```

---

## Production Checklist

✓ Backend .env configured with production values
✓ Frontend .env points to production API
✓ DEBUG=False in backend
✓ SECRET_KEY changed from default
✓ CORS_ORIGINS includes production URLs
✓ Docker containers running
✓ Frontend running in screen session
✓ Application accessible from browser
