<div align="center">

# 🌙 Rafeeq (رفيق)

### Your companion in worship

**A gamified, offline-first Islamic worship companion: track prayers, Quran and dhikr, keep streaks, earn achievements and grow together with friends, with help from an AI assistant.**

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind](https://img.shields.io/badge/Tailwind_v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)
![GSAP](https://img.shields.io/badge/GSAP-88CE02?style=for-the-badge&logo=greensock&logoColor=black)
<br/>
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express_5-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-010101?style=for-the-badge&logo=socketdotio&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white)
![Playwright](https://img.shields.io/badge/Playwright-2EAD33?style=for-the-badge&logo=playwright&logoColor=white)

</div>

---

## 📖 Overview

Building consistent spiritual habits is hard. **Rafeeq** uses proven gamification (streaks, XP, levels, achievements and friendly accountability) to help Muslims stay consistent with **prayer, Quran recitation and dhikr**. It's an installable **PWA**, works **offline** and syncs automatically when you reconnect.

## ✨ Features

| | Feature | Details |
|---|---|---|
| 🕌 | **Prayer tracker** | Daily prayer timeline and logging |
| 📖 | **Quran reader** | Reading progress tracking |
| 📿 | **Dhikr counter** | Tap counter with history logs |
| 🗺️ | **Journey map** | Visual progress path with milestones and a journey recap |
| 🔥 | **Streaks, XP and levels** | Streak flame, animated progress rings, level-ups with confetti |
| 🏆 | **Achievements** | Unlockable badges for consistency |
| 🎯 | **Community challenges** | Join challenges and track participants' progress |
| 🤝 | **Buddy system** | Pair with a friend and see each other's activity in real time |
| 🎡 | **Wheel of Good Deeds** | A daily spin that suggests a good deed |
| 🤖 | **AI assistant** | OpenAI-powered Q&A that falls back to canned answers when offline |
| 📊 | **Statistics** | Charts and a GitHub-style activity heatmap |
| 📴 | **Offline-first PWA** | Service worker, IndexedDB queue and a sync endpoint |
| 🔔 | **Real-time notifications** | Socket.IO toasts for buddy and challenge activity |

## 🏗️ Architecture

```
┌──────────────────────────────┐      REST + Socket.IO      ┌──────────────────────────────┐
│ Next.js App Router (React 19)│ ◀────────────────────────▶ │ Express 5 API (ESM)          │
│ Tailwind v4 · Framer · GSAP  │                            │ JWT · Mongoose · OpenAI      │
│ IndexedDB offline queue + SW │ ───── /sync on reconnect ─▶│ Socket.IO events             │
└──────────────────────────────┘                            └──────────────┬───────────────┘
                                                                           │
                                                                       MongoDB
```

**Domain models:** User · PrayerLog · QuranProgress · DhikrLog · Milestone · Achievement · Challenge · ChallengeParticipant · Buddy · WheelSpin

## 🧰 Tech Stack

| Layer | Technologies |
|---|---|
| **Client** | Next.js (App Router), React 19, Tailwind CSS v4, Framer Motion, GSAP, Recharts, idb, canvas-confetti |
| **Server** | Node.js, Express 5 (ESM), Mongoose, Socket.IO 4, JWT, bcryptjs, OpenAI SDK |
| **Database** | MongoDB (Docker Compose for local development) |
| **Testing** | Playwright end-to-end tests |

## 🚀 Getting Started

```bash
git clone https://github.com/Mohamedd-Ayyman/Rafeeq.git
cd Rafeeq

# 1. Database
docker compose up -d

# 2. Server
cd server
cp ../.env.example config.env
npm install
npm run seed        # admin + demo users + sample data
npm run dev         # http://localhost:5000

# 3. Client
cd ../client
npm install
npm run dev         # http://localhost:3000
```

**Demo account:** `demo@rafeeq.app` / `demo1234`

### Environment (`server/config.env`)

| Variable | Description |
|---|---|
| `PORT_NUMBER` | API port (default `5000`) |
| `CONN_STRING` | MongoDB connection string |
| `SECRET_KEY` | JWT secret |
| `CLIENT_URL` | Frontend origin for CORS |
| `OPENAI_API_KEY` | *Optional.* The AI assistant falls back to canned answers without it |

## 🧪 End-to-End Tests

```bash
npm install && npx playwright install
npm run test:e2e        # needs the server (:5000) and client (:3000) running with seeded data
```

## ☁️ Deployment

- **Client:** Vercel (set `NEXT_PUBLIC_API_URL`)
- **Server:** Railway or Render, with MongoDB Atlas

## 👤 Author

**Mohamed Ayman**, Frontend / Full-Stack Developer · [GitHub](https://github.com/Mohamedd-Ayyman) · [LinkedIn](https://linkedin.com/in/mohamed-ayman-8787b0269)
