#!/bin/bash

# AI Monitoring Dashboard - Production Deployment Script
# For vdmtech.de with Let's Encrypt SSL

set -e

DOMAIN="vdmtech.de"
EMAIL="admin@vdmtech.de"  # Change this to your email

echo "=========================================="
echo "AI Monitoring Dashboard - Deployment"
echo "Domain: $DOMAIN"
echo "=========================================="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "Error: Docker is not installed"
    exit 1
fi

if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "Error: Docker Compose is not installed"
    exit 1
fi

# Create directories
echo "Creating directories..."
mkdir -p certbot/conf certbot/www

# Step 1: Initial setup without SSL
echo ""
echo "Step 1: Starting services without SSL..."
echo ""

# Use initial config (HTTP only)
cp nginx/conf.d/initial.conf.template nginx/conf.d/default.conf
rm -f nginx/conf.d/vdmtech.conf 2>/dev/null || true

# Start services
docker compose -f docker-compose.prod.yml up -d --build

# Wait for services to start
echo "Waiting for services to start..."
sleep 10

# Step 2: Obtain SSL certificate
echo ""
echo "Step 2: Obtaining SSL certificate from Let's Encrypt..."
echo ""

docker compose -f docker-compose.prod.yml run --rm certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email $EMAIL \
    --agree-tos \
    --no-eff-email \
    -d $DOMAIN \
    -d www.$DOMAIN

# Step 3: Switch to full SSL config
echo ""
echo "Step 3: Enabling SSL..."
echo ""

# Remove initial config, enable SSL config
rm -f nginx/conf.d/default.conf
cp nginx/conf.d/vdmtech.conf nginx/conf.d/default.conf

# Reload nginx with SSL
docker compose -f docker-compose.prod.yml exec nginx nginx -s reload

echo ""
echo "=========================================="
echo "Deployment Complete!"
echo "=========================================="
echo ""
echo "Your dashboard is now available at:"
echo "  https://$DOMAIN"
echo ""
echo "SSL certificates will auto-renew."
echo ""
