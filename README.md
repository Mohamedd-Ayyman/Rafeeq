# Rafeeq (رفيق) — Your Companion in Worship

A premium Islamic worship-companion web app: journey tracking, streaks, XP/levels,
achievements, AI assistant, community challenges, buddy system, and rich analytics.

## Stack

- **Server**: Node.js, Express 5 (ESM), Mongoose 9, Socket.IO 4, JWT auth, bcryptjs, OpenAI.
- **Client**: Next.js (App Router, React 19), Tailwind CSS v4, Framer Motion, GSAP, Recharts, idb (PWA offline).
- **DB**: MongoDB (via `docker-compose.yml`).
- **Tests**: Playwright E2E.

## Quick start (local)

### 1. Start MongoDB
```bash
docker compose up -d
```

### 2. Server
```bash
cd server
cp ../.env.example config.env   # adjust if needed
npm install
npm run seed                    # creates admin + demo users + sample data
npm run dev                     # http://localhost:5000
```

### 3. Client
```bash
cd client
npm install
npm run dev                     # http://localhost:3000
```

### Seed credentials
- Admin: `admin@rafeeq.app` / `admin1234`
- Demo:  `demo@rafeeq.app`  / `demo1234`

## E2E tests
From the repo root:
```bash
npm install            # installs @playwright/test
npx playwright install  # browser binaries (once)
npm run test:e2e
```
Tests expect both `server` (`:5000`) and `client` (`:3000`) running with a seeded DB.

## Environment (`server/config.env`)
```
PORT_NUMBER=5000
CONN_STRING=mongodb://localhost:27017/rafeeq
SECRET_KEY=change_me
CLIENT_URL=http://localhost:3000
OPENAI_API_KEY=                      # optional; graceful offline fallback when empty
```

## Deployment
- **Client (Vercel)**: set `NEXT_PUBLIC_API_URL` to the server URL.
- **Server (Railway / Render)**: set the env vars above; MongoDB provided by the platform or Atlas.
- **PWA**: `client/public/manifest.json` + `client/public/sw.js` make the app installable and offline-capable.

## Notes
- The repo currently pins **Next 15** (master brief mentions Next 16; kept for a stable working build).
- `connectDB` is non-fatal: the HTTP server boots even if Mongo is unreachable.
- AI features degrade gracefully (canned, respectful responses) when `OPENAI_API_KEY` is absent.
