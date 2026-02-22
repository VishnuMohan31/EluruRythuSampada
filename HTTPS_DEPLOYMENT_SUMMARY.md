# HTTPS Deployment - Complete Solution

## Current Status
- Frontend: Running on port 3000, proxied via Nginx with HTTPS ✓
- Backend: Running on port 8000, proxied via Nginx ✓
- Issue: CORS blocking HTTPS requests from frontend to backend

## Root Cause
Backend CORS_ORIGINS in `.env` only allows HTTP origins, not HTTPS.

## Solution

### Step 1: Update Backend CORS Configuration

Edit `/opt/SwayamEluruConnect/backend/.env`:

```bash
CORS_ORIGINS=https://swayameluruconnect.in,https://www.swayameluruconnect.in,http://swayameluruconnect.in,http://www.swayameluruconnect.in,http://62.171.191.132:3000,http://localhost:3000
```

### Step 2: Restart Backend

```bash
cd /opt/SwayamEluruConnect
docker-compose restart backend
```

### Step 3: Verify Frontend Environment

Ensure `/opt/SwayamEluruConnect/frontend/.env` has:

```
VITE_API_URL=https://swayameluruconnect.in
```

### Step 4: Clear Browser Cache

Hard refresh: Ctrl+Shift+R or use Incognito mode

## Architecture

```
Browser (HTTPS)
    ↓
Nginx (SSL Termination)
    ↓
├── Frontend (port 3000) - Vite dev server
└── Backend (port 8000) - FastAPI
```

## Verification Commands

```bash
# Check backend is running
docker ps

# Check backend CORS config
cat /opt/SwayamEluruConnect/backend/.env | grep CORS

# Check frontend env
cat /opt/SwayamEluruConnect/frontend/.env

# Test backend health
curl http://localhost:8000/health

# Check Nginx config
sudo nginx -t

# View Nginx logs
sudo tail -f /var/log/nginx/error.log
```

## Expected Result

After these changes:
- ✓ https://swayameluruconnect.in → Works with HTTPS
- ✓ API calls → No CORS errors
- ✓ Login → Successful
- ✓ All features → Working

## Troubleshooting

If still not working:
1. Check backend logs: `docker logs shg_backend --tail 50`
2. Check if frontend restarted with new env
3. Clear browser cache completely
4. Try different browser/incognito mode
