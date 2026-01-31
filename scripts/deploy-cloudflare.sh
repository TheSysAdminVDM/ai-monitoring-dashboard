#!/bin/bash

# AI Monitoring Dashboard - Cloudflare Deployment Script
# For vdmtech.de with Cloudflare Origin Certificate

set -e

echo "=========================================="
echo "AI Monitoring Dashboard - Cloudflare Deploy"
echo "=========================================="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "Error: Docker is not installed"
    exit 1
fi

# Check if SSL certificates exist
if [ ! -f "nginx/ssl/cloudflare-origin.pem" ] || [ ! -f "nginx/ssl/cloudflare-origin.key" ]; then
    echo ""
    echo "ERROR: Cloudflare Origin Certificate not found!"
    echo ""
    echo "Please follow these steps:"
    echo ""
    echo "1. Go to Cloudflare Dashboard > SSL/TLS > Origin Server"
    echo "2. Click 'Create Certificate'"
    echo "3. Keep defaults (RSA, 15 years)"
    echo "4. Click 'Create'"
    echo "5. Copy the certificate to: nginx/ssl/cloudflare-origin.pem"
    echo "6. Copy the private key to: nginx/ssl/cloudflare-origin.key"
    echo ""
    echo "Then run this script again."
    exit 1
fi

# Create SSL directory if needed
mkdir -p nginx/ssl

# Set proper permissions on SSL files
chmod 600 nginx/ssl/cloudflare-origin.key
chmod 644 nginx/ssl/cloudflare-origin.pem

echo ""
echo "Starting services..."
echo ""

# Build and start containers
docker compose -f docker-compose.cloudflare.yml up -d --build

echo ""
echo "=========================================="
echo "Deployment Complete!"
echo "=========================================="
echo ""
echo "Your dashboard is now available at:"
echo "  https://vdmtech.de"
echo ""
echo "Make sure in Cloudflare Dashboard:"
echo "  - SSL/TLS mode is set to 'Full (strict)'"
echo "  - DNS records have orange cloud (proxied)"
echo ""
