# AI Monitoring Dashboard Setup Script (PowerShell)
# This script sets up the development environment on Windows

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "AI Monitoring Dashboard - Setup Script" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Check for Node.js
try {
    $nodeVersion = node -v
    Write-Host "✓ Node.js $nodeVersion detected" -ForegroundColor Green
} catch {
    Write-Host "Error: Node.js is not installed. Please install Node.js >= 18.0.0" -ForegroundColor Red
    exit 1
}

# Check for PostgreSQL
try {
    $null = Get-Command psql -ErrorAction Stop
    Write-Host "✓ PostgreSQL detected" -ForegroundColor Green
} catch {
    Write-Host "Warning: PostgreSQL is not installed or not in PATH" -ForegroundColor Yellow
    Write-Host "Please install PostgreSQL and ensure it's running" -ForegroundColor Yellow
}

# Install dependencies
Write-Host ""
Write-Host "Installing dependencies..." -ForegroundColor Cyan
npm install

# Setup environment files
Write-Host ""
Write-Host "Setting up environment files..." -ForegroundColor Cyan

if (-not (Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    Write-Host "✓ Created root .env file" -ForegroundColor Green
    Write-Host "  Please edit .env with your database credentials" -ForegroundColor Yellow
} else {
    Write-Host "✓ Root .env file already exists" -ForegroundColor Green
}

if (-not (Test-Path "client\.env")) {
    Copy-Item "client\.env.example" "client\.env"
    Write-Host "✓ Created client .env file" -ForegroundColor Green
} else {
    Write-Host "✓ Client .env file already exists" -ForegroundColor Green
}

# Build shared types
Write-Host ""
Write-Host "Building shared types..." -ForegroundColor Cyan
Set-Location shared
npm run build
Set-Location ..
Write-Host "✓ Shared types built successfully" -ForegroundColor Green

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Edit .env with your PostgreSQL credentials"
Write-Host "2. Create the database:"
Write-Host "   psql -U postgres -c 'CREATE DATABASE ai_monitoring;'"
Write-Host "3. Run migrations:"
Write-Host "   psql -U postgres -d ai_monitoring -f database\migrations\001_initial_schema.sql"
Write-Host "4. (Optional) Load sample data:"
Write-Host "   psql -U postgres -d ai_monitoring -f database\seeds\001_sample_data.sql"
Write-Host "5. Start the application:"
Write-Host "   npm run dev"
Write-Host ""
Write-Host "The application will be available at:" -ForegroundColor Cyan
Write-Host "  Frontend: http://localhost:5173"
Write-Host "  Backend:  http://localhost:3000"
Write-Host ""
