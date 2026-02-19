# Docker Development Guide

## Proper Development Workflow

### ✅ CORRECT APPROACH (Current Setup)

The backend code is now mounted as a Docker volume:
```yaml
volumes:
  - ./backend/app:/app/app:ro  # Backend code mounted
  - ./storage:/app/storage
  - ./backend/logs:/app/logs
```

**Benefits:**
- Code changes reflect immediately (with auto-reload in development)
- No need to copy files manually
- No need to rebuild container for code changes
- Industry standard practice

### How to Make Code Changes

1. **Edit files locally** in `backend/app/`
2. **Changes auto-reload** (FastAPI has auto-reload enabled in DEBUG mode)
3. **No manual steps needed**

### When to Restart Container

Only restart when:
- Changing environment variables in `.env`
- Changing `docker-compose.yml`
- Installing new Python packages (need to rebuild)

**Restart command:**
```bash
docker-compose restart backend
```

### When to Rebuild Container

Only rebuild when:
- Adding new Python dependencies to `requirements.txt`
- Changing `Dockerfile`

**Rebuild command:**
```bash
docker-compose up -d --build backend
```

---

## ❌ WRONG APPROACH (What We Fixed)

**Don't do this:**
```bash
# BAD - Manual file copying
docker cp backend/app/api/file.py shg_backend:/app/app/api/file.py
docker restart shg_backend
```

**Why it's wrong:**
- Manual and error-prone
- Changes lost on container restart
- Not version controlled
- Not reproducible
- Not industry standard

---

## Development Commands

### Start all services
```bash
docker-compose up -d
```

### Stop all services
```bash
docker-compose down
```

### View logs
```bash
# Backend logs
docker logs shg_backend -f

# Database logs
docker logs shg_postgres -f
```

### Check service status
```bash
docker-compose ps
```

### Access backend shell
```bash
docker exec -it shg_backend sh
```

### Access database
```bash
docker exec -it shg_postgres psql -U shg_user -d shg_marketplace
```

---

## File Structure

```
backend/
├── app/              # ← Mounted as volume (changes auto-reload)
│   ├── api/
│   ├── models/
│   ├── schemas/
│   └── ...
├── database/         # ← Mounted for DB initialization
├── logs/             # ← Mounted for log persistence
└── Dockerfile

storage/              # ← Mounted for file uploads
```

---

## Auto-Reload Feature

FastAPI auto-reload is enabled in development mode:
- Edit any `.py` file in `backend/app/`
- Save the file
- Backend automatically restarts (takes 2-3 seconds)
- No manual intervention needed

**Watch the logs to see auto-reload:**
```bash
docker logs shg_backend -f
```

You'll see:
```
INFO:     Detected file change, reloading...
INFO:     Shutting down
INFO:     Starting SHG India Marketplace v1.0.0
```

---

## Production Deployment

For production, use a different approach:
1. Remove volume mount for code
2. Build image with code baked in
3. Use proper image versioning
4. Deploy to container registry

**Production docker-compose.yml:**
```yaml
backend:
  image: your-registry/shg-backend:1.0.0  # Use built image
  # No code volume mount
  volumes:
    - ./storage:/app/storage
    - ./backend/logs:/app/logs
```

---

## Summary

✅ **Now:** Code mounted as volume → Edit locally → Auto-reload  
❌ **Before:** Manual `docker cp` → Restart → Error-prone  

This is the industry-standard approach for Docker development.
