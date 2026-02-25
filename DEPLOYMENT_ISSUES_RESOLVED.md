# Production Deployment Issues - Resolution Log

## Date: February 24, 2026
## Domain: swayameluruconnect.in
## Server: 62.171.191.132

---

## Issues Encountered and Resolutions

### Issue 1: Hardcoded localhost:8000 URLs in Frontend
**Problem:**
- Frontend code had hardcoded `'http://localhost:8000'` as fallback for API_BASE_URL
- This caused API calls to fail in production with CSP violations

**Root Cause:**
- Multiple frontend files had: `const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'`
- Old build files were cached in browser and nginx container

**Solution:**
- Changed all occurrences to: `const API_BASE_URL = import.meta.env.VITE_API_URL || ''`
- Updated 10 files:
  - frontend/src/utils/api.js
  - frontend/src/pages/public/HomePage.jsx
  - frontend/src/pages/public/ProductsPage.jsx
  - frontend/src/pages/public/ProductDetailPage.jsx
  - frontend/src/pages/super-admin/SuperAdminLogin.jsx
  - frontend/src/pages/super-admin/Reports.jsx
  - frontend/src/pages/super-admin/ManageProducts.jsx
  - frontend/src/pages/admin/AdminLogin.jsx
  - frontend/src/pages/admin/Reports.jsx
  - frontend/src/components/product/ProductCard.jsx
- Rebuilt frontend: `npm run build`
- Restarted nginx container

**Files Modified:**
- All frontend files listed above
- frontend/.env.production

---

### Issue 2: Content Security Policy (CSP) Blocking data: URLs
**Problem:**
- CSP header was blocking `data:` URLs in connect-src directive
- Error: "Refused to connect to 'data:' because it violates CSP directive"

**Root Cause:**
- nginx CSP configuration didn't include `data:` in `connect-src`

**Solution:**
- Updated nginx/conf.d/app.conf CSP header:
  ```
  connect-src 'self' data: https:;
  ```
- Reloaded nginx configuration

**Files Modified:**
- nginx/conf.d/app.conf

---

### Issue 3: FastAPI Redirecting to HTTP URLs
**Problem:**
- API calls to `/api/categories` were being redirected to `http://swayameluruconnect.in/api/categories/`
- This caused CSP violations because HTTP was blocked

**Root Cause:**
- FastAPI automatically redirects URLs without trailing slashes to URLs with trailing slashes
- The redirect was using HTTP protocol instead of HTTPS
- FastAPI wasn't aware of the HTTPS proxy (nginx) in front of it

**Solution:**
- Added custom middleware to backend/app/main.py:
  ```python
  class HTTPSRedirectMiddleware(BaseHTTPMiddleware):
      async def dispatch(self, request, call_next):
          response = await call_next(request)
          
          # If it's a redirect response, ensure it uses HTTPS
          if response.status_code in (301, 302, 303, 307, 308):
              location = response.headers.get("location", "")
              if location.startswith("http://"):
                  forwarded_proto = request.headers.get("x-forwarded-proto", "https")
                  if forwarded_proto == "https":
                      new_location = location.replace("http://", "https://", 1)
                      response.headers["location"] = new_location
          
          return response
  ```
- This middleware intercepts redirects and converts HTTP to HTTPS
- Restarted backend container

**Files Modified:**
- backend/app/main.py

---

### Issue 4: Git Pull Conflicts on Production Server
**Problem:**
- `git pull` failed with error: "Your local changes would be overwritten by merge"
- Files in conflict: frontend/.env.production, nginx/conf.d/app.conf

**Root Cause:**
- Production server had local modifications to configuration files
- These conflicted with incoming changes from GitHub

**Solution:**
- Used `git stash` to temporarily save local changes
- Pulled latest code from GitHub
- Applied local changes back with `git stash pop`
- Resolved conflicts by keeping production-specific settings

