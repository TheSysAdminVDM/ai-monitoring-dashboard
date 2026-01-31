# Deployment Guide

Deploy the AI Monitoring Dashboard to make it accessible from anywhere.

## Deployment Options

| Method | Best For | Ports Required | SSL | Complexity |
|--------|----------|----------------|-----|------------|
| **Cloudflare Tunnel** | Home servers, NAS, no public IP | None | Automatic | ⭐ Easy |
| **Cloudflare Origin Cert** | VPS behind Cloudflare | 80, 443 | Cloudflare | ⭐⭐ Medium |
| **Let's Encrypt** | VPS with direct DNS | 80, 443 | Auto-renew | ⭐⭐ Medium |
| **Local Docker** | LAN access only | 80 | None | ⭐ Easy |

---

## Option 1: Cloudflare Tunnel (Recommended)

**Best for:** Home servers, NAS devices, machines behind NAT/firewall.

No ports to open, no SSL certificates to manage, automatic DDoS protection.

### Prerequisites

- Docker installed
- Cloudflare account (free)
- Domain on Cloudflare

### Step 1: Create the Tunnel

1. Go to [Cloudflare Zero Trust Dashboard](https://one.dash.cloudflare.com/)
2. Navigate to **Networks → Tunnels**
3. Click **Create a tunnel**
4. Choose **Cloudflared** connector
5. Name: `ai-monitoring-dashboard`
6. Click **Save tunnel**
7. **Copy the tunnel token** (starts with `eyJ...`)

### Step 2: Configure Public Hostname

In the tunnel configuration:

1. Click **Add a public hostname**
2. Configure:
   - **Subdomain**: (leave blank for root, or use `dashboard`)
   - **Domain**: `yourdomain.com`
   - **Type**: HTTP
   - **URL**: `nginx:80`
3. Click **Save hostname**

### Step 3: Deploy

```bash
# Clone the repository
git clone https://github.com/TheSysAdminVDM/ai-monitoring-dashboard.git
cd ai-monitoring-dashboard

# Set the tunnel token
export CLOUDFLARE_TUNNEL_TOKEN='eyJhIjoiYWNj...'

# Deploy
docker compose -f docker-compose.tunnel.yml up -d --build
```

Or create a `.env` file:

```env
CLOUDFLARE_TUNNEL_TOKEN=eyJhIjoiYWNj...
```

Then run:
```bash
docker compose -f docker-compose.tunnel.yml up -d --build
```

### Step 4: Verify

1. Check tunnel status in Cloudflare dashboard (should show "Healthy")
2. Visit `https://yourdomain.com`

### Manage

```bash
# View logs
docker compose -f docker-compose.tunnel.yml logs -f

# Stop
docker compose -f docker-compose.tunnel.yml down

# Update
git pull
docker compose -f docker-compose.tunnel.yml up -d --build
```

---

## Option 2: Cloudflare Origin Certificate

**Best for:** VPS/cloud servers with domain on Cloudflare.

### Prerequisites

- Docker installed
- Server with public IP
- Domain on Cloudflare (proxied)
- Ports 80 and 443 open

### Step 1: Create Origin Certificate

1. Go to Cloudflare Dashboard → SSL/TLS → Origin Server
2. Click **Create Certificate**
3. Keep defaults (RSA, 15 years)
4. Click **Create**
5. Copy the certificate and private key

### Step 2: Deploy

```bash
# Clone the repository
git clone https://github.com/TheSysAdminVDM/ai-monitoring-dashboard.git
cd ai-monitoring-dashboard

# Create SSL directory
mkdir -p nginx/ssl

# Save certificate (paste content)
nano nginx/ssl/vdmtechde.pem

# Save private key (paste content)
nano nginx/ssl/vdmtechde.key

# Set permissions
chmod 600 nginx/ssl/vdmtechde.key
chmod 644 nginx/ssl/vdmtechde.pem

# Deploy
docker compose -f docker-compose.cloudflare.yml up -d --build
```

### Step 3: Configure Cloudflare

1. SSL/TLS → Overview → Set to **Full (strict)**
2. DNS → Ensure records have orange cloud (proxied)

---

## Option 3: Let's Encrypt

**Best for:** VPS with domain pointing directly to server (not through Cloudflare proxy).

### Prerequisites

- Docker installed
- Server with public IP
- Domain DNS pointing to server
- Ports 80 and 443 open

### Deploy

```bash
# Clone the repository
git clone https://github.com/TheSysAdminVDM/ai-monitoring-dashboard.git
cd ai-monitoring-dashboard

# Edit email in deploy script
nano scripts/deploy.sh
# Change: EMAIL="your-email@example.com"

# Deploy
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

The script will:
1. Start services with HTTP
2. Obtain SSL certificate from Let's Encrypt
3. Switch to HTTPS

Certificates auto-renew via the certbot container.

---

## Option 4: Local Docker

**Best for:** Local development, LAN access only.

### Deploy

```bash
# Clone the repository
git clone https://github.com/TheSysAdminVDM/ai-monitoring-dashboard.git
cd ai-monitoring-dashboard

# Deploy (Linux/Mac)
docker compose -f docker-compose.local.yml up -d --build

# Deploy (Windows)
docker compose -f docker-compose.local.yml up -d --build
```

Access at `http://localhost` or `http://<server-ip>` on your LAN.

---

## Claude Code Data Access

The dashboard reads Claude Code stats from `~/.claude/`. On a remote server, you have options:

### Option A: Run Claude Code on Server

If you use Claude Code via SSH on the server, stats are available automatically.

### Option B: Sync from Local Machine

Create a cron job to sync your local Claude Code stats:

```bash
# On your local machine (add to crontab -e)
*/5 * * * * rsync -az ~/.claude/ user@server:~/.claude/
```

### Option C: Mount Remote Directory

Use NFS, SSHFS, or similar to mount your local `.claude` directory on the server.

---

## Managing Deployments

### View Logs

```bash
docker compose -f docker-compose.<type>.yml logs -f

# Specific service
docker compose -f docker-compose.<type>.yml logs -f backend
```

### Restart Services

```bash
docker compose -f docker-compose.<type>.yml restart
```

### Update Application

```bash
git pull
docker compose -f docker-compose.<type>.yml up -d --build
```

### Stop Services

```bash
docker compose -f docker-compose.<type>.yml down
```

---

## Architecture

```
                     ┌─────────────────┐
                     │   Cloudflare    │
                     │  (SSL/Tunnel)   │
                     └────────┬────────┘
                              │
                     ┌────────▼────────┐
                     │     Nginx       │
                     │ (Reverse Proxy) │
                     └────────┬────────┘
                              │
            ┌─────────────────┴─────────────────┐
            │                                   │
     ┌──────▼──────┐                   ┌────────▼────────┐
     │  Frontend   │                   │     Backend     │
     │   (React)   │                   │   (Node.js)     │
     └─────────────┘                   └────────┬────────┘
                                                │
                                       ┌────────▼────────┐
                                       │   ~/.claude/    │
                                       │  (stats files)  │
                                       └─────────────────┘
```

---

## Troubleshooting

### Tunnel Not Connecting

```bash
# Check cloudflared logs
docker compose -f docker-compose.tunnel.yml logs cloudflared

# Verify token is set
echo $CLOUDFLARE_TUNNEL_TOKEN
```

### SSL Certificate Issues (Let's Encrypt)

```bash
# Check certificate status
docker compose -f docker-compose.prod.yml run --rm certbot certificates

# Force renewal
docker compose -f docker-compose.prod.yml run --rm certbot renew --force-renewal
```

### Container Issues

```bash
# Check status
docker compose -f docker-compose.<type>.yml ps

# View logs
docker compose -f docker-compose.<type>.yml logs -f backend

# Restart
docker compose -f docker-compose.<type>.yml restart
```

### Port Already in Use

```bash
# Check what's using the port
sudo lsof -i :80
sudo lsof -i :443

# Stop conflicting services
sudo systemctl stop apache2
sudo systemctl stop nginx
```

---

## Security Notes

1. **Firewall**: For tunnel deployment, no ports need to be open
2. **SSL Certificates**: Keep private keys secure (`chmod 600`)
3. **Updates**: Regularly update Docker images
4. **Backups**: Back up your SSL certificates if using Let's Encrypt
