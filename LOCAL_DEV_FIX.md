# Local Development Setup - Changes Made

## Critical Configuration

### Backend (backend/app/main.py)
- **HTTPS Redirect Middleware**: Only runs in production (`if not settings.DEBUG`)
- **CORS**: Development allows all origins, production uses specific origins from env

### Frontend (.env)
```
VITE_API_URL=http://localhost:8000
```

### Frontend (src/utils/api.js)
- Uses `VITE_API_URL` from environment
- Defaults to `http://localhost:8000` if not set

## Running Locally

### Backend (Docker)
```bash
docker compose down -v
docker system prune -af
docker compose up -d --build
```
- Backend: http://localhost:8000
- Database: PostgreSQL on port 5432

### Frontend (Separate Dev Server)
```bash
cd frontend
npm run dev
```
- Frontend: http://localhost:3000

## Production Deployment Notes

### IMPORTANT: API URL Configuration
1. **Production .env** must have: `VITE_API_URL=https://yourdomain.com`
2. **Backend** will use HTTPS redirect middleware (DEBUG=False)
3. **CORS** will use specific origins from CORS_ORIGINS env variable

### Environment Variables to Change for Production
- `DEBUG=False`
- `ENVIRONMENT=production`
- `VITE_API_URL=https://yourdomain.com` (frontend)
- `CORS_ORIGINS=https://yourdomain.com` (backend)

## Key Points
- Local: HTTP on localhost
- Production: HTTPS with domain
- API URL is environment-based, NOT hardcoded
- HTTPS redirect only active in production
