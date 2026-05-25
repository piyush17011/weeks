# Weeks — Your Life in Weeks

> *A visual map of your life. One square. One week. 4,680 total.*

A minimalist, emotionally resonant web application that visualizes your entire lifespan as a grid of weeks — each square a week of your life, past and future, finite and real.

---

## The Concept

The average human life is about 4,680 weeks. Most of us rarely think in these terms. **Weeks** makes time tangible: a grid of small squares, each one a week you've lived or have yet to live. The past weeks glow white. The future ones wait, outlined, empty. The current week pulses.

It is not a productivity app. It is not gamified. It is a mirror.

---

## Features

### The Grid
- ~4,680 week cells rendered in a 52-column layout (one year per row)
- Past weeks: filled white
- Current week: subtly pulsing
- Future weeks: outlined, quiet
- Hover any week for a tooltip: week number, age, date range, summary preview
- Click any week to open its detail page

### Week Detail Page (`/week/:weekNumber`)
- 7 daily reflection cards (expandable)
  - Mood (1–5 scale)
  - Notes
  - Meaningful activity
  - Wasted time
  - Tags
- Weekly reflection prompts:
  - What mattered most?
  - What drained your energy?
  - Was this week intentional?
  - What should change?
- Meaningful / wasted time scores (0–10)
- Week summary

### Milestones
- Pin milestones to any week
- Choose from icon set
- Title + description
- Shown on grid and week detail

### Analytics (`/analytics`)
- Life elapsed progress bar
- Average mood trend chart (SVG, no deps)
- Weeks logged count
- Avg meaningful / wasted scores
- Remaining weeks counter

### Search
- Full-text search across summaries and reflections
- Instant results modal

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18 + Vite + TailwindCSS + Framer Motion |
| Routing | React Router v6 |
| Backend | Node.js + Express.js (ESM) |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcrypt |
| Deployment | Docker + docker-compose |

---

## Design Philosophy

- **Black and white only** — no color distractions
- **Cormorant Garamond** for headings — elegant, literary, serif
- **DM Mono** for body — technical, precise, quiet
- Generous negative space
- No notifications, no streaks, no gamification
- The emptiness of future weeks is intentional — it should feel like something

---

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### Local Development

```bash
# 1. Clone and install
git clone <repo>
cd weeks

# Backend
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI
npm install
npm run dev

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`
Backend runs at `http://localhost:5000`

### Docker (Recommended)

```bash
docker-compose up --build
```

App available at `http://localhost:5173`

---

## API Reference

### Auth
| Method | Path | Description |
|---|---|---|
| POST | `/api/auth/register` | Register with name, email, password, dob, expectedLifespan |
| POST | `/api/auth/login` | Login → JWT token |
| GET | `/api/auth/me` | Get current user + lifespan stats |
| PATCH | `/api/auth/me` | Update name or expectedLifespan |

### Weeks
| Method | Path | Description |
|---|---|---|
| GET | `/api/weeks` | All week metadata (for grid) |
| GET | `/api/weeks/:n` | Single week with daily reflections |
| POST | `/api/weeks/:n` | Create or update week reflection |
| PATCH | `/api/weeks/:n/day/:i` | Update a single day |
| GET | `/api/weeks/search/query?q=` | Search reflections |

### Milestones
| Method | Path | Description |
|---|---|---|
| GET | `/api/milestones` | All user milestones |
| POST | `/api/milestones` | Create milestone |
| PATCH | `/api/milestones/:id` | Update milestone |
| DELETE | `/api/milestones/:id` | Delete milestone |

### Analytics
| Method | Path | Description |
|---|---|---|
| GET | `/api/analytics/overview` | Aggregated stats |
| GET | `/api/analytics/mood-trend` | Weekly mood series |

---

## MongoDB Schemas

### User
```js
{
  name: String,
  email: String (unique),
  password: String (hashed),
  dob: Date,
  expectedLifespan: Number (default: 90)
}
```

### Week
```js
{
  userId: ObjectId,
  weekNumber: Number,
  startDate: Date,
  endDate: Date,
  summary: String,
  meaningfulScore: Number (0-10),
  wastedScore: Number (0-10),
  matteredMost: String,
  drainedEnergy: String,
  intentional: Boolean,
  changeNextWeek: String,
  days: [{
    date: Date,
    dayOfWeek: String,
    notes: String,
    mood: Number (1-5),
    meaningfulActivity: String,
    wastedTime: String,
    tags: [String]
  }]
}
```

### Milestone
```js
{
  userId: ObjectId,
  weekNumber: Number,
  title: String,
  description: String,
  icon: String
}
```

---

## Folder Structure

```
weeks/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Week.js
│   │   └── Milestone.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── weeks.js
│   │   ├── milestones.js
│   │   └── analytics.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   ├── .env.example
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── grid/
│   │   │   │   ├── LifespanGrid.jsx
│   │   │   │   ├── WeekTooltip.jsx
│   │   │   │   └── GridStats.jsx
│   │   │   ├── week/
│   │   │   │   ├── DayCard.jsx
│   │   │   │   ├── WeeklyReflection.jsx
│   │   │   │   ├── MilestonePanel.jsx
│   │   │   │   └── MoodSelector.jsx
│   │   │   └── shared/
│   │   │       ├── Layout.jsx
│   │   │       └── SearchModal.jsx
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── AuthPage.jsx
│   │   │   ├── GridPage.jsx
│   │   │   ├── WeekPage.jsx
│   │   │   └── AnalyticsPage.jsx
│   │   ├── store/
│   │   │   └── auth.jsx
│   │   ├── utils/
│   │   │   ├── api.js
│   │   │   └── dates.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── Dockerfile
│   └── nginx.conf
└── docker-compose.yml
```

---

*"The fear of death follows from the fear of life. A man who lives fully is prepared to die at any time."*
