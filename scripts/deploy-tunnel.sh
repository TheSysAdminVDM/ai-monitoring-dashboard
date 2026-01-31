#!/bin/bash

# AI Monitoring Dashboard - Cloudflare Tunnel Deployment Script
# No ports exposed, no SSL certificates needed

set -e

echo "=========================================="
echo "AI Monitoring Dashboard - Tunnel Deploy"
echo "=========================================="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "Error: Docker is not installed"
    exit 1
fi

# Check if tunnel token is set
if [ -z "$CLOUDFLARE_TUNNEL_TOKEN" ]; then
    echo ""
    echo "ERROR: CLOUDFLARE_TUNNEL_TOKEN not set!"
    echo ""
    echo "To get your tunnel token:"
    echo ""
    echo "1. Go to Cloudflare Zero Trust Dashboard"
    echo "   https://one.dash.cloudflare.com/"
    echo ""
    echo "2. Navigate to: Networks > Tunnels"
    echo ""
    echo "3. Click 'Create a tunnel'"
    echo "   - Name: ai-monitoring-dashboard"
    echo "   - Click 'Save tunnel'"
    echo ""
    echo "4. Copy the tunnel token"
    echo ""
    echo "5. Set it as environment variable:"
    echo "   export CLOUDFLARE_TUNNEL_TOKEN='your-token-here'"
    echo ""
    echo "6. Configure the public hostname:"
    echo "   - Public hostname: vdmtech.de"
    echo "   - Service: http://nginx:80"
    echo ""
    echo "Then run this script again."
    exit 1
fi

echo ""
echo "Starting services with Cloudflare Tunnel..."
echo ""

# Build and start containers
docker compose -f docker-compose.tunnel.yml up -d --build

echo ""
echo "=========================================="
echo "Deployment Complete!"
echo "=========================================="
echo ""
echo "Your dashboard will be available at:"
echo "  https://vdmtech.de"
echo ""
echo "Make sure in Cloudflare Zero Trust Dashboard:"
echo "  - Tunnel status is 'Healthy'"
echo "  - Public hostname points to http://nginx:80"
echo ""
