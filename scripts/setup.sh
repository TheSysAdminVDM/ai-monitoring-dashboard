#!/bin/bash

# AI Monitoring Dashboard Setup Script
# This script sets up the development environment

echo "=========================================="
echo "AI Monitoring Dashboard - Setup Script"
echo "=========================================="
echo ""

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed. Please install Node.js >= 18.0.0"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "Error: Node.js version must be >= 18.0.0"
    exit 1
fi

echo "✓ Node.js $(node -v) detected"

# Check for PostgreSQL
if ! command -v psql &> /dev/null; then
    echo "Warning: PostgreSQL is not installed or not in PATH"
    echo "Please install PostgreSQL and ensure it's running"
else
    echo "✓ PostgreSQL detected"
fi

# Install dependencies
echo ""
echo "Installing dependencies..."
npm install

# Setup environment files
echo ""
echo "Setting up environment files..."

if [ ! -f .env ]; then
    cp .env.example .env
    echo "✓ Created root .env file"
    echo "  Please edit .env with your database credentials"
else
    echo "✓ Root .env file already exists"
fi

if [ ! -f client/.env ]; then
    cp client/.env.example client/.env
    echo "✓ Created client .env file"
else
    echo "✓ Client .env file already exists"
fi

# Build shared types
echo ""
echo "Building shared types..."
cd shared
npm run build
cd ..
echo "✓ Shared types built successfully"

echo ""
echo "=========================================="
echo "Setup Complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Edit .env with your PostgreSQL credentials"
echo "2. Create the database: createdb ai_monitoring"
echo "3. Run migrations: psql -U postgres -d ai_monitoring -f database/migrations/001_initial_schema.sql"
echo "4. (Optional) Load sample data: psql -U postgres -d ai_monitoring -f database/seeds/001_sample_data.sql"
echo "5. Start the application: npm run dev"
echo ""
echo "The application will be available at:"
echo "  Frontend: http://localhost:5173"
echo "  Backend:  http://localhost:3000"
echo ""
