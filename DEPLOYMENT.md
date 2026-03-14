# Belle House Website — VPS Deployment Guide

**VPS IP:** `51.91.159.155`  
**Target domain:** `bellehouseniger.com` / `www.bellehouseniger.com`  
**Stack:** Docker + Nginx (static site) + Host Nginx (reverse proxy)

---

## Architecture Overview

```
Internet
   │
   ▼
Host Nginx (already running on VPS, port 80/443)
   ├── api2.bellehouseniger.com  →  existing backend app
   └── bellehouseniger.com       →  proxy to localhost:8081
                                           │
                                           ▼
                                  Docker container
                                  (nginx:alpine, port 8081)
                                  serving static HTML/CSS/JS
```

The host Nginx acts as a **reverse proxy** for all virtual hosts. The website runs in a Docker container on internal port `8081` and is never directly exposed to the internet.

---

## Prerequisites

On the VPS, ensure these are installed:

```bash
# Git
git --version

# Docker
docker --version        # needs 20.10+

# Docker Compose (v2 plugin)
docker compose version  # needs 2.0+

# If not installed:
curl -fsSL https://get.docker.com | sh
apt install docker-compose-plugin -y
```

---

## Step 1 — Push the Project to GitHub (Local Machine)

From your local machine (inside the project folder), push the code to GitHub first.

```bash
# Initialize git if needed
git init

# Add your GitHub repository URL
git remote add origin https://github.com/<your-username>/<your-repo>.git

# Commit files
git add .
git commit -m "Initial Docker deployment setup"

# Push
git branch -M main
git push -u origin main
```

If the repository already exists locally, just do:

```bash
git add .
git commit -m "Update website"
git push origin main
```

---

## Step 2 — Clone the Repository on the VPS

SSH into your VPS and clone the repo:

```bash
ssh root@51.91.159.155

# Create deployment root
mkdir -p /opt
cd /opt

# Clone from GitHub
git clone https://github.com/<your-username>/<your-repo>.git bellehouseniger-web

# Enter project directory
cd /opt/bellehouseniger-web
```

If the repo is private, use either:
- SSH deploy key (`git@github.com:<your-username>/<your-repo>.git`), or
- GitHub PAT with HTTPS.

---

## Step 3 — Build and Start the Docker Container

SSH into the VPS:

```bash
ssh root@51.91.159.155
```

Navigate to the deployment directory and build:

```bash
cd /opt/bellehouseniger-web

# Build the Docker image
docker compose build --no-cache

# Start the container in background
docker compose up -d

# Verify it is running
docker compose ps

# Check logs
docker compose logs bellehouseniger-web
```

Quickly verify the container is serving files:

```bash
curl -I http://localhost:8081
# Expected: HTTP/1.1 200 OK
```

---

## Step 4 — Add the Nginx Virtual Host

This adds a new `server {}` block to the existing Nginx **without touching** the existing app's configuration.

```bash
# Copy the conf file included in the project
cp /opt/bellehouseniger-web/bellehouseniger-web.conf \
   /etc/nginx/conf.d/bellehouseniger-web.conf

# Test nginx configuration
nginx -t
# Expected: configuration file /etc/nginx/nginx.conf test is successful

# Reload nginx (zero-downtime)
nginx -s reload
```

> **Note:** The `bellehouseniger-web.conf` file configures nginx to proxy
> `bellehouseniger.com` → `http://127.0.0.1:8081`.
> The existing backend on `api2.bellehouseniger.com` is unaffected.

---

## Step 5 — Point the Domain to the VPS

In your DNS provider (Namecheap, Cloudflare, OVH, etc.), add/update:

| Type  | Name  | Value            | TTL  |
|-------|-------|------------------|------|
| A     | @     | 51.91.159.155    | 3600 |
| A     | www   | 51.91.159.155    | 3600 |

Wait for DNS propagation (usually 5–30 minutes). Verify:

```bash
# From your local machine
nslookup bellehouseniger.com
# Should return 51.91.159.155
```

Once DNS resolves, test in a browser:

```
http://bellehouseniger.com
```

---

## Step 6 — Enable HTTPS with Let's Encrypt (Recommended)

```bash
# Install Certbot on the VPS
apt install certbot python3-certbot-nginx -y

# Obtain certificate (nginx plugin handles config automatically)
certbot --nginx -d bellehouseniger.com -d www.bellehouseniger.com

# Follow prompts:
#   - Enter your email
#   - Agree to terms
#   - Choose redirect HTTP → HTTPS (option 2, recommended)
```

Certbot will automatically:
- Obtain the SSL certificate
- Update `bellehouseniger-web.conf` to add the HTTPS `server {}` block
- Set up auto-renewal

Verify auto-renewal is configured:

```bash
certbot renew --dry-run
# Expected: Congratulations, all simulated renewals succeeded
```

---

## Step 7 — Verify the Full Setup

```bash
# 1. Container is running
docker compose -f /opt/bellehouseniger-web/docker-compose.yml ps

# 2. Nginx config is valid
nginx -t

# 3. HTTP response from the domain
curl -I https://bellehouseniger.com
# Expected: HTTP/2 200

# 4. API is still reachable (existing backend unaffected)
curl -I https://api2.bellehouseniger.com/api/
```

---

## Updating the Website

When you make changes to the website, re-deploy with:

```bash
# 1. Local machine: push updates to GitHub
git add .
git commit -m "Update website"
git push origin main

# 2. VPS: pull latest code and redeploy
ssh root@51.91.159.155
cd /opt/bellehouseniger-web
git pull origin main
docker compose build --no-cache
docker compose up -d --force-recreate
```

---

## Useful Commands

```bash
# View container logs (live)
docker compose -f /opt/bellehouseniger-web/docker-compose.yml logs -f

# Stop the website
docker compose -f /opt/bellehouseniger-web/docker-compose.yml down

# Restart the website
docker compose -f /opt/bellehouseniger-web/docker-compose.yml restart

# Check nginx error log
tail -f /var/log/nginx/error.log

# Check nginx access log for website traffic
tail -f /var/log/nginx/access.log | grep "bellehouseniger.com"

# Shell into the container (for debugging)
docker exec -it bellehouseniger_web sh
```

---

## Files Created for Deployment

| File | Purpose |
|------|---------|
| `Dockerfile` | Builds nginx:alpine image with static files |
| `docker-compose.yml` | Defines the service on port 8081 |
| `nginx.site.conf` | Nginx config inside the container |
| `bellehouseniger-web.conf` | Host nginx virtual host (copy to `/etc/nginx/conf.d/`) |
| `.dockerignore` | Excludes dev/config files from Docker image |

---

## Troubleshooting

**Container not starting:**
```bash
docker compose logs bellehouseniger-web
# Look for nginx config errors
```

**502 Bad Gateway from nginx:**
```bash
# Check if container is actually running on port 8081
ss -tlnp | grep 8081
# If not listening, restart container
docker compose restart bellehouseniger-web
```

**nginx -t fails after adding conf:**
```bash
# Syntax check the specific file
nginx -t 2>&1
# Fix any reported errors in /etc/nginx/conf.d/bellehouseniger-web.conf
```

**Port 8081 conflict (another service uses it):**  
Change `"8081:80"` in `docker-compose.yml` and update `proxy_pass http://127.0.0.1:8081` in `bellehouseniger-web.conf` to match.
