# AI Monitoring Dashboard

A real-time AI token usage monitoring dashboard with a dark sci-fi cockpit theme. **Works out of the box** with Claude Code - no API keys or database setup required!

![Dashboard Preview](docs/preview.png)

## Features

- **Live Token Tracking** - Real-time monitoring of Claude Code usage
- **No Setup Required** - Reads directly from Claude Code's local data
- **Beautiful UI** - Dark sci-fi theme with neon accents and subtle animations
- **Auto-Refresh** - Updates every 30 seconds
- **Detailed Metrics** - Input/output tokens, cache usage, message counts
- **Historical Data** - 7-day activity charts

## Quick Start

### Prerequisites

- **Node.js** >= 18.0.0
- **Claude Code** installed and used at least once

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/ai-monitoring-dashboard.git
cd ai-monitoring-dashboard

# Install dependencies
npm install

# Build shared types
cd shared && npm run build && cd ..

# Start the dashboard
npm run dev
```

Open **http://localhost:5173** in your browser.

That's it! The dashboard will automatically detect and display your Claude Code usage data.

## How It Works

The dashboard reads Claude Code's local statistics from:
- `~/.claude/stats-cache.json` - Historical usage data
- `~/.claude/projects/*//*.jsonl` - Live session data

No API keys, no database, no configuration needed.

## Screenshots

### Main Dashboard
Shows total sessions, messages, and token usage with a sci-fi cockpit aesthetic.

### Live Usage Panel
Real-time token counts from active Claude Code sessions, updated every 30 seconds.

### Activity Charts
7-day message and session activity visualization.

## Project Structure

```
ai-monitoring-dashboard/
├── client/                 # React frontend (Vite + TypeScript)
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/          # Dashboard pages
│   │   ├── hooks/          # React Query hooks
│   │   ├── services/       # API clients
│   │   └── styles/         # Tailwind CSS
│   └── package.json
│
├── server/                 # Express backend
│   ├── src/
│   │   ├── routes/         # API routes
│   │   ├── controllers/    # Request handlers
│   │   └── services/       # Claude Code data reader
│   └── package.json
│
├── shared/                 # Shared TypeScript types
└── package.json            # Workspace root
```

## Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite (fast builds)
- Tailwind CSS (styling)
- React Query (data fetching)
- Framer Motion (animations)
- Recharts (charts)

**Backend:**
- Node.js + Express
- TypeScript

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/claude-code/stats` | Dashboard metrics with live token data |
| `GET /api/claude-code/daily?days=7` | Daily activity for the past N days |
| `GET /api/claude-code/file-info` | Stats file metadata |

## Configuration

### Environment Variables (Optional)

Create a `.env` file in the root:

```env
# Server port (default: 3001)
PORT=3001

# CORS origin (default: http://localhost:5173)
CORS_ORIGIN=http://localhost:5173
```

### Client Configuration

Create `client/.env`:

```env
# API URL (default: http://localhost:3001/api)
VITE_API_URL=http://localhost:3001/api
```

## Development

```bash
# Run both frontend and backend
npm run dev

# Run only frontend
npm run dev:client

# Run only backend
npm run dev:server

# Type checking
npm run type-check

# Linting
npm run lint

# Build for production
npm run build
```

## Troubleshooting

### "Claude Code Stats Not Found"

Make sure you have:
1. Claude Code installed
2. Used Claude Code at least once (to generate the stats file)

The stats file should exist at `~/.claude/stats-cache.json`

### Port Already in Use

Change the port in `server/src/index.ts` or set the `PORT` environment variable.

### Data Not Updating

- The dashboard auto-refreshes every 30 seconds
- Live session data updates in real-time from `.jsonl` files
- The `stats-cache.json` is updated by Claude Code periodically (not in real-time)

## Future Features

- [ ] Claude API status integration
- [ ] Cost estimation based on token usage
- [ ] Export usage reports
- [ ] Multiple workspace support
- [ ] Usage alerts and notifications

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see [LICENSE](LICENSE) for details.

## Acknowledgments

- Built with [Claude Code](https://claude.ai/claude-code)
- Inspired by sci-fi cockpit interfaces