**Commands Used:**
```bash
git stash
git pull origin main
git stash pop
```

---

### Issue 5: Frontend Build Not Updating in Nginx Container
**Problem:**
- After code changes, browser still showed old errors
- Nginx container was serving old build files

**Root Cause:**
- Frontend wasn't rebuilt after code changes
- Nginx container needed restart to pick up new files
- Browser cache was serving old JavaScript files

**Solution:**
1. Rebuilt frontend:
   ```bash
   cd frontend
   rm -rf dist
   npm run build
   ```
2. Restarted nginx:
   ```bash
   sudo docker-compose -f docker-compose.prod.yml restart nginx
   ```
3. Cleared browser cache completely
4. Used incognito mode to test without cache

---

### Issue 6: Product Images Not Loading (404 Errors)
**Problem:**
- Product images were returning 404 errors
- Browser console showed: `GET /storage/products/filename.jpg 404 (Not Found)`
- Nginx error logs showed: `open() "/usr/share/nginx/html/storage/products/filename.jpg" failed (2: No such file or directory)`

**Root Cause:**
- Images were stored in `/opt/SwayamEluruConnect/storage/products/` on host
- Backend container had access via volume mount: `./storage:/app/storage`
- Backend could serve images successfully (tested with curl inside container)
- **BUT:** Nginx location block priority issue
  - Nginx has this priority order: exact match → prefix with `^~` → regex → prefix
  - The regex location `~* \.(jpg|jpeg|png|...)$` was matching `/storage/*.jpg` BEFORE the prefix location `/storage/`
  - This caused nginx to try serving from `/usr/share/nginx/html/storage/` (which doesn't exist) instead of proxying to backend

**Solution:**
1. Added nginx location block to proxy `/storage/` requests to backend
2. Used `^~` modifier to give `/storage/` higher priority than regex patterns:
   ```nginx
   location ^~ /storage/ {
       proxy_pass http://backend:8000/storage/;
       proxy_http_version 1.1;
       proxy_set_header Host $host;
       proxy_set_header X-Real-IP $remote_addr;
       proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       proxy_set_header X-Forwarded-Proto $scheme;
       
       # Cache images for 1 year
       proxy_cache_valid 200 365d;
       add_header Cache-Control "public, immutable";
   }
   ```
3. Deleted interfering `nginx/conf.d/temp.conf` file
4. Restarted nginx container

**Key Learning:**
- The `^~` modifier in nginx means: "If this prefix matches, don't check regex locations"
- Without `^~`, regex locations have higher priority than regular prefix locations
- Location matching order: exact `=` → prefix `^~` → regex `~*` or `~` → prefix (longest match)

**Files Modified:**
- nginx/conf.d/app.conf
- Deleted: nginx/conf.d/temp.conf

**Verification:**
```bash
# Test image loading
curl -I https://swayameluruconnect.in/storage/products/aa996c8d-142e-4911-99ab-8038ca9cf8e7.jpg
# Should return: HTTP/2 200
```

---

## Final Configuration

### Frontend Environment (.env.production)
```
VITE_API_URL=
```
Empty string forces relative URLs that automatically use the same protocol as the page (HTTPS).

### Nginx CSP Header
```
Content-Security-Policy: default-src 'self' https:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: https:; font-src 'self' data: https:; connect-src 'self' data: https:;
```

### Backend Middleware
- HTTPSRedirectMiddleware converts all HTTP redirects to HTTPS
- Respects X-Forwarded-Proto header from nginx

---

## Verification Steps

### 1. Check API Endpoint
```bash
curl https://swayameluruconnect.in/api/categories -v
```
Should return HTTP/2 307 redirect to `https://swayameluruconnect.in/api/categories/` (with HTTPS)

### 2. Check Frontend Build
```bash
grep -r "localhost:8000" /opt/SwayamEluruConnect/frontend/dist/
```
Should return nothing (no localhost:8000 in build)

### 3. Check Nginx Container
```bash
docker-compose -f docker-compose.prod.yml exec nginx ls -la /usr/share/nginx/html/
```
Should show index.html and assets folder with recent timestamps

### 4. Check Backend Logs
```bash
docker-compose -f docker-compose.prod.yml logs backend --tail 50
```
Should show no errors, healthy startup

### 5. Check Image Loading
```bash
curl -I https://swayameluruconnect.in/storage/products/aa996c8d-142e-4911-99ab-8038ca9cf8e7.jpg
```
Should return HTTP/2 200 with content-type: image/jpeg

---

## Potential Future Issues

### 1. Browser Cache
**Issue:** Users may still see old cached files
**Prevention:** 
- Implement cache busting with versioned asset filenames (Vite does this automatically)
- Set appropriate cache headers in nginx for static assets
- Current config already has: `expires 1y` for static assets

### 2. SSL Certificate Renewal
**Issue:** Let's Encrypt certificates expire every 90 days
**Prevention:**
- Certbot container is configured to auto-renew
- Monitor certificate expiry: `docker-compose -f docker-compose.prod.yml logs certbot`
- Manual renewal if needed: `docker-compose -f docker-compose.prod.yml restart certbot`

### 3. Database Backups
**Issue:** No automated database backups configured
**Recommendation:**
- Set up automated PostgreSQL backups
- Store backups off-server
- Test restore procedures

### 4. Log Rotation
**Issue:** Logs can grow indefinitely
**Current State:** Docker handles log rotation by default
**Recommendation:** Monitor disk space regularly

### 5. API Rate Limiting
**Issue:** No rate limiting configured
**Recommendation:**
- Add rate limiting middleware to FastAPI
- Protect against DDoS and abuse

### 6. Monitoring
**Issue:** No uptime monitoring
**Recommendation:**
- Set up monitoring service (UptimeRobot, Pingdom, etc.)
- Monitor: uptime, response time, SSL certificate expiry
- Set up alerts for downtime

---

## Deployment Checklist for Future Updates

### Code Changes
- [ ] Make changes locally
- [ ] Test locally with `npm run dev` (frontend) and `uvicorn app.main:app --reload` (backend)
- [ ] Commit changes: `git add . && git commit -m "Description"`
- [ ] Push to GitHub: `git push origin main`

### Server Deployment
- [ ] SSH to server: `ssh vishnu@62.171.191.132`
- [ ] Navigate to project: `cd /opt/SwayamEluruConnect`
- [ ] Pull changes: `git pull origin main`
- [ ] If frontend changed: `cd frontend && rm -rf dist && npm run build && cd ..`
- [ ] Restart services: `sudo docker-compose -f docker-compose.prod.yml restart nginx backend`
- [ ] Verify: `curl https://swayameluruconnect.in/api/health`

### Browser Testing
- [ ] Clear browser cache (Ctrl + Shift + Delete)
- [ ] Test in incognito mode first
- [ ] Check console for errors (F12)
- [ ] Test all major features
- [ ] Test on mobile devices

---

## Summary

All issues have been resolved. The application is now running correctly with:
- ✅ All API calls using HTTPS
- ✅ No CSP violations
- ✅ No hardcoded localhost URLs
- ✅ Proper redirect handling
- ✅ Clean browser console
- ✅ Categories and products loading successfully
- ✅ Product images loading correctly via nginx proxy to backend

The deployment is production-ready and stable.

---

## Contact & Support

**Developer:** DataLegos Tech Solutions Pvt. Ltd.
**Server:** 62.171.191.132 (user: vishnu)
**Domain:** swayameluruconnect.in
**GitHub:** https://github.com/VishnuMohan31/SwayamEluruConnect

For issues, check:
1. Backend logs: `docker-compose -f docker-compose.prod.yml logs backend`
2. Nginx logs: `docker-compose -f docker-compose.prod.yml logs nginx`
3. Browser console (F12)
