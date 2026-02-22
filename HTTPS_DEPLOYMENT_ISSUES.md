# HTTPS Deployment Issues - Lessons Learned

## What We Tried
Deploy the application with HTTPS using Nginx reverse proxy on domain: swayameluruconnect.in

## Issues Faced

### 1. Mixed Content Errors
**Problem**: Browser blocked HTTP requests from HTTPS page
- Frontend loaded via HTTPS (https://swayameluruconnect.in)
- But API calls went to HTTP (http://62.171.191.132:8000)
- Browser security blocked these "mixed content" requests

**Why**: Frontend build had wrong API URL baked in

### 2. CORS Errors
**Problem**: Backend rejected requests from HTTPS domain
- Backend CORS only allowed HTTP origins
- HTTPS requests were blocked

**Why**: Backend `.env` CORS_ORIGINS didn't include HTTPS domain

### 3. Vite Host Restriction
**Problem**: Vite dev server rejected requests from domain
- Error: "Invalid Host header"

**Why**: Vite security feature blocks unknown hosts

### 4. Build Cache Issues
**Problem**: Changes not reflecting after rebuild
- Updated `.env` files
- Rebuilt frontend
- But old API URLs still being used

**Why**: Browser cached old build files

### 5. Configuration Confusion
**Problem**: Multiple config files got out of sync
- Local workspace `.env`
- Production server `.env`
- Different values in each

**Why**: Changes made locally weren't on server, and vice versa

### 6. Docker Container Corruption
**Problem**: Docker containers failed to restart
- Error: 'ContainerConfig' KeyError

**Why**: Docker metadata got corrupted from multiple restart attempts

## What Finally Worked

### Simple HTTP Deployment
Instead of complex HTTPS setup, we used simple HTTP:

1. **Frontend**: http://62.171.191.132:3000 (Vite dev server)
2. **Backend**: http://62.171.191.132:8000 (Docker)
3. **No Nginx**: Direct access to ports
4. **No Firewall**: All ports open for development

### Configuration
- `frontend/.env`: `VITE_API_URL=http://62.171.191.132:8000`
- `backend/.env`: `CORS_ORIGINS=http://62.171.191.132:3000,http://localhost:3000`
- Frontend runs in screen session
- Backend runs in Docker

## Key Lessons

1. **Keep it simple**: HTTP works fine for development/testing
2. **Match protocols**: Don't mix HTTP and HTTPS
3. **Check actual files**: Local and server configs must match
4. **Clear caches**: Browser and Docker caches cause confusion
5. **One change at a time**: Multiple simultaneous changes make debugging hard

## When to Use HTTPS

HTTPS with Nginx is good for:
- Production with real users
- When you have time to debug properly
- When security is critical

But for development/demo:
- HTTP is simpler
- Fewer moving parts
- Easier to debug
- Works perfectly fine

## Current Working Setup

```
Browser
  ↓
http://62.171.191.132:3000 (Frontend - Vite dev server)
  ↓
http://62.171.191.132:8000 (Backend - Docker)
  ↓
PostgreSQL (Docker)
```

Simple, direct, and works 100%.
