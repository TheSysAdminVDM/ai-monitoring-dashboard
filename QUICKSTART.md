# Quick Start Guide

Get your AI Monitoring Dashboard up and running in minutes!

## Prerequisites Checklist

- [ ] Node.js >= 18.0.0 installed
- [ ] PostgreSQL >= 14.0 installed and running
- [ ] npm >= 9.0.0 installed

## Installation Steps

### Option 1: Automated Setup (Recommended)

**Windows (PowerShell):**
```powershell
cd "d:\Projects\Dev\Projects\AI Monitoring Dashboard"
.\scripts\setup.ps1
```

**Linux/Mac:**
```bash
cd "d:/Projects/Dev/Projects/AI Monitoring Dashboard"
chmod +x scripts/setup.sh
./scripts/setup.sh
```

### Option 2: Manual Setup

**1. Install dependencies:**
```bash
npm install
```

**2. Create environment files:**
```bash
# Copy example files
cp .env.example .env
cp client/.env.example client/.env
```

**3. Configure database credentials:**

Edit `.env`:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ai_monitoring
DB_USER=postgres
DB_PASSWORD=your_password_here
```

**4. Build shared types:**
```bash
cd shared
npm run build
cd ..
```

## Database Setup

**1. Create the database:**
```bash
# Using psql
psql -U postgres -c "CREATE DATABASE ai_monitoring;"

# Or using createdb
createdb -U postgres ai_monitoring
```

**2. Run migrations:**
```bash
psql -U postgres -d ai_monitoring -f database/migrations/001_initial_schema.sql
```

**3. (Optional) Load sample data:**
```bash
psql -U postgres -d ai_monitoring -f database/seeds/001_sample_data.sql
```

## Run the Application

**Development mode (both frontend and backend):**
```bash
npm run dev
```

**Or run separately:**
```bash
# Terminal 1 - Backend
npm run dev:server

# Terminal 2 - Frontend
npm run dev:client
```

## Access the Application

- **Frontend Dashboard:** http://localhost:5173
- **Backend API:** http://localhost:3000
- **Health Check:** http://localhost:3000/health

## Test the API

**Health check:**
```bash
curl http://localhost:3000/health
```

**Get dashboard metrics:**
```bash
curl http://localhost:3000/api/dashboard/metrics
```

**Create token usage record:**
```bash
curl -X POST http://localhost:3000/api/token-usage \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "test-session-1",
    "model": "claude-opus-4",
    "input_tokens": 1000,
    "output_tokens": 500,
    "cost": 0.025
  }'
```

## Troubleshooting

### Database Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solution:**
1. Ensure PostgreSQL is running: `pg_ctl status`
2. Check credentials in `.env`
3. Verify database exists: `psql -U postgres -l`

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution:**
1. Change PORT in `.env`
2. Or kill the process: `lsof -ti:3000 | xargs kill` (Mac/Linux)

### Module Not Found
```
Error: Cannot find module '@ai-monitoring/shared'
```

**Solution:**
```bash
cd shared
npm run build
cd ..
npm install
```

## Common Commands

```bash
# Install all dependencies
npm install

# Start development servers
npm run dev

# Build for production
npm run build

# Run production server
npm start

# Type checking
npm run type-check

# Linting
npm run lint

# Build only frontend
npm run build:client

# Build only backend
npm run build:server
```

## What's Next?

1. Explore the dashboard at http://localhost:5173
2. Check the API documentation in README.md
3. Customize the theme in `client/tailwind.config.js`
4. Add your API keys through the UI or database
5. Set up usage limits and alerts

## Need Help?

- Check the full README.md for detailed documentation
- Review API endpoints in the README
- Check database schema in `database/migrations/001_initial_schema.sql`
- Review sample data in `database/seeds/001_sample_data.sql`

## Production Deployment

See the main README.md for production deployment instructions including:
- Environment variable configuration
- Database optimization
- Reverse proxy setup
- SSL/TLS configuration
- Process management with PM2
