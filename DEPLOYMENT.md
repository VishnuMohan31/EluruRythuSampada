# Production Deployment – NGINX, HTTPS, CSP

## 1. Why CSP Was Blocking API Calls (Root Cause)

- **Symptom:** Console: *Connecting to 'http://swayameluruconnect.in/api/...' violates connect-src 'self' data: https:*
- **Cause:** The frontend bundle was built with an absolute API URL (e.g. `http://...` or `https://...`). When the page was served over HTTPS, requests still went to `http://...`, so the browser blocked them (CSP allows only `'self'`, `data:`, and `https:`).
- **Fix in code:** Production builds now **always** use **relative** API paths (`/api/...`) via `import.meta.env.PROD` in `frontend/src/utils/api.js`. No env variable can override this in production, so API calls always use the same origin and protocol as the page (HTTPS when the site is HTTPS).

---

## 2. NGINX Configuration (Checklist)

- **HTTP → HTTPS:** Redirect all HTTP (port 80) to HTTPS (301). Your `app.conf` already does this.
- **Single HTTPS server block:** One `server` on 443 with `server_name swayameluruconnect.in`.
- **Frontend:** `root /usr/share/nginx/html;` (or your build output); `try_files $uri $uri/ /index.html;` for SPA.
- **API proxy:** `location /api/ { proxy_pass http://backend:8000/api/; }` with headers:
  - `Host $host; X-Real-IP $remote_addr; X-Forwarded-For $proxy_add_x_forwarded_for; X-Forwarded-Proto $scheme;`
- **SSL:** `ssl_certificate` and `ssl_certificate_key` (e.g. Let’s Encrypt). Only TLS 1.2/1.3.
- **Ports:** Only 80, 443, 22 open; no direct backend port exposed.

---

## 3. CSP Headers (Recommended)

Current `connect-src 'self' data: https:` is correct once the frontend uses relative URLs:

- **Same-origin API:** Requests to `/api/...` are same-origin (`'self'`), so they are allowed.
- No need to add `http:`; production should be HTTPS-only.

If you need to allow a separate API domain (e.g. `https://api.swayameluruconnect.in`), add it explicitly:

```nginx
add_header Content-Security-Policy "... connect-src 'self' data: https: https://api.swayameluruconnect.in;" always;
```

---

## 4. SSL Validation Checklist

- [ ] Certificates under `/etc/letsencrypt/live/swayameluruconnect.in/` (or your path).
- [ ] Certbot/cron for auto-renewal (e.g. `0 0 * * * certbot renew --quiet`).
- [ ] `nginx -t` passes; reload: `nginx -s reload`.
- [ ] Browser: https://swayameluruconnect.in/ — padlock, no mixed content.
- [ ] `openssl s_client -connect swayameluruconnect.in:443 -servername swayameluruconnect.in` shows the correct cert and no protocol errors.

---

## 5. Ansible Playbook Structure (High Level)

```text
playbook.yml
├── roles/
│   ├── ssl/
│   │   └── tasks: install certbot, request/renew cert, copy certs path into vars
│   ├── nginx/
│   │   └── tasks: install nginx, deploy app.conf (templates/nginx-app.conf.j2), enable site, reload
│   ├── app/
│   │   └── tasks: clone repo, npm ci, npm run build, copy dist to /usr/share/nginx/html (or your root)
│   └── firewall/
│       └── tasks: ufw allow 22,80,443; ufw enable
```

- **Order:** SSL (or cert path) → NGINX config → app build/deploy → firewall.
- **Secrets:** Use Ansible Vault or env files for any API keys; do not put them in repo.
- **Idempotency:** Use `copy`/`template` and `nginx -s reload` only when config changed; build/deploy only when code changed (e.g. notify handler for nginx reload).

---

## 6. After Code Change: Deploy Steps on Server

1. Pull latest code (includes `import.meta.env.PROD` fix).
2. `cd frontend && npm ci && npm run build`.
3. Deploy build: e.g. `sudo cp -r dist/* /usr/share/nginx/html/`.
4. `sudo nginx -t && sudo nginx -s reload`.
5. Hard-refresh https://swayameluruconnect.in/ and confirm no CSP/fetch errors and API calls succeed.
