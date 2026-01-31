# AI Monitoring Dashboard

A modern, real-time AI token usage monitoring dashboard with a dark sci-fi/gaming cockpit theme. Track token consumption, costs, and usage patterns across different AI models with beautiful visualizations and alerts.

## Features

- Real-time token usage tracking
- Beautiful dark sci-fi themed UI with subtle animations
- Multi-model support (Anthropic, OpenAI, etc.)
- Usage limits and alerts
- Historical data visualization
- Session-based tracking
- Cost analysis and breakdown
- Responsive design

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast builds
- **Tailwind CSS** for styling
- **React Query** for data fetching
- **Recharts** for data visualization
- **Framer Motion** for animations
- **Lucide React** for icons

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **PostgreSQL** for database
- **node-postgres (pg)** for database connection
- **Joi** for validation
- **Helmet** for security
- **Morgan** for logging

## Project Structure

```
AI Monitoring Dashboard/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # API service layer
│   │   ├── styles/        # Global styles
│   │   └── types/         # TypeScript types
│   └── package.json
│
├── server/                # Express backend
│   ├── src/
│   │   ├── routes/        # API routes
│   │   ├── controllers/   # Request handlers
│   │   ├── services/      # Business logic
│   │   ├── models/        # Database models
│   │   ├── middleware/    # Express middleware
│   │   └── config/        # Configuration files
│   └── package.json
│
├── shared/                # Shared types/interfaces
│   └── src/
│       └── index.ts
│
├── database/              # Database files
│   ├── migrations/        # SQL migration files
│   └── seeds/             # Seed data
│
└── package.json           # Root package.json
```

## Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **PostgreSQL** >= 14.0

## Installation

### 1. Clone the repository

```bash
cd "d:/Projects/Dev/Projects/AI Monitoring Dashboard"
```

### 2. Install dependencies

```bash
npm install
```

This will install dependencies for all workspaces (root, client, server, shared).

### 3. Set up environment variables

Copy the example environment files:

```bash
# Root .env
cp .env.example .env

# Client .env
cp client/.env.example client/.env
```

Edit the `.env` files with your configuration:

**Root `.env`:**
```env
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ai_monitoring
DB_USER=postgres
DB_PASSWORD=your_password
DB_POOL_SIZE=20
CORS_ORIGIN=http://localhost:5173
```

**Client `.env`:**
```env
VITE_API_URL=http://localhost:3000/api
```

### 4. Set up the database

Create a PostgreSQL database:

```bash
psql -U postgres
CREATE DATABASE ai_monitoring;
\q
```

Run the migration:

```bash
psql -U postgres -d ai_monitoring -f database/migrations/001_initial_schema.sql
```

## Running the Application

### Development Mode

Run both frontend and backend concurrently:

```bash
npm run dev
```

Or run them separately:

```bash
# Terminal 1 - Backend
npm run dev:server

# Terminal 2 - Frontend
npm run dev:client
```

The application will be available at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **Health Check**: http://localhost:3000/health

### Production Build

```bash
npm run build
npm start
```

## API Endpoints

### Dashboard
- `GET /api/dashboard/metrics` - Get dashboard metrics
- `GET /api/dashboard/usage-stats` - Get usage statistics
- `GET /api/dashboard/model-breakdown` - Get model breakdown
- `GET /api/dashboard/hourly-usage` - Get hourly usage

### Token Usage
- `POST /api/token-usage` - Create token usage record
- `GET /api/token-usage/session/:sessionId` - Get usage by session
- `GET /api/token-usage/daily-stats` - Get daily statistics
- `GET /api/token-usage/monthly-stats` - Get monthly statistics
- `GET /api/token-usage/session-summary/:sessionId` - Get session summary
- `GET /api/token-usage/recent-sessions` - Get recent sessions

## Database Schema

### Tables

#### `api_keys`
Stores API key information for different AI providers.

#### `token_usage`
Tracks all token usage across sessions with detailed metrics.

#### `usage_limits`
Defines spending and usage limits with alert thresholds.

#### `usage_alerts`
Stores alerts when usage thresholds are exceeded.

### Views

#### `daily_usage_stats`
Aggregated daily usage statistics by model.

#### `session_summaries`
Summary statistics for each session.

## Features in Detail

### Real-time Monitoring
- Dashboard auto-refreshes every 10 seconds
- Live usage metrics and alerts
- Session-based tracking

### Usage Limits
- Configurable daily, monthly, and session limits
- Alert thresholds (warning at 80%, critical at 95%)
- Visual indicators for usage status

### Data Visualization
- 7-day usage trend charts
- Model usage distribution
- Hourly usage patterns
- Cost analysis

### Dark Sci-Fi Theme
- Neon blue/purple color scheme
- Subtle glow effects and animations
- Scanline effects
- Grid background pattern
- Responsive design

## Development

### Type Checking

```bash
npm run type-check
```

### Linting

```bash
npm run lint
```

### Build Shared Types

```bash
cd shared
npm run build
```

## Security

- Helmet middleware for security headers
- Rate limiting on API endpoints
- CORS configuration
- Input validation with Joi
- Parameterized queries to prevent SQL injection
- Environment variable management

## Performance

- Connection pooling for database
- React Query for efficient data fetching
- Code splitting with Vite
- Optimized re-renders with React.memo
- Database indexes for common queries

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Check database credentials in `.env`
- Verify database exists

### Port Already in Use
- Change `PORT` in `.env` for backend
- Change `server.port` in `client/vite.config.ts` for frontend

### Module Not Found Errors
- Run `npm install` in root directory
- Clear node_modules: `rm -rf node_modules */node_modules && npm install`

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## License

MIT

## Support

For issues and questions, please open an issue on the repository.
