# Deployment Guide - vdmtech.de

Deploy the AI Monitoring Dashboard to your server with Docker and Let's Encrypt SSL.

## Prerequisites

On your server:
- Docker installed
- Docker Compose installed
- Port 80 and 443 open
- Domain `vdmtech.de` pointed to your server's IP

## Quick Deploy

### 1. Clone the Repository

```bash
ssh user@your-server
git clone https://github.com/TheSysAdminVDM/ai-monitoring-dashboard.git
cd ai-monitoring-dashboard
```

### 2. Configure Email for SSL

Edit `scripts/deploy.sh` and set your email:

```bash
EMAIL="your-email@example.com"  # For Let's Encrypt notifications
```

### 3. Run Deployment Script

```bash
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

This will:
1. Build the Docker containers
2. Start the services
3. Obtain SSL certificate from Let's Encrypt
4. Enable HTTPS

### 4. Done!

Your dashboard is now live at **https://vdmtech.de**

---

## Manual Deployment (Step by Step)

### Step 1: Initial Setup

```bash
# Create certificate directories
mkdir -p certbot/conf certbot/www

# Copy initial nginx config (HTTP only)
cp nginx/conf.d/initial.conf.template nginx/conf.d/default.conf

# Build and start containers
docker compose -f docker-compose.prod.yml up -d --build
```

### Step 2: Obtain SSL Certificate

```bash
docker compose -f docker-compose.prod.yml run --rm certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email YOUR_EMAIL@example.com \
    --agree-tos \
    --no-eff-email \
    -d vdmtech.de \
    -d www.vdmtech.de
```

### Step 3: Enable SSL

```bash
# Switch to SSL config
rm nginx/conf.d/default.conf
cp nginx/conf.d/vdmtech.conf nginx/conf.d/default.conf

# Reload nginx
docker compose -f docker-compose.prod.yml exec nginx nginx -s reload
```

---

## Important: Claude Code Data Access

The dashboard reads Claude Code stats from `~/.claude/`. On a server, you have two options:

### Option A: Run Claude Code on the Server
If you use Claude Code via SSH on the server, the stats will be available automatically.

### Option B: Sync Stats from Your Local Machine
Create a cron job to sync your local Claude Code stats to the server:

```bash
# On your local machine (add to crontab -e)
*/5 * * * * rsync -az ~/.claude/ user@vdmtech.de:~/.claude/
```

### Option C: Mount Remote Directory
If using NFS or similar, mount your local `.claude` directory on the server.

---

## Managing the Deployment

### View Logs

```bash
# All services
docker compose -f docker-compose.prod.yml logs -f

# Specific service
docker compose -f docker-compose.prod.yml logs -f backend
docker compose -f docker-compose.prod.yml logs -f frontend
docker compose -f docker-compose.prod.yml logs -f nginx
```

### Restart Services

```bash
docker compose -f docker-compose.prod.yml restart
```

### Update Application

```bash
git pull
docker compose -f docker-compose.prod.yml up -d --build
```

### Stop Services

```bash
docker compose -f docker-compose.prod.yml down
```

---

## SSL Certificate Renewal

Certificates auto-renew via the certbot container. To manually renew:

```bash
docker compose -f docker-compose.prod.yml run --rm certbot renew
docker compose -f docker-compose.prod.yml exec nginx nginx -s reload
```

---

## DNS Configuration

Point your domain to your server:

| Type | Name | Value |
|------|------|-------|
| A | @ | YOUR_SERVER_IP |
| A | www | YOUR_SERVER_IP |

Or use CNAME if using a dynamic DNS service.

---

## Troubleshooting

### Certificate Issues

```bash
# Check certificate status
docker compose -f docker-compose.prod.yml run --rm certbot certificates

# Force renewal
docker compose -f docker-compose.prod.yml run --rm certbot renew --force-renewal
```

### Container Not Starting

```bash
# Check container status
docker compose -f docker-compose.prod.yml ps

# View detailed logs
docker compose -f docker-compose.prod.yml logs backend
```

### Port Already in Use

```bash
# Check what's using port 80/443
sudo lsof -i :80
sudo lsof -i :443

# Stop conflicting services
sudo systemctl stop apache2  # or nginx if installed separately
```

---

## Security Notes

1. **Firewall**: Only ports 80 and 443 should be exposed
2. **Updates**: Keep Docker and containers updated
3. **Backups**: Back up your `certbot/conf` directory
4. **Monitoring**: Set up monitoring for certificate expiry

---

## Architecture

```
                    ┌─────────────┐
                    │   Internet  │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │    Nginx    │ :80, :443
                    │ (SSL/Proxy) │
                    └──────┬──────┘
                           │
              ┌────────────┴────────────┐
              │                         │
       ┌──────▼──────┐          ┌───────▼───────┐
       │  Frontend   │          │    Backend    │
       │  (React)    │          │   (Node.js)   │
       │   :80       │          │    :3001      │
       └─────────────┘          └───────┬───────┘
                                        │
                                ┌───────▼───────┐
                                │ ~/.claude/    │
                                │ (stats files) │
                                └───────────────┘
```
