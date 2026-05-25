# Project context: weeks
Generated: 2026-05-25 · 40 files · stripped: comments, blank_lines, console_logs

---

## Project structure

```
weeks/
├── README.md
├── backend/
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── Milestone.js
│   │   ├── User.js
│   │   └── Week.js
│   ├── package.json
│   ├── routes/
│   │   ├── analytics.js
│   │   ├── auth.js
│   │   ├── milestones.js
│   │   └── weeks.js
│   └── server.js
├── docker-compose.yml
├── frontend/
│   ├── package.json
│   ├── postcss.config.js
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/
│   │   │   ├── grid/
│   │   │   │   ├── GridStats.jsx
│   │   │   │   ├── LifespanGrid.jsx
│   │   │   │   └── WeekTooltip.jsx
│   │   │   ├── shared/
│   │   │   │   ├── Layout.jsx
│   │   │   │   ├── SearchModal.jsx
│   │   │   │   └── SettingsPanel.jsx
│   │   │   └── week/
│   │   │       ├── DayCard.jsx
│   │   │       ├── DayLogPanel.jsx
│   │   │       ├── MilestonePanel.jsx
│   │   │       ├── MoodSelector.jsx
│   │   │       └── WeeklyReflection.jsx
│   │   ├── index.css
│   │   ├── main.jsx
│   │   ├── pages/
│   │   │   ├── AnalyticsPage.jsx
│   │   │   ├── AuthPage.jsx
│   │   │   ├── GridPage.jsx
│   │   │   ├── LandingPage.jsx
│   │   │   └── WeekPage.jsx
│   │   ├── store/
│   │   │   ├── auth.jsx
│   │   │   └── settings.jsx
│   │   └── utils/
│   │       ├── api.js
│   │       └── dates.js
│   ├── tailwind.config.js
│   └── vite.config.js
└── package.json
```

---

## Files

### `README.md`

```md
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
```

### `backend/middleware/auth.js`

```js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
function parseCookies(cookieHeader = '') {
  return Object.fromEntries(
    cookieHeader.split(';').filter(Boolean).map(cookie => {
      const [name, ...rest] = cookie.trim().split('=');
      return [name, decodeURIComponent(rest.join('='))];
    })
  );
}
export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'] || req.headers['Authorization'] || '';
    const cookies = parseCookies(req.headers.cookie || '');
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.slice(7).trim()
      : (authHeader.trim() || cookies.weeks_token || '');
    console.log('AUTH CHECK', {
      url: req.originalUrl,
      method: req.method,
      authHeader: authHeader ? `${authHeader.slice(0, 20)}...` : null,
      cookieHeader: req.headers.cookie || null,
      cookieKeys: Object.keys(cookies),
      token: token ? `${token.slice(0, 20)}...(${token.length})` : null,
      secret: process.env.JWT_SECRET ? 'custom' : 'default',
    });
    if (!token) return res.status(401).json({ message: 'No token provided' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'weeks-secret-key');
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) return res.status(401).json({ message: 'User not found' });
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
```

### `backend/models/Milestone.js`

```js
import mongoose from 'mongoose';
const milestoneSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  weekNumber: { type: Number, required: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  date: { type: Date },
  icon: { type: String, default: '◆' },
}, { timestamps: true });
milestoneSchema.index({ userId: 1, weekNumber: 1 });
export default mongoose.model('Milestone', milestoneSchema);
```

### `backend/models/User.js`

```js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;
function getMondayOf(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  d.setDate(d.getDate() + (day === 0 ? -6 : 1 - day));
  return d;
}
const userSchema = new mongoose.Schema({
  name:             { type: String, required: true, trim: true },
  email:            { type: String, required: true, unique: true, lowercase: true, trim: true },
  password:         { type: String, required: true, minlength: 6 },
  dob:              { type: Date, required: true },
  expectedLifespan: { type: Number, default: 90, min: 1, max: 150 },
}, { timestamps: true });
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
userSchema.methods.comparePassword = async function(candidate) {
  return bcrypt.compare(candidate, this.password);
};
userSchema.methods.getLifespanStats = function() {
  const epoch      = getMondayOf(this.dob);
  const now        = new Date();
  now.setHours(0, 0, 0, 0);
  const totalWeeks     = this.expectedLifespan * 52;
  const weeksLived     = Math.floor((now - epoch) / MS_PER_WEEK);
  const currentWeek    = weeksLived + 1;
  const remainingWeeks = Math.max(0, totalWeeks - weeksLived);
  return { totalWeeks, weeksLived, currentWeek, remainingWeeks };
};
userSchema.methods.toPublic = function() {
  const obj = this.toObject();
  delete obj.password;
  return { ...obj, ...this.getLifespanStats() };
};
export default mongoose.model('User', userSchema);
```

### `backend/models/Week.js`

```js
import mongoose from 'mongoose';
const daySchema = new mongoose.Schema({
  date: { type: Date, required: true },
  dayOfWeek: { type: String, enum: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] },
  notes: { type: String, default: '' },
  mood: { type: Number, min: 1, max: 5, default: null },
  meaningfulActivity: { type: String, default: '' },
  wastedTime: { type: String, default: '' },
  tags: [{ type: String, trim: true }],
}, { _id: false });
const weekSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  weekNumber: { type: Number, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  summary: { type: String, default: '' },
  meaningfulScore: { type: Number, min: 0, max: 10, default: null },
  wastedScore: { type: Number, min: 0, max: 10, default: null },
  matteredMost: { type: String, default: '' },
  drainedEnergy: { type: String, default: '' },
  intentional: { type: Boolean, default: null },
  changeNextWeek: { type: String, default: '' },
  days: [daySchema],
}, { timestamps: true });
weekSchema.index({ userId: 1, weekNumber: 1 }, { unique: true });
weekSchema.methods.getStats = function() {
  const filledDays = this.days.filter(d => d.mood !== null);
  const avgMood = filledDays.length
    ? filledDays.reduce((s, d) => s + d.mood, 0) / filledDays.length
    : null;
  return { avgMood, daysLogged: filledDays.length };
};
export default mongoose.model('Week', weekSchema);
```

### `backend/package.json`

```json
{
  "name": "weeks-backend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node server.js",
    "dev": "node --watch server.js"
  },
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.4.1"
  }
}
```

### `backend/routes/analytics.js`

```js
import express from 'express';
import Week from '../models/Week.js';
import { authenticate } from '../middleware/auth.js';
const router = express.Router();
router.use(authenticate);
router.get('/overview', async (req, res) => {
  try {
    const weeks = await Week.find({ userId: req.user._id }).lean();
    const totalLogged = weeks.length;
    const moodEntries = weeks.flatMap(w => w.days.filter(d => d.mood !== null).map(d => d.mood));
    const avgMood = moodEntries.length ? (moodEntries.reduce((a, b) => a + b, 0) / moodEntries.length).toFixed(2) : null;
    const meaningfulScores = weeks.filter(w => w.meaningfulScore != null).map(w => w.meaningfulScore);
    const avgMeaningful = meaningfulScores.length ? (meaningfulScores.reduce((a, b) => a + b, 0) / meaningfulScores.length).toFixed(2) : null;
    const wastedScores = weeks.filter(w => w.wastedScore != null).map(w => w.wastedScore);
    const avgWasted = wastedScores.length ? (wastedScores.reduce((a, b) => a + b, 0) / wastedScores.length).toFixed(2) : null;
    res.json({ totalLogged, avgMood, avgMeaningful, avgWasted, totalMoodEntries: moodEntries.length });
  } catch (err) { res.status(500).json({ message: err.message }); }
});
router.get('/mood-trend', async (req, res) => {
  try {
    const weeks = await Week.find({ userId: req.user._id })
      .select('weekNumber days.mood startDate').sort('weekNumber').lean();
    const trend = weeks.map(w => {
      const moods = w.days.filter(d => d.mood != null).map(d => d.mood);
      return {
        weekNumber: w.weekNumber,
        startDate: w.startDate,
        avgMood: moods.length ? +(moods.reduce((a, b) => a + b, 0) / moods.length).toFixed(2) : null,
      };
    }).filter(w => w.avgMood !== null);
    res.json({ trend });
  } catch (err) { res.status(500).json({ message: err.message }); }
});
export default router;
```

### `backend/routes/auth.js`

```js
import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'weeks-secret-key';
const COOKIE_NAME = 'weeks_token';
const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  secure: process.env.NODE_ENV === 'production',
  maxAge: 30 * 24 * 60 * 60 * 1000,
  path: '/',
};
const makeToken = (userId) => jwt.sign({ userId }, JWT_SECRET, { expiresIn: '30d' });
const setAuthCookie = (res, token) => {
  res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS);
  console.log('SET COOKIE', {
    name: COOKIE_NAME,
    options: COOKIE_OPTIONS,
    header: res.getHeader('Set-Cookie'),
  });
};
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, dob, expectedLifespan } = req.body;
    if (!name || !email || !password || !dob)
      return res.status(400).json({ message: 'All fields required' });
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: 'Email already registered' });
    const user = await User.create({ name, email, password, dob, expectedLifespan: expectedLifespan || 90 });
    const token = makeToken(user._id);
    setAuthCookie(res, token);
    res.status(201).json({ token, user: user.toPublic() });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: 'Invalid credentials' });
    const token = makeToken(user._id);
    setAuthCookie(res, token);
    res.json({ token, user: user.toPublic() });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.post('/logout', (req, res) => {
  res.clearCookie(COOKIE_NAME, { path: '/' });
  res.json({ ok: true });
});
router.get('/me', authenticate, (req, res) => {
  res.json({ user: req.user.toPublic() });
});
router.patch('/me', authenticate, async (req, res) => {
  try {
    const { name, expectedLifespan } = req.body;
    const updates = {};
    if (name) updates.name = name;
    if (expectedLifespan) updates.expectedLifespan = expectedLifespan;
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
    res.json({ user: user.toPublic() });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
export default router;
```

### `backend/routes/milestones.js`

```js
import express from 'express';
import Milestone from '../models/Milestone.js';
import { authenticate } from '../middleware/auth.js';
const router = express.Router();
router.use(authenticate);
router.get('/', async (req, res) => {
  try {
    const milestones = await Milestone.find({ userId: req.user._id }).sort('weekNumber').lean();
    res.json({ milestones });
  } catch (err) { res.status(500).json({ message: err.message }); }
});
router.post('/', async (req, res) => {
  try {
    const { weekNumber, title, description, date, icon } = req.body;
    const milestone = await Milestone.create({ userId: req.user._id, weekNumber, title, description, date, icon });
    res.status(201).json({ milestone });
  } catch (err) { res.status(500).json({ message: err.message }); }
});
router.patch('/:id', async (req, res) => {
  try {
    const milestone = await Milestone.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body, { new: true }
    );
    if (!milestone) return res.status(404).json({ message: 'Not found' });
    res.json({ milestone });
  } catch (err) { res.status(500).json({ message: err.message }); }
});
router.delete('/:id', async (req, res) => {
  try {
    await Milestone.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});
export default router;
```

### `backend/routes/weeks.js`

```js
import express from 'express';
import Week from '../models/Week.js';
import { authenticate } from '../middleware/auth.js';
const router = express.Router();
router.use(authenticate);
const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;
const MS_PER_DAY  = 24 * 60 * 60 * 1000;
function getMondayOf(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d;
}
function getWeekDates(dob, weekNumber) {
  const epoch     = getMondayOf(new Date(dob));
  const startDate = new Date(epoch.getTime() + (weekNumber - 1) * MS_PER_WEEK);
  const endDate   = new Date(startDate.getTime() + 6 * MS_PER_DAY);
  return { startDate, endDate };
}
function buildDefaultDays(startDate) {
  const dayNames = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(new Date(startDate).getTime() + i * MS_PER_DAY);
    return { date: d, dayOfWeek: dayNames[i], notes: '', mood: null, meaningfulActivity: '', wastedTime: '', tags: [] };
  });
}
router.get('/', async (req, res) => {
  try {
    const weeks = await Week.find({ userId: req.user._id })
      .select('weekNumber summary meaningfulScore wastedScore days.mood')
      .lean();
    res.json({ weeks });
  } catch (err) { res.status(500).json({ message: err.message }); }
});
router.get('/:weekNumber', async (req, res) => {
  try {
    const weekNumber = parseInt(req.params.weekNumber);
    let week = await Week.findOne({ userId: req.user._id, weekNumber });
    if (!week) {
      const { startDate, endDate } = getWeekDates(req.user.dob, weekNumber);
      week = new Week({ userId: req.user._id, weekNumber, startDate, endDate, days: buildDefaultDays(startDate) });
      return res.json({ week: week.toObject(), virtual: true });
    }
    res.json({ week });
  } catch (err) { res.status(500).json({ message: err.message }); }
});
router.post('/:weekNumber', async (req, res) => {
  try {
    const weekNumber = parseInt(req.params.weekNumber);
    const { startDate, endDate } = getWeekDates(req.user.dob, weekNumber);
    const { summary, meaningfulScore, wastedScore, matteredMost, drainedEnergy, intentional, changeNextWeek, days } = req.body;
    const data = { userId: req.user._id, weekNumber, startDate, endDate, summary, meaningfulScore, wastedScore, matteredMost, drainedEnergy, intentional, changeNextWeek };
    if (days) data.days = days;
    const week = await Week.findOneAndUpdate(
      { userId: req.user._id, weekNumber },
      { $set: data },
      { upsert: true, new: true, runValidators: true }
    );
    res.json({ week });
  } catch (err) { res.status(500).json({ message: err.message }); }
});
router.patch('/:weekNumber/day/:dayIndex', async (req, res) => {
  try {
    const weekNumber = parseInt(req.params.weekNumber);
    const dayIndex   = parseInt(req.params.dayIndex);
    const { startDate, endDate } = getWeekDates(req.user.dob, weekNumber);
    let week = await Week.findOne({ userId: req.user._id, weekNumber });
    if (!week) {
      week = new Week({ userId: req.user._id, weekNumber, startDate, endDate, days: buildDefaultDays(startDate) });
    }
    if (dayIndex >= 0 && dayIndex < 7) Object.assign(week.days[dayIndex], req.body);
    await week.save();
    res.json({ week });
  } catch (err) { res.status(500).json({ message: err.message }); }
});
router.get('/search/query', async (req, res) => {
  try {
    const q = req.query.q;
    if (!q) return res.json({ results: [] });
    const weeks = await Week.find({
      userId: req.user._id,
      $or: [
        { summary: { $regex: q, $options: 'i' } },
        { matteredMost: { $regex: q, $options: 'i' } },
        { 'days.notes': { $regex: q, $options: 'i' } },
      ]
    }).select('weekNumber summary startDate').limit(20).lean();
    res.json({ results: weeks });
  } catch (err) { res.status(500).json({ message: err.message }); }
});
export default router;
```

### `backend/server.js`

```js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import weekRoutes from './routes/weeks.js';
import milestoneRoutes from './routes/milestones.js';
import analyticsRoutes from './routes/analytics.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/weeks', weekRoutes);
app.use('/api/milestones', milestoneRoutes);
app.use('/api/analytics', analyticsRoutes);
app.get('/api/health', (_, res) => res.json({ status: 'ok' }));
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/weeks')
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    process.exit(1);
  });
export default app;
```

### `docker-compose.yml`

```yaml
version: '3.8'
services:
  mongodb:
    image: mongo:7
    restart: always
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
    environment:
      MONGO_INITDB_DATABASE: weeks
  backend:
    build: ./backend
    restart: always
    ports:
      - "5000:5000"
    environment:
      PORT: 5000
      MONGO_URI: mongodb://mongodb:27017/weeks
      JWT_SECRET: change-this-in-production
      FRONTEND_URL: http://localhost:5173
    depends_on:
      - mongodb
  frontend:
    build: ./frontend
    restart: always
    ports:
      - "5173:80"
    depends_on:
      - backend
volumes:
  mongo_data:
```

### `frontend/package.json`

```json
{
  "name": "weeks-frontend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "framer-motion": "^11.2.10",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.23.1"
  },
  "devDependencies": {
    "@types/react": "^18.3.3",
    "@vitejs/plugin-react": "^4.3.0",
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.38",
    "tailwindcss": "^3.4.4",
    "vite": "^5.2.13"
  }
}
```

### `frontend/postcss.config.js`

```js
export default { plugins: { tailwindcss: {}, autoprefixer: {} } };
```

### `frontend/src/App.jsx`

```jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './store/auth.jsx';
import { SettingsProvider } from './store/settings.jsx';
import LandingPage from './pages/LandingPage.jsx';
import AuthPage from './pages/AuthPage.jsx';
import GridPage from './pages/GridPage.jsx';
import WeekPage from './pages/WeekPage.jsx';
import AnalyticsPage from './pages/AnalyticsPage.jsx';
import Layout from './components/shared/Layout.jsx';
function Protected({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
      <span className="label" style={{ animation: 'pulse 1.5s infinite' }}>loading</span>
    </div>
  );
  return user ? children : <Navigate to="/auth" replace />;
}
function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/"         element={user ? <Navigate to="/grid" replace /> : <LandingPage />} />
      <Route path="/auth"     element={user ? <Navigate to="/grid" replace /> : <AuthPage />} />
      <Route path="/grid"     element={<Protected><Layout><GridPage /></Layout></Protected>} />
      <Route path="/week/:weekNumber" element={<Protected><Layout><WeekPage /></Layout></Protected>} />
      <Route path="/analytics" element={<Protected><Layout><AnalyticsPage /></Layout></Protected>} />
      <Route path="*"         element={<Navigate to="/" replace />} />
    </Routes>
  );
}
export default function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <AppRoutes />
      </SettingsProvider>
    </AuthProvider>
  );
}
```

### `frontend/src/components/grid/GridStats.jsx`

```jsx
import React from 'react';
export default function GridStats({ user }) {
  const pct = ((user.weeksLived / user.totalWeeks) * 100).toFixed(1);
  const yearsLeft = Math.floor(user.remainingWeeks / 52);
  const stats = [
    { label: 'weeks lived', value: user.weeksLived.toLocaleString() },
    { label: 'weeks remaining', value: user.remainingWeeks.toLocaleString() },
    { label: 'total weeks', value: user.totalWeeks.toLocaleString() },
    { label: 'elapsed', value: `${pct}%` },
    { label: 'years remaining', value: yearsLeft },
  ];
  return (
    <div className="flex flex-wrap gap-x-10 gap-y-3">
      {stats.map(s => (
        <div key={s.label}>
          <div className="label-mono text-mist text-xs mb-0.5">{s.label}</div>
          <div className="heading-serif text-bone text-2xl">{s.value}</div>
        </div>
      ))}
    </div>
  );
}
```

### `frontend/src/components/grid/LifespanGrid.jsx`

```jsx
import React, { useState, useCallback, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '../../store/settings.jsx';
import { getWeekDates, formatShortDate, getAgeAtWeek } from '../../utils/dates.js';
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const CELL = 11;
const GAP = 2;
function getBirthdayWeeks(dob, totalWeeks) {
  const set = new Set();
  const dobDate = new Date(dob);
  for (let yr = 1; yr <= Math.ceil(totalWeeks / 52); yr++) {
    const bday = new Date(dobDate);
    bday.setFullYear(dobDate.getFullYear() + yr);
    const msFromBirth = bday - dobDate;
    const weekNum = Math.floor(msFromBirth / (7 * 24 * 60 * 60 * 1000)) + 1;
    if (weekNum <= totalWeeks) set.add(weekNum);
  }
  return set;
}
function getMonthStartWeeks(dob, totalWeeks) {
  const result = {};
  const dobDate = new Date(dob);
  let prevMonth = -1;
  for (let w = 1; w <= Math.min(totalWeeks, 52 * 95); w++) {
    const d = new Date(dobDate.getTime() + (w - 1) * 7 * 24 * 60 * 60 * 1000);
    const m = d.getMonth();
    if (m !== prevMonth) {
      result[w] = MONTHS[m];
      prevMonth = m;
    }
  }
  return result;
}
export default function LifespanGrid({ user, weeksData, milestones }) {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const [tooltip, setTooltip] = useState(null);
  const tooltipTimer = useRef(null);
  const totalWeeks = user.totalWeeks;
  const currentWeek = user.currentWeek;
  const years = Math.ceil(totalWeeks / 52);
  const weekDataMap = useMemo(() => {
    const m = {};
    (weeksData || []).forEach(w => { m[w.weekNumber] = w; });
    return m;
  }, [weeksData]);
  const milestoneSet = useMemo(() => {
    const s = new Set();
    (milestones || []).forEach(ms => s.add(ms.weekNumber));
    return s;
  }, [milestones]);
  const milestoneMap = useMemo(() => {
    const m = {};
    (milestones || []).forEach(ms => { m[ms.weekNumber] = ms; });
    return m;
  }, [milestones]);
  const birthdayWeeks = useMemo(() =>
    settings.showBirthday ? getBirthdayWeeks(user.dob, totalWeeks) : new Set(),
    [user.dob, totalWeeks, settings.showBirthday]
  );
  const monthStartMap = useMemo(() =>
    settings.showMonthMarkers ? getMonthStartWeeks(user.dob, totalWeeks) : {},
    [user.dob, totalWeeks, settings.showMonthMarkers]
  );
  const handleMouseEnter = useCallback((e, weekNumber) => {
    clearTimeout(tooltipTimer.current);
    const { startDate, endDate } = getWeekDates(user.dob, weekNumber);
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({
      weekNumber,
      startDate,
      endDate,
      age: getAgeAtWeek(user.dob, weekNumber),
      year: Math.ceil(weekNumber / 52),
      weekData: weekDataMap[weekNumber],
      milestone: milestoneMap[weekNumber],
      x: rect.left,
      y: rect.top,
    });
  }, [user.dob, weekDataMap, milestoneMap]);
  const handleMouseLeave = useCallback(() => {
    tooltipTimer.current = setTimeout(() => setTooltip(null), 80);
  }, []);
  const handleClick = useCallback((weekNumber) => {
    navigate(`/week/${weekNumber}`);
  }, [navigate]);
  const getSideLabel = (yearIdx) => {
    const calYear = new Date(user.dob).getFullYear() + yearIdx;
    return calYear;
  };
  return (
    <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
      {}
      <div style={{ position: 'relative' }}>
        {}
        {settings.showMonthMarkers && (
          <div style={{ display: 'flex', marginBottom: '4px', marginLeft: settings.showYearLabels ? '36px' : '0' }}>
            {Array.from({ length: 52 }, (_, i) => {
              const wn = i + 1;
              const label = monthStartMap[wn];
              return (
                <div key={i} style={{
                  width: CELL, height: 10, flexShrink: 0,
                  marginRight: i < 51 ? GAP : 0,
                  display: 'flex', alignItems: 'center',
                }}>
                  {label && (
                    <span className="month-label" style={{ fontSize: '7px', color: 'var(--dim)', position: 'absolute' }}>
                      {label}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
        {Array.from({ length: years }, (_, yearIdx) => {
          const yearStart = yearIdx * 52 + 1;
          return (
            <div key={yearIdx} style={{ display: 'flex', alignItems: 'center', gap: GAP, marginBottom: GAP }}>
              {}
              {settings.showYearLabels && (
                <div className="year-label" style={{
                  color: yearIdx % 10 === 0 ? 'var(--sub)' : yearIdx % 5 === 0 ? 'var(--dim)' : 'transparent',
                  fontSize: yearIdx % 10 === 0 ? '10px' : '9px',
                }}>
                  {yearIdx + 1}
                </div>
              )}
              {}
              {Array.from({ length: 52 }, (_, wi) => {
                const wn = yearStart + wi;
                if (wn > totalWeeks) {
                  return <div key={wi} style={{ width: CELL, height: CELL, flexShrink: 0 }} />;
                }
                const isPast    = wn < currentWeek;
                const isCurrent = wn === currentWeek;
                const hasEntry  = settings.highlightLogged && !!weekDataMap[wn]?.summary;
                const isBday    = birthdayWeeks.has(wn);
                const hasMile   = settings.showMilestones && milestoneSet.has(wn);
                let cls = 'cell';
                if (isBday)    cls += ' birthday';
                else if (isCurrent) cls += ' current';
                else if (isPast)    cls += ' lived' + (hasEntry ? ' has-entry' : '');
                if (hasMile && !isBday) cls += ' milestone-mark';
                return (
                  <div
                    key={wi}
                    className={cls}
                    onMouseEnter={(e) => handleMouseEnter(e, wn)}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => handleClick(wn)}
                  />
                );
              })}
              {}
              <div style={{ marginLeft: '10px', display: 'flex', alignItems: 'center', gap: '8px', minWidth: '100px' }}>
                <span style={{
                  fontFamily: "'Geist Mono', monospace",
                  fontSize: yearIdx % 5 === 0 ? '11px' : '9px',
                  color: yearIdx % 5 === 0 ? 'var(--sub)' : 'var(--dim)',
                  fontWeight: yearIdx % 10 === 0 ? '500' : '300',
                }}>
                  {getSideLabel(yearIdx)}
                </span>
                {yearIdx % 5 === 0 && (
                  <span style={{ fontSize: '9px', color: 'var(--dim)', fontFamily: "'Geist Mono', monospace" }}>
                    age {yearIdx + 1}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {}
      {tooltip && (
        <div className="tooltip" style={{
          left: Math.min(tooltip.x + 16, window.innerWidth - 220),
          top: tooltip.y - 8,
          transform: 'translateY(-100%)',
        }}>
          <div style={{ marginBottom: '8px' }}>
            <div className="label" style={{ marginBottom: '3px' }}>week {tooltip.weekNumber}</div>
            <div className="serif" style={{ fontSize: '1.5rem', color: 'var(--text)', lineHeight: 1 }}>
              age {tooltip.age}
            </div>
          </div>
          <div style={{ color: 'var(--sub)', fontSize: '11px', marginBottom: '4px' }}>
            {formatShortDate(tooltip.startDate)} — {formatShortDate(tooltip.endDate)}
          </div>
          <div style={{ color: 'var(--dim)', fontSize: '10px', marginBottom: tooltip.weekData?.summary ? '8px' : 0 }}>
            year {tooltip.year}
          </div>
          {tooltip.milestone && (
            <div style={{
              borderTop: '1px solid var(--border)', paddingTop: '8px', marginTop: '6px',
              fontSize: '11px', color: 'var(--accent)',
            }}>
              {tooltip.milestone.icon} {tooltip.milestone.title}
            </div>
          )}
          {tooltip.weekData?.summary && (
            <div style={{
              borderTop: '1px solid var(--border)', paddingTop: '8px', marginTop: '6px',
              fontSize: '11px', color: 'var(--sub)',
              display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
            }}>
              {tooltip.weekData.summary}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
```

### `frontend/src/components/grid/WeekTooltip.jsx`

```jsx
import React from 'react';
import { formatShortDate, getAgeAtWeek } from '../../utils/dates.js';
export default function WeekTooltip({ week, weekData, milestone, position, user }) {
  if (!position) return null;
  const { startDate, endDate } = week;
  const age = getAgeAtWeek(user.dob, week.number);
  const year = Math.ceil(week.number / 52);
  const style = {
    left: Math.min(position.x + 12, window.innerWidth - 210),
    top: position.y - 10,
    transform: 'translateY(-100%)',
  };
  return (
    <div className="week-tooltip" style={style}>
      <div className="label-mono text-mist text-xs mb-2">week {week.number}</div>
      <div className="heading-serif text-bone text-lg mb-1">age {age}</div>
      <div className="label-mono text-mist text-xs mb-1">year {year} of life</div>
      <div className="label-mono text-mist text-xs">
        {formatShortDate(startDate)} — {formatShortDate(endDate)}
      </div>
      {milestone && (
        <div className="mt-2 pt-2 border-t border-white/10 label-mono text-bone text-xs">
          {milestone.icon} {milestone.title}
        </div>
      )}
      {weekData?.summary && (
        <div className="mt-2 pt-2 border-t border-white/10 text-bone/60 text-xs font-mono line-clamp-2">
          {weekData.summary}
        </div>
      )}
    </div>
  );
}
```

### `frontend/src/components/shared/Layout.jsx`

```jsx
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../store/auth.jsx';
import SearchModal from './SearchModal.jsx';
import SettingsPanel from './SettingsPanel.jsx';
export default function Layout({ children }) {
  const { user } = useAuth();
  const location = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const navItems = [
    { path: '/grid', label: 'grid' },
    { path: '/analytics', label: 'insights' },
  ];
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 32px', height: '52px',
        background: 'var(--bg)',
        borderBottom: '1px solid var(--border)',
      }}>
        <Link to="/grid" style={{ fontFamily: "'Libre Baskerville', serif", color: 'var(--text)', fontSize: '17px', textDecoration: 'none' }}>
          weeks
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          {navItems.map(item => (
            <Link key={item.path} to={item.path} style={{
              fontFamily: "'Geist Mono', monospace",
              fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase',
              textDecoration: 'none',
              color: location.pathname === item.path ? 'var(--text)' : 'var(--sub)',
              transition: 'color 0.15s',
            }}>
              {item.label}
            </Link>
          ))}
          <button onClick={() => setSearchOpen(true)} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: "'Geist Mono', monospace", fontSize: '11px',
            letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--sub)',
          }}>search</button>
          <button onClick={() => setSettingsOpen(true)} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: "'Geist Mono', monospace", fontSize: '11px',
            letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--sub)',
          }}>settings</button>
        </div>
      </nav>
      {}
      <motion.main
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        style={{ paddingTop: '52px' }}
      >
        {children}
      </motion.main>
      <AnimatePresence>
        {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}
      </AnimatePresence>
      <AnimatePresence>
        {settingsOpen && <SettingsPanel onClose={() => setSettingsOpen(false)} />}
      </AnimatePresence>
    </div>
  );
}
```

### `frontend/src/components/shared/SearchModal.jsx`

```jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { api } from '../../utils/api.js';
export default function SearchModal({ onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const ref = useRef(null);
  useEffect(() => { ref.current?.focus(); }, []);
  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    const t = setTimeout(async () => {
      setLoading(true);
      try { const { results } = await api.searchWeeks(query); setResults(results); }
      catch {}
      setLoading(false);
    }, 280);
    return () => clearTimeout(t);
  }, [query]);
  const go = (n) => { navigate(`/week/${n}`); onClose(); };
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        paddingTop: '80px', padding: '80px 16px 16px',
      }}
      onClick={onClose}
    >
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(13,13,15,0.8)', backdropFilter: 'blur(6px)' }} />
      <motion.div
        initial={{ y: -16, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        style={{
          position: 'relative', width: '100%', maxWidth: '520px',
          background: 'var(--surface)', border: '1px solid var(--border2)',
          boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          padding: '14px 18px', borderBottom: '1px solid var(--border)',
        }}>
          <span className="label">search</span>
          <input
            ref={ref}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="weeks, reflections, memories..."
            onKeyDown={e => e.key === 'Escape' && onClose()}
            style={{ flex: 1, fontSize: '13px', color: 'var(--text)' }}
          />
          {loading && <span className="label" style={{ opacity: 0.5 }}>...</span>}
        </div>
        {}
        {results.length > 0 && (
          <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
            {results.map(r => (
              <button key={r._id} onClick={() => go(r.weekNumber)} style={{
                width: '100%', textAlign: 'left',
                padding: '12px 18px',
                borderBottom: '1px solid var(--border)',
                background: 'transparent',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '14px',
                transition: 'background 0.12s',
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--surface)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <span className="label" style={{ flexShrink: 0 }}>week {r.weekNumber}</span>
                <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: '12px', color: 'var(--sub)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {r.summary || '—'}
                </span>
              </button>
            ))}
          </div>
        )}
        {query && !loading && results.length === 0 && (
          <div style={{ padding: '16px 18px' }}>
            <span className="label">no results</span>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
```

### `frontend/src/components/shared/SettingsPanel.jsx`

```jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettings } from '../../store/settings.jsx';
import { useAuth } from '../../store/auth.jsx';
const TOGGLES = [
  {
    section: 'grid display',
    items: [
      { key: 'showYearLabels', label: 'Year labels', desc: 'Show year numbers beside each row' },
      { key: 'showMonthMarkers', label: 'Month markers', desc: 'Show month lines across the grid' },
      { key: 'highlightLogged', label: 'Highlight logged weeks', desc: 'Brighter cells when you\'ve written a reflection' },
    ],
  },
  {
    section: 'special weeks',
    items: [
      { key: 'showBirthday', label: 'Birthday weeks', desc: 'Mark your birthday week in purple each year' },
      { key: 'showMilestones', label: 'Milestone borders', desc: 'Show border on weeks with pinned milestones' },
    ],
  },
  {
    section: 'insights',
    items: [
      { key: 'showStats', label: 'Life stats panel', desc: 'Show weeks elapsed, remaining etc. on grid page' },
    ],
  },
];
export default function SettingsPanel({ onClose }) {
  const { settings, toggle } = useSettings();
  const { user, logout } = useAuth();
  return (
    <AnimatePresence>
      <motion.div className="settings-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose} />
      <motion.div className="settings-panel" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
        transition={{ type: 'tween', duration: 0.22 }}>
        {}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="label mb-1">settings</div>
            <div className="serif text-text" style={{ fontSize: '1.3rem' }}>{user?.name}</div>
          </div>
          <button onClick={onClose} className="btn" style={{ padding: '6px 10px' }}>✕</button>
        </div>
        {}
        {TOGGLES.map(group => (
          <div key={group.section} className="mb-8">
            <div className="label mb-4" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
              {group.section}
            </div>
            <div className="space-y-5">
              {group.items.map(item => (
                <div key={item.key} className="flex items-start justify-between gap-4">
                  <div>
                    <div style={{ color: 'var(--text)', fontSize: '12px', marginBottom: '2px' }}>{item.label}</div>
                    <div style={{ color: 'var(--sub)', fontSize: '11px', lineHeight: 1.4 }}>{item.desc}</div>
                  </div>
                  <button
                    className={`toggle ${settings[item.key] ? 'on' : ''}`}
                    onClick={() => toggle(item.key)}
                    style={{ marginTop: '2px' }}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
        {}
        <div className="mb-8" style={{ borderTop: '1px solid var(--border)', paddingTop: '24px' }}>
          <div className="label mb-4">account</div>
          <div style={{ color: 'var(--sub)', fontSize: '11px', lineHeight: 1.8 }}>
            <div>{user?.email}</div>
            <div>born {user?.dob ? new Date(user.dob).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '—'}</div>
            <div>lifespan set to {user?.expectedLifespan} years</div>
          </div>
        </div>
        {}
        <button onClick={logout} className="btn w-full" style={{ justifyContent: 'center', color: 'var(--sub)' }}>
          sign out
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
```

### `frontend/src/components/week/DayCard.jsx`

```jsx
import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MoodSelector from './MoodSelector.jsx';
import { formatDate } from '../../utils/dates.js';
export default function DayCard({ day, dayIndex, weekNumber, onChange }) {
  const [open, setOpen] = useState(false);
  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const update = (field) => (e) => onChange(dayIndex, { [field]: e.target.value });
  const updateMood = (mood) => onChange(dayIndex, { mood });
  const updateTags = (e) => {
    const tags = e.target.value.split(',').map(t => t.trim()).filter(Boolean);
    onChange(dayIndex, { tags });
  };
  const hasContent = day.notes || day.mood || day.meaningfulActivity || day.wastedTime;
  return (
    <div className="border border-white/8 hover:border-white/15 transition-colors">
      {}
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-left">
        <div className="flex items-center gap-4">
          <span className="heading-serif text-bone text-lg">{dayNames[dayIndex]}</span>
          {day.date && <span className="label-mono text-mist text-xs">{formatDate(day.date)}</span>}
          {day.mood && (
            <div className="flex gap-1">
              {Array.from({ length: 5 }, (_, i) => (
                <div key={i} className={`w-1.5 h-1.5 rounded-full ${i < day.mood ? 'bg-bone/80' : 'bg-white/10'}`} />
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {hasContent && <div className="w-1.5 h-1.5 rounded-full bg-bone/40" />}
          <span className="label-mono text-mist text-xs">{open ? '↑' : '↓'}</span>
        </div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
            className="overflow-hidden">
            <div className="px-4 pb-5 space-y-5 border-t border-white/8 pt-4">
              {}
              <div>
                <div className="label-mono text-mist text-xs mb-2">mood</div>
                <MoodSelector value={day.mood} onChange={updateMood} />
              </div>
              {}
              <div>
                <div className="label-mono text-mist text-xs mb-1">notes</div>
                <textarea value={day.notes || ''} onChange={update('notes')}
                  placeholder="what happened today..."
                  className="w-full text-bone text-sm placeholder-mist/25 resize-none leading-relaxed min-h-[60px] bg-transparent"
                  style={{ outline: 'none', borderBottom: '1px solid rgba(240,237,232,0.08)' }}
                />
              </div>
              {}
              <div>
                <div className="label-mono text-mist text-xs mb-1">meaningful activity</div>
                <input value={day.meaningfulActivity || ''} onChange={update('meaningfulActivity')}
                  placeholder="what made today worthwhile..."
                  className="w-full text-bone text-sm placeholder-mist/25"
                  style={{ borderBottom: '1px solid rgba(240,237,232,0.08)', paddingBottom: '4px' }}
                />
              </div>
              {}
              <div>
                <div className="label-mono text-mist text-xs mb-1">wasted time</div>
                <input value={day.wastedTime || ''} onChange={update('wastedTime')}
                  placeholder="where did time disappear..."
                  className="w-full text-bone text-sm placeholder-mist/25"
                  style={{ borderBottom: '1px solid rgba(240,237,232,0.08)', paddingBottom: '4px' }}
                />
              </div>
              {}
              <div>
                <div className="label-mono text-mist text-xs mb-1">tags (comma separated)</div>
                <input value={(day.tags || []).join(', ')} onChange={updateTags}
                  placeholder="work, family, health..."
                  className="w-full text-bone text-sm placeholder-mist/25"
                  style={{ borderBottom: '1px solid rgba(240,237,232,0.08)', paddingBottom: '4px' }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
```

### `frontend/src/components/week/DayLogPanel.jsx`

```jsx
import React, { useRef, useEffect } from 'react';
const MOODS = [
  { value: 1, label: 'rough',   color: '#6b4c4c' },
  { value: 2, label: 'low',     color: '#6b5c3e' },
  { value: 3, label: 'okay',    color: '#4a5568' },
  { value: 4, label: 'good',    color: '#3d5a4a' },
  { value: 5, label: 'great',   color: '#c9a96e' },
];
export default function DayLogPanel({ day, dayIndex, dayName, date, onChange, onClose }) {
  const notesRef = useRef(null);
  useEffect(() => {
    const t = setTimeout(() => notesRef.current?.focus(), 120);
    return () => clearTimeout(t);
  }, [dayIndex]);
  const upd = (field) => (e) => onChange(dayIndex, { [field]: e.target.value });
  const updMood = (val) => onChange(dayIndex, { mood: day.mood === val ? null : val });
  const updTags = (e) => onChange(dayIndex, {
    tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean),
  });
  const dateStr = date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--accent)',
      borderTop: 'none',
      padding: '28px 28px 24px',
    }}>
      {}
      <div style={{
        display: 'flex', alignItems: 'flex-start',
        justifyContent: 'space-between', marginBottom: '28px',
      }}>
        <div>
          <div className="serif" style={{ fontSize: '1.6rem', color: 'var(--text)', marginBottom: '3px' }}>
            {dayName}
          </div>
          <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '11px', color: 'var(--sub)' }}>
            {dateStr}
          </div>
        </div>
        <button onClick={onClose} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          fontFamily: "'Geist Mono', monospace", fontSize: '11px',
          color: 'var(--dim)', letterSpacing: '0.06em',
          padding: '4px 8px',
        }}>close ✕</button>
      </div>
      {}
      <div style={{ marginBottom: '24px' }}>
        <div className="field-label" style={{ marginBottom: '10px' }}>how was today?</div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {MOODS.map(m => (
            <button
              key={m.value}
              onClick={() => updMood(m.value)}
              style={{
                flex: 1,
                padding: '10px 4px',
                border: `1px solid ${day.mood === m.value ? m.color : 'var(--border2)'}`,
                background: day.mood === m.value ? `${m.color}22` : 'transparent',
                cursor: 'pointer',
                fontFamily: "'Geist Mono', monospace",
                fontSize: '11px',
                letterSpacing: '0.04em',
                color: day.mood === m.value ? m.color : 'var(--sub)',
                transition: 'all 0.15s',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <div style={{
                width: '8px', height: '8px', borderRadius: '50%',
                background: day.mood === m.value ? m.color : 'var(--dim)',
                transition: 'background 0.15s',
              }} />
              {m.label}
            </button>
          ))}
        </div>
      </div>
      {}
      <div style={{ marginBottom: '20px' }}>
        <div className="field-label">notes</div>
        <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
          <textarea
            ref={notesRef}
            value={day.notes || ''}
            onChange={upd('notes')}
            placeholder="what happened today..."
            style={{
              width: '100%', minHeight: '80px', resize: 'none',
              fontSize: '13px', color: 'var(--text)', lineHeight: '1.7',
              background: 'transparent', border: 'none', outline: 'none',
              fontFamily: "'Geist Mono', monospace",
            }}
          />
        </div>
      </div>
      {}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        <div>
          <div className="field-label">meaningful activity</div>
          <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '6px' }}>
            <input
              value={day.meaningfulActivity || ''}
              onChange={upd('meaningfulActivity')}
              placeholder="what made it worthwhile..."
              style={{
                width: '100%', color: 'var(--text)', fontSize: '13px',
                fontFamily: "'Geist Mono', monospace",
              }}
            />
          </div>
        </div>
        <div>
          <div className="field-label">wasted time</div>
          <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '6px' }}>
            <input
              value={day.wastedTime || ''}
              onChange={upd('wastedTime')}
              placeholder="where did time go..."
              style={{
                width: '100%', color: 'var(--text)', fontSize: '13px',
                fontFamily: "'Geist Mono', monospace",
              }}
            />
          </div>
        </div>
      </div>
      {}
      <div>
        <div className="field-label">tags</div>
        <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '6px' }}>
          <input
            value={(day.tags || []).join(', ')}
            onChange={updTags}
            placeholder="work, family, health, creative..."
            style={{
              width: '100%', color: 'var(--text)', fontSize: '13px',
              fontFamily: "'Geist Mono', monospace",
            }}
          />
        </div>
        {(day.tags || []).length > 0 && (
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '10px' }}>
            {day.tags.map(tag => (
              <span key={tag} style={{
                fontFamily: "'Geist Mono', monospace", fontSize: '10px',
                color: 'var(--accent)', border: '1px solid rgba(201,169,110,0.3)',
                padding: '2px 8px', letterSpacing: '0.06em',
              }}>{tag}</span>
            ))}
          </div>
        )}
      </div>
      {}
      <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
        <span className="label" style={{ color: 'var(--dim)', fontStyle: 'italic', textTransform: 'none', letterSpacing: 0 }}>
          changes save automatically as you type
        </span>
      </div>
    </div>
  );
}
```

### `frontend/src/components/week/MilestonePanel.jsx`

```jsx
import React, { useState } from 'react';
import { api } from '../../utils/api.js';
const ICONS = ['◆', '○', '△', '★', '♦', '●', '◇', '❋', '✦', '⬡'];
export default function MilestonePanel({ weekNumber, milestones, onUpdate }) {
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', icon: '◆' });
  const [saving, setSaving] = useState(false);
  const weekMilestones = milestones.filter(m => m.weekNumber === weekNumber);
  const save = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      await api.createMilestone({ weekNumber, ...form });
      await onUpdate();
      setForm({ title: '', description: '', icon: '◆' });
      setAdding(false);
    } catch (err) { console.error(err); }
    setSaving(false);
  };
  const remove = async (id) => {
    try { await api.deleteMilestone(id); await onUpdate(); } catch {}
  };
  return (
    <div>
      <div className="label" style={{
        marginBottom: '14px', paddingBottom: '10px',
        borderBottom: '1px solid var(--border)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <span>milestones</span>
        <button
          onClick={() => setAdding(a => !a)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: "'Geist Mono', monospace",
            fontSize: '11px', color: adding ? 'var(--sub)' : 'var(--accent)',
            letterSpacing: '0.06em',
          }}
        >
          {adding ? 'cancel' : '+ pin'}
        </button>
      </div>
      {}
      {weekMilestones.length === 0 && !adding && (
        <div className="label" style={{ fontStyle: 'italic', color: 'var(--dim)', textTransform: 'none', letterSpacing: 0 }}>
          no milestones yet
        </div>
      )}
      {weekMilestones.map(m => (
        <div key={m._id} style={{
          display: 'flex', alignItems: 'flex-start', gap: '10px',
          marginBottom: '10px', padding: '8px 0',
          borderBottom: '1px solid var(--border)',
        }}
          className="group">
          <span style={{ color: 'var(--accent)', fontSize: '13px', flexShrink: 0, marginTop: '1px' }}>{m.icon}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ color: 'var(--text)', fontSize: '13px', marginBottom: m.description ? '2px' : 0 }}>
              {m.title}
            </div>
            {m.description && (
              <div style={{ color: 'var(--sub)', fontSize: '11px' }}>{m.description}</div>
            )}
          </div>
          <button onClick={() => remove(m._id)} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--dim)', fontSize: '12px', flexShrink: 0,
            transition: 'color 0.15s',
          }}
            onMouseEnter={e => e.target.style.color = 'var(--sub)'}
            onMouseLeave={e => e.target.style.color = 'var(--dim)'}
          >✕</button>
        </div>
      ))}
      {}
      {adding && (
        <div style={{ marginTop: '12px' }}>
          {}
          <div className="field-label" style={{ marginBottom: '8px' }}>icon</div>
          <div style={{ display: 'flex', gap: '6px', marginBottom: '14px', flexWrap: 'wrap' }}>
            {ICONS.map(ic => (
              <button key={ic} onClick={() => setForm(f => ({ ...f, icon: ic }))}
                style={{
                  width: '28px', height: '28px', border: '1px solid',
                  borderColor: form.icon === ic ? 'var(--accent)' : 'var(--border2)',
                  background: form.icon === ic ? 'rgba(201,169,110,0.1)' : 'transparent',
                  color: form.icon === ic ? 'var(--accent)' : 'var(--sub)',
                  cursor: 'pointer', fontSize: '13px', transition: 'all 0.12s',
                }}>
                {ic}
              </button>
            ))}
          </div>
          <div className="field" style={{ marginBottom: '10px' }}>
            <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="milestone title"
              style={{ width: '100%', color: 'var(--text)', fontSize: '13px' }} />
          </div>
          <div className="field" style={{ marginBottom: '14px' }}>
            <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="description (optional)"
              style={{ width: '100%', color: 'var(--text)', fontSize: '13px' }} />
          </div>
          <button onClick={save} disabled={saving || !form.title.trim()} className="btn btn-primary" style={{ fontSize: '11px' }}>
            {saving ? 'saving...' : 'pin milestone'}
          </button>
        </div>
      )}
    </div>
  );
}
```

### `frontend/src/components/week/MoodSelector.jsx`

```jsx
import React from 'react';
const MOODS = [
  { value: 1, label: 'difficult' },
  { value: 2, label: 'low' },
  { value: 3, label: 'neutral' },
  { value: 4, label: 'good' },
  { value: 5, label: 'great' },
];
export default function MoodSelector({ value, onChange }) {
  return (
    <div className="flex gap-3 items-center">
      {MOODS.map(m => (
        <button key={m.value} onClick={() => onChange(value === m.value ? null : m.value)}
          className="flex flex-col items-center gap-1 group">
          <div className={`mood-dot ${value === m.value ? 'active' : ''} group-hover:opacity-60`}
            style={{ width: '10px', height: '10px' }} />
          <span className={`label-mono text-[9px] transition-opacity ${value === m.value ? 'text-bone' : 'text-mist/50 group-hover:text-mist'}`}>
            {m.label}
          </span>
        </button>
      ))}
    </div>
  );
}
```

### `frontend/src/components/week/WeeklyReflection.jsx`

```jsx
import React from 'react';
const QUESTIONS = [
  { key: 'matteredMost',   label: 'what mattered most?',            placeholder: 'the moments that counted...' },
  { key: 'drainedEnergy',  label: 'what drained your energy?',      placeholder: 'what cost you this week...' },
  { key: 'changeNextWeek', label: 'what should change next week?',  placeholder: 'intentions going forward...' },
];
export default function WeeklyReflection({ data, onChange }) {
  return (
    <div>
      <div className="label" style={{
        marginBottom: '14px', paddingBottom: '10px',
        borderBottom: '1px solid var(--border)',
      }}>
        weekly reflection
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '24px' }}>
        {QUESTIONS.map(q => (
          <div key={q.key}>
            <div className="field-label">{q.label}</div>
            <div className="field">
              <textarea
                value={data[q.key] || ''}
                onChange={e => onChange(q.key, e.target.value)}
                placeholder={q.placeholder}
                style={{
                  width: '100%', minHeight: '56px', resize: 'none',
                  fontSize: '13px', color: 'var(--text)', lineHeight: '1.6',
                  background: 'transparent', border: 'none', outline: 'none',
                }}
              />
            </div>
          </div>
        ))}
      </div>
      {}
      <div style={{ marginBottom: '24px' }}>
        <div className="field-label" style={{ marginBottom: '10px' }}>
          did you spend your time intentionally?
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {[{ val: true, label: 'yes' }, { val: false, label: 'no' }].map(opt => (
            <button
              key={String(opt.val)}
              onClick={() => onChange('intentional', data.intentional === opt.val ? null : opt.val)}
              className="btn"
              style={data.intentional === opt.val ? {
                borderColor: 'var(--accent)',
                color: 'var(--accent)',
                background: 'rgba(201,169,110,0.07)',
              } : {}}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
      {}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <ScoreInput
          label="meaningful score"
          value={data.meaningfulScore}
          onChange={v => onChange('meaningfulScore', v)}
          accent
        />
        <ScoreInput
          label="wasted time score"
          value={data.wastedScore}
          onChange={v => onChange('wastedScore', v)}
        />
      </div>
    </div>
  );
}
function ScoreInput({ label, value, onChange, accent }) {
  return (
    <div>
      <div className="field-label" style={{ marginBottom: '8px' }}>{label} (0–10)</div>
      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
        {Array.from({ length: 11 }, (_, i) => (
          <button
            key={i}
            onClick={() => onChange(value === i ? null : i)}
            style={{
              width: '22px', height: '22px',
              fontSize: '10px',
              fontFamily: "'Geist Mono', monospace",
              border: '1px solid',
              cursor: 'pointer',
              transition: 'all 0.12s',
              flexShrink: 0,
              borderColor: value === i ? (accent ? 'var(--accent)' : 'var(--sub)') : 'var(--border2)',
              background: value === i ? (accent ? 'var(--accent)' : 'var(--sub)') : 'transparent',
              color: value === i ? 'var(--bg)' : 'var(--sub)',
            }}
          >
            {i}
          </button>
        ))}
      </div>
    </div>
  );
}
```

### `frontend/src/index.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
@layer base {
  :root {
    --bg:      #0d0d0f;
    --surface: #161618;
    --border:  #252528;
    --border2: #303035;
    --text:    #e8e6e1;
    --sub:     #7a7880;
    --dim:     #3a3840;
    --accent:  #c9a96e;
    --accent2: #e8c98a;
    --lived:   #c9a96e;
    --future:  #252528;
    --cell:    11px;
    --gap:     2px;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; height: 100%; }
  body {
    background: var(--bg);
    color: var(--text);
    font-family: 'Geist Mono', monospace;
    font-weight: 300;
    font-size: 13px;
    -webkit-font-smoothing: antialiased;
    min-height: 100%;
  }
  ::selection { background: rgba(201,169,110,0.2); }
  ::-webkit-scrollbar { width: 3px; height: 3px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--dim); border-radius: 2px; }
  input, textarea, button { font-family: inherit; }
  input, textarea {
    background: transparent;
    border: none;
    outline: none;
    color: var(--text);
    font-size: 13px;
  }
  input:-webkit-autofill,
  input:-webkit-autofill:focus {
    -webkit-text-fill-color: var(--text);
    -webkit-box-shadow: 0 0 0 1000px var(--surface) inset;
  }
}
.serif      { font-family: 'Libre Baskerville', serif; }
.mono       { font-family: 'Geist Mono', monospace; }
.label {
  font-family: 'Geist Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--sub);
  font-weight: 400;
}
.value-big {
  font-family: 'Libre Baskerville', serif;
  font-size: 2.4rem;
  color: var(--text);
  line-height: 1;
  font-weight: 400;
}
.btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 16px;
  font-size: 11px;
  letter-spacing: 0.08em;
  cursor: pointer;
  transition: all 0.15s;
  border: 1px solid var(--border2);
  background: transparent;
  color: var(--sub);
}
.btn:hover { border-color: var(--accent); color: var(--accent); }
.btn-primary {
  background: var(--accent);
  color: var(--bg);
  border-color: var(--accent);
  font-weight: 500;
}
.btn-primary:hover { background: var(--accent2); border-color: var(--accent2); color: var(--bg); }
.btn:disabled { opacity: 0.3; pointer-events: none; }
.field {
  border-bottom: 1px solid var(--border);
  padding: 8px 0;
  transition: border-color 0.2s;
}
.field:focus-within { border-bottom-color: var(--accent); }
.field input, .field textarea { width: 100%; color: var(--text); }
.field-label {
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--sub);
  margin-bottom: 4px;
  font-weight: 400;
}
.cell {
  width: var(--cell);
  height: var(--cell);
  flex-shrink: 0;
  background: var(--future);
  border: 1px solid var(--border);
  cursor: pointer;
  transition: transform 0.1s, border-color 0.1s, background 0.1s;
  position: relative;
}
.cell.lived {
  background: var(--lived);
  border-color: var(--lived);
  opacity: 0.75;
}
.cell.has-entry {
  opacity: 1;
}
.cell.current {
  background: var(--accent2);
  border-color: var(--accent2);
  opacity: 1;
  animation: cellPulse 2.5s ease-in-out infinite;
}
.cell.birthday {
  background: #8b5cf6 !important;
  border-color: #8b5cf6 !important;
  opacity: 1 !important;
}
.cell.milestone-mark {
  border-color: var(--accent2) !important;
}
.cell:hover {
  transform: scale(1.6);
  z-index: 20;
  border-color: var(--accent2) !important;
  opacity: 1 !important;
}
@keyframes cellPulse {
  0%, 100% { opacity: 0.7; }
  50%       { opacity: 1; }
}
.tooltip {
  position: fixed;
  pointer-events: none;
  z-index: 200;
  background: var(--surface);
  border: 1px solid var(--border2);
  padding: 10px 14px;
  min-width: 190px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.5);
}
.year-label {
  font-family: 'Geist Mono', monospace;
  font-size: 10px;
  color: var(--sub);
  width: 28px;
  text-align: right;
  flex-shrink: 0;
  line-height: var(--cell);
  user-select: none;
  font-weight: 400;
}
.month-label {
  font-family: 'Geist Mono', monospace;
  font-size: 9px;
  color: var(--dim);
  user-select: none;
  white-space: nowrap;
}
.settings-overlay {
  position: fixed;
  inset: 0;
  z-index: 300;
  background: rgba(13,13,15,0.85);
  backdrop-filter: blur(6px);
}
.settings-panel {
  position: fixed;
  top: 0; right: 0; bottom: 0;
  width: 360px;
  background: var(--surface);
  border-left: 1px solid var(--border2);
  z-index: 301;
  overflow-y: auto;
  padding: 32px 28px;
}
.toggle {
  width: 36px; height: 20px;
  background: var(--dim);
  border-radius: 10px;
  position: relative;
  cursor: pointer;
  transition: background 0.2s;
  flex-shrink: 0;
  border: none;
}
.toggle.on { background: var(--accent); }
.toggle::after {
  content: '';
  position: absolute;
  top: 3px; left: 3px;
  width: 14px; height: 14px;
  border-radius: 50%;
  background: white;
  transition: transform 0.2s;
}
.toggle.on::after { transform: translateX(16px); }
.day-card {
  border: 1px solid var(--border);
  transition: border-color 0.15s;
}
.day-card:has(.day-body:not(.hidden)) { border-color: var(--border2); }
.day-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  cursor: pointer;
  user-select: none;
}
.day-body {
  padding: 0 14px 14px;
  border-top: 1px solid var(--border);
}
.mood-pill {
  padding: 3px 10px;
  font-size: 10px;
  letter-spacing: 0.06em;
  border: 1px solid var(--border2);
  cursor: pointer;
  transition: all 0.15s;
  background: transparent;
  color: var(--sub);
  border-radius: 2px;
}
.mood-pill.active {
  background: var(--accent);
  border-color: var(--accent);
  color: var(--bg);
  font-weight: 500;
}
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}
.fade-up { animation: fadeUp 0.35s ease forwards; }
@keyframes slideIn {
  from { transform: translateX(100%); }
  to   { transform: translateX(0); }
}
.slide-in { animation: slideIn 0.25s ease forwards; }
```

### `frontend/src/main.jsx`

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
```

### `frontend/src/pages/AnalyticsPage.jsx`

```jsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../store/auth.jsx';
import { api } from '../utils/api.js';
export default function AnalyticsPage() {
  const { user } = useAuth();
  const [overview, setOverview] = useState(null);
  const [trend, setTrend] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    Promise.all([api.getOverview(), api.getMoodTrend()])
      .then(([ov, tr]) => { setOverview(ov); setTrend(tr.trend || []); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);
  const pct = ((user.weeksLived / user.totalWeeks) * 100).toFixed(2);
  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 36px', minHeight: 'calc(100vh - 52px)' }}>
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <div className="label" style={{ marginBottom: '6px' }}>insights</div>
        <div className="serif" style={{ fontSize: '2.8rem', color: 'var(--text)', marginBottom: '40px' }}>
          your time
        </div>
      </motion.div>
      {}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
        style={{ marginBottom: '48px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span className="label">life elapsed</span>
          <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: '12px', color: 'var(--accent)' }}>
            {pct}%
          </span>
        </div>
        <div style={{ height: '1px', background: 'var(--border)', position: 'relative', width: '100%' }}>
          <motion.div
            initial={{ width: 0 }} animate={{ width: `${pct}%` }}
            transition={{ delay: 0.5, duration: 1.5, ease: 'easeOut' }}
            style={{ position: 'absolute', top: 0, left: 0, height: '100%', background: 'var(--accent)' }}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
          <span className="label" style={{ fontSize: '9px' }}>birth</span>
          <span className="label" style={{ fontSize: '9px' }}>{user.expectedLifespan} years</span>
        </div>
      </motion.div>
      {loading ? (
        <div className="label" style={{ padding: '20px 0' }}>loading...</div>
      ) : (
        <>
          {}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1px', background: 'var(--border)', marginBottom: '48px',
          }}>
            {[
              { label: 'weeks logged', value: overview?.totalLogged || 0 },
              { label: 'avg mood', value: overview?.avgMood ? `${overview.avgMood}/5` : '—' },
              { label: 'avg meaningful', value: overview?.avgMeaningful ? `${overview.avgMeaningful}/10` : '—' },
              { label: 'avg wasted', value: overview?.avgWasted ? `${overview.avgWasted}/10` : '—' },
            ].map(s => (
              <div key={s.label} style={{ background: 'var(--surface)', padding: '20px 22px' }}>
                <div className="label" style={{ marginBottom: '8px' }}>{s.label}</div>
                <div className="serif" style={{ fontSize: '2rem', color: 'var(--text)' }}>{s.value}</div>
              </div>
            ))}
          </div>
          {}
          {trend.length > 1 && (
            <div style={{ marginBottom: '48px' }}>
              <div className="label" style={{ marginBottom: '16px', paddingBottom: '10px', borderBottom: '1px solid var(--border)' }}>
                mood over time
              </div>
              <MoodChart data={trend} />
            </div>
          )}
          {}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', paddingTop: '32px', borderTop: '1px solid var(--border)' }}>
            {[
              { label: 'weeks behind you', val: user.weeksLived, note: 'each a world of its own' },
              { label: 'weeks ahead', val: user.remainingWeeks, note: 'still unwritten' },
            ].map(s => (
              <div key={s.label}>
                <div className="label" style={{ marginBottom: '8px' }}>{s.label}</div>
                <div className="serif" style={{ fontSize: '3rem', color: 'var(--accent)', lineHeight: 1, marginBottom: '6px' }}>
                  {s.val.toLocaleString()}
                </div>
                <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '11px', color: 'var(--dim)', fontStyle: 'italic' }}>
                  {s.note}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
function MoodChart({ data }) {
  const W = 800, H = 140;
  const pad = { l: 24, r: 24, t: 12, b: 24 };
  const cw = W - pad.l - pad.r;
  const ch = H - pad.t - pad.b;
  const pts = data.map((d, i) => ({
    x: pad.l + (i / Math.max(data.length - 1, 1)) * cw,
    y: pad.t + ch - ((d.avgMood - 1) / 4) * ch,
    ...d,
  }));
  const linePath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  const areaPath = [
    `M${pts[0].x},${pad.t + ch}`,
    linePath.replace('M', 'L'),
    `L${pts[pts.length - 1].x},${pad.t + ch}`,
    'Z',
  ].join(' ');
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', minWidth: '400px', display: 'block' }}>
        <defs>
          <linearGradient id="moodGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.18" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {}
        {[1,2,3,4,5].map(v => {
          const y = pad.t + ch - ((v - 1) / 4) * ch;
          return (
            <g key={v}>
              <line x1={pad.l} y1={y} x2={W - pad.r} y2={y}
                stroke="var(--border)" strokeWidth="1" />
              <text x={pad.l - 4} y={y + 3} textAnchor="end"
                style={{ fontFamily: "'Geist Mono', monospace", fontSize: '8px', fill: 'var(--dim)' }}>
                {v}
              </text>
            </g>
          );
        })}
        {}
        <path d={areaPath} fill="url(#moodGrad)" />
        {}
        <path d={linePath} fill="none" stroke="var(--accent)" strokeWidth="1.5" />
        {}
        {pts.filter((_, i) => i % Math.max(1, Math.floor(pts.length / 30)) === 0).map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="2.5" fill="var(--accent)" />
        ))}
        {}
        {[0, Math.floor(data.length / 2), data.length - 1].map(idx => {
          const p = pts[idx];
          if (!p) return null;
          return (
            <text key={idx} x={p.x} y={H - 4} textAnchor="middle"
              style={{ fontFamily: "'Geist Mono', monospace", fontSize: '8px', fill: 'var(--dim)' }}>
              wk {data[idx].weekNumber}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
```

### `frontend/src/pages/AuthPage.jsx`

```jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../store/auth.jsx';
export default function AuthPage() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '', dob: '', expectedLifespan: 90 });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));
  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      mode === 'login' ? await login(form.email, form.password) : await register(form);
      navigate('/grid');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{ width: '100%', maxWidth: '360px' }}>
        {}
        <Link to="/" style={{ textDecoration: 'none' }}>
          <div className="serif" style={{
            fontSize: '2rem', color: 'var(--text)', textAlign: 'center',
            marginBottom: '48px', cursor: 'pointer',
          }}>weeks</div>
        </Link>
        {}
        <div style={{
          display: 'flex', marginBottom: '32px',
          borderBottom: '1px solid var(--border)',
        }}>
          {['login', 'register'].map(m => (
            <button key={m} onClick={() => setMode(m)} style={{
              flex: 1, paddingBottom: '10px', background: 'none', border: 'none',
              cursor: 'pointer', fontFamily: "'Geist Mono', monospace",
              fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase',
              color: mode === m ? 'var(--text)' : 'var(--sub)',
              borderBottom: `2px solid ${mode === m ? 'var(--accent)' : 'transparent'}`,
              transition: 'all 0.15s', marginBottom: '-1px',
            }}>
              {m}
            </button>
          ))}
        </div>
        <form onSubmit={submit}>
          <AnimatePresence mode="wait">
            <motion.div key={mode}
              initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }} transition={{ duration: 0.18 }}>
              {mode === 'register' && (
                <Field label="name">
                  <input value={form.name} onChange={set('name')} required
                    placeholder="your name" />
                </Field>
              )}
              <Field label="email">
                <input type="email" value={form.email} onChange={set('email')} required
                  placeholder="you@example.com" />
              </Field>
              <Field label="password">
                <input type="password" value={form.password} onChange={set('password')} required
                  placeholder="••••••••" />
              </Field>
              {mode === 'register' && (
                <>
                  <Field label="date of birth">
                    <input type="date" value={form.dob} onChange={set('dob')} required
                      style={{ colorScheme: 'dark', color: 'var(--text)', width: '100%', fontSize: '13px' }} />
                  </Field>
                  <Field label="expected lifespan (years)">
                    <input type="number" value={form.expectedLifespan} onChange={set('expectedLifespan')}
                      min="50" max="130" style={{ width: '100%', color: 'var(--text)', fontSize: '13px' }} />
                  </Field>
                </>
              )}
            </motion.div>
          </AnimatePresence>
          {error && (
            <div style={{
              marginTop: '16px', padding: '10px 14px',
              background: 'rgba(201,169,110,0.06)',
              border: '1px solid rgba(201,169,110,0.2)',
              fontFamily: "'Geist Mono', monospace", fontSize: '11px',
              color: 'var(--accent)',
            }}>
              {error}
            </div>
          )}
          <button type="submit" disabled={loading} className="btn btn-primary"
            style={{ width: '100%', marginTop: '24px', padding: '10px', justifyContent: 'center', fontSize: '12px' }}>
            {loading
              ? <span style={{ opacity: 0.6 }}>...</span>
              : mode === 'login' ? 'enter →' : 'begin →'}
          </button>
        </form>
        <div style={{
          marginTop: '24px', textAlign: 'center',
          fontFamily: "'Geist Mono', monospace", fontSize: '11px', color: 'var(--sub)',
        }}>
          {mode === 'login' ? "no account? " : "have an account? "}
          <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--accent)', fontFamily: 'inherit', fontSize: 'inherit',
          }}>
            {mode === 'login' ? 'register' : 'login'}
          </button>
        </div>
      </div>
    </div>
  );
}
function Field({ label, children }) {
  return (
    <div style={{ marginBottom: '18px' }}>
      <div className="field-label">{label}</div>
      <div className="field">{children}</div>
    </div>
  );
}
```

### `frontend/src/pages/GridPage.jsx`

```jsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store/auth.jsx';
import { useSettings } from '../store/settings.jsx';
import { api } from '../utils/api.js';
import LifespanGrid from '../components/grid/LifespanGrid.jsx';
export default function GridPage() {
  const { user } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();
  const [weeksData, setWeeksData] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    Promise.all([api.getWeeks(), api.getMilestones()])
      .then(([wd, ms]) => {
        setWeeksData(wd.weeks || []);
        setMilestones(ms.milestones || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);
  const scrollToCurrent = () => {
    document.querySelector('.cell.current')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };
  const pct = ((user.weeksLived / user.totalWeeks) * 100).toFixed(1);
  return (
    <div style={{ padding: '36px 40px', minHeight: 'calc(100vh - 52px)' }}>
      {}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '28px' }}>
        <div>
          <div className="serif" style={{ fontSize: '2rem', color: 'var(--text)', marginBottom: '4px' }}>
            {user.name}
          </div>
          <div className="label">
            week {user.currentWeek} · {new Date().getFullYear()}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={scrollToCurrent} className="btn" style={{ fontSize: '11px' }}>
            jump to now
          </button>
          <button onClick={() => navigate(`/week/${user.currentWeek}`)} className="btn btn-primary">
            this week →
          </button>
        </div>
      </motion.div>
      {}
      {settings.showStats && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{
            display: 'flex', gap: '32px', marginBottom: '28px',
            padding: '18px 24px', background: 'var(--surface)',
            border: '1px solid var(--border)', flexWrap: 'wrap',
          }}>
          {[
            { label: 'weeks lived', value: user.weeksLived.toLocaleString() },
            { label: 'weeks remaining', value: user.remainingWeeks.toLocaleString() },
            { label: 'total weeks', value: user.totalWeeks.toLocaleString() },
            { label: 'elapsed', value: `${pct}%` },
          ].map(s => (
            <div key={s.label}>
              <div className="label" style={{ marginBottom: '4px' }}>{s.label}</div>
              <div className="value-big">{s.value}</div>
            </div>
          ))}
        </motion.div>
      )}
      {}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <Legend color="var(--lived)" label="lived" />
        <Legend color="transparent" border="var(--border)" label="future" />
        <Legend color="var(--accent2)" label="current week" pulse />
        {settings.showBirthday && <Legend color="#8b5cf6" label="birthday week" />}
      </div>
      {}
      {loading ? (
        <div className="label" style={{ padding: '40px 0' }}>
          <span style={{ animation: 'pulse 1.5s infinite' }}>loading...</span>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.6 }}>
          <LifespanGrid user={user} weeksData={weeksData} milestones={milestones} />
        </motion.div>
      )}
      <div style={{ marginTop: '48px', paddingTop: '20px', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
        <span className="label">hover any week to preview · click to reflect</span>
      </div>
    </div>
  );
}
function Legend({ color, border, label, pulse }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
      <div style={{
        width: 11, height: 11, flexShrink: 0,
        background: color,
        border: `1px solid ${border || color}`,
        animation: pulse ? 'cellPulse 2.5s ease-in-out infinite' : 'none',
      }} />
      <span className="label" style={{ textTransform: 'none', letterSpacing: '0.04em', fontSize: '11px' }}>{label}</span>
    </div>
  );
}
```

### `frontend/src/pages/LandingPage.jsx`

```jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
const TOTAL = 4680;
const LIVED = 1456;
const CURRENT = 1457;
export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      {}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 40px', height: '56px',
        borderBottom: '1px solid var(--border)',
      }}>
        <span className="serif" style={{ fontSize: '18px', color: 'var(--text)' }}>weeks</span>
        <Link to="/auth" style={{
          fontFamily: "'Geist Mono', monospace", fontSize: '11px',
          letterSpacing: '0.1em', color: 'var(--sub)', textDecoration: 'none',
          transition: 'color 0.15s',
        }}>
          enter →
        </Link>
      </nav>
      {}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '60px 40px',
      }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', maxWidth: '480px', marginBottom: '56px' }}
        >
          <h1 className="serif" style={{
            fontSize: 'clamp(2.4rem, 5vw, 4rem)',
            color: 'var(--text)', lineHeight: 1.15,
            marginBottom: '20px', fontWeight: 400,
          }}>
            your life<br /><em style={{ color: 'var(--accent)' }}>in weeks</em>
          </h1>
          <p style={{
            fontFamily: "'Geist Mono', monospace",
            fontSize: '12px', color: 'var(--sub)',
            lineHeight: 1.8, letterSpacing: '0.02em',
          }}>
            {TOTAL.toLocaleString()} squares.<br />
            each one, a week of your life.<br />
            finite. real. yours.
          </p>
        </motion.div>
        {}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          style={{ marginBottom: '48px' }}
        >
          <DemoGrid />
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
          <Link to="/auth">
            <button className="btn btn-primary" style={{ padding: '10px 28px', fontSize: '12px', letterSpacing: '0.1em' }}>
              begin →
            </button>
          </Link>
        </motion.div>
      </div>
      <div style={{ textAlign: 'center', padding: '20px', borderTop: '1px solid var(--border)' }}>
        <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: '10px', color: 'var(--dim)', fontStyle: 'italic' }}>
          "the unexamined life is not worth living." — socrates
        </span>
      </div>
    </div>
  );
}
function DemoGrid() {
  const years = 90;
  const cols = 52;
  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {Array.from({ length: years }, (_, yr) => (
          <div key={yr} style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
            {Array.from({ length: cols }, (_, wi) => {
              const wn = yr * cols + wi + 1;
              const isPast = wn < CURRENT;
              const isCurrent = wn === CURRENT;
              return (
                <div key={wi} style={{
                  width: 8, height: 8, flexShrink: 0,
                  background: isCurrent ? 'var(--accent2)' : isPast ? 'var(--accent)' : 'var(--future)',
                  border: `1px solid ${isCurrent ? 'var(--accent2)' : isPast ? 'var(--accent)' : 'var(--border)'}`,
                  opacity: isPast ? 0.7 : 1,
                  animation: isCurrent ? 'cellPulse 2.5s ease-in-out infinite' : 'none',
                }} />
              );
            })}
            {yr % 10 === 0 && (
              <span style={{
                fontFamily: "'Geist Mono', monospace", fontSize: '9px',
                color: 'var(--dim)', marginLeft: '8px', flexShrink: 0,
              }}>
                {yr + 1}
              </span>
            )}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '20px', marginTop: '14px', alignItems: 'center' }}>
        <LegItem color="var(--accent)" label="lived" />
        <LegItem color="var(--future)" border="var(--border)" label="remaining" />
        <LegItem color="var(--accent2)" label="now" />
      </div>
    </div>
  );
}
function LegItem({ color, border, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <div style={{ width: 8, height: 8, background: color, border: `1px solid ${border || color}`, flexShrink: 0 }} />
      <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: '10px', color: 'var(--sub)', letterSpacing: '0.06em' }}>
        {label}
      </span>
    </div>
  );
}
```

### `frontend/src/pages/WeekPage.jsx`

```jsx
import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../store/auth.jsx';
import { api } from '../utils/api.js';
import { formatDate, getAgeAtWeek, getWeekDates } from '../utils/dates.js';
import MilestonePanel from '../components/week/MilestonePanel.jsx';
import WeeklyReflection from '../components/week/WeeklyReflection.jsx';
import DayLogPanel from '../components/week/DayLogPanel.jsx';
const DAY_SHORT  = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const DAY_FULL   = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
const MOOD_COLORS = { 1:'#7c3d3d', 2:'#7a6030', 3:'#3d5068', 4:'#2d5c42', 5:'#c9a96e' };
function buildDays(startDate, existing = []) {
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(new Date(startDate).getTime() + i * 86400000);
    const found = existing[i] || {};
    return {
      date,
      dayOfWeek: DAY_SHORT[i],
      notes: found.notes || '',
      mood: found.mood || null,
      meaningfulActivity: found.meaningfulActivity || '',
      wastedTime: found.wastedTime || '',
      tags: found.tags || [],
    };
  });
}
export default function WeekPage() {
  const { weekNumber: wn } = useParams();
  const weekNumber = parseInt(wn);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [week, setWeek]               = useState(null);
  const [days, setDays]               = useState([]);   
  const [loading, setLoading]         = useState(true);
  const [saving, setSaving]           = useState(false);
  const [saved, setSaved]             = useState(false);
  const [milestones, setMilestones]   = useState([]);
  const [openDayIdx, setOpenDayIdx]   = useState(null);
  const [showReflection, setShowReflection] = useState(false);
  const { startDate, endDate } = getWeekDates(user.dob, weekNumber);
  const age        = getAgeAtWeek(user.dob, weekNumber);
  const isCurrent  = weekNumber === user.currentWeek;
  const isFuture   = weekNumber > user.currentWeek;
  const calYear    = new Date(startDate).getFullYear();
  const todayIdx   = isCurrent ? (new Date().getDay() + 6) % 7 : null;
  useEffect(() => {
    setLoading(true);
    setOpenDayIdx(isCurrent ? (new Date().getDay() + 6) % 7 : null);
    setShowReflection(false);
    Promise.all([api.getWeek(weekNumber), api.getMilestones()])
      .then(([{ week: w }, { milestones: ms }]) => {
        setWeek(w);
        setDays(buildDays(startDate, w?.days || []));
        setMilestones(ms || []);
      })
      .catch(err => {
        setDays(buildDays(startDate, []));
      })
      .finally(() => setLoading(false));
  }, [weekNumber]);
  const handleDayChange = useCallback(async (dayIndex, changes) => {
    setDays(prev => {
      const next = [...prev];
      next[dayIndex] = { ...next[dayIndex], ...changes };
      return next;
    });
    try { await api.saveDay(weekNumber, dayIndex, changes); }
    catch (err) { console.error(err); }
  }, [weekNumber]);
  const handleReflectionChange = useCallback((key, value) => {
    setWeek(prev => ({ ...prev, [key]: value }));
  }, []);
  const saveWeek = async () => {
    setSaving(true);
    try {
      const payload = {
        summary:        week?.summary        || '',
        meaningfulScore:week?.meaningfulScore ?? null,
        wastedScore:    week?.wastedScore     ?? null,
        matteredMost:   week?.matteredMost    || '',
        drainedEnergy:  week?.drainedEnergy   || '',
        intentional:    week?.intentional     ?? null,
        changeNextWeek: week?.changeNextWeek  || '',
        days: days.map(d => ({
          date:               d.date,
          dayOfWeek:          d.dayOfWeek,
          notes:              d.notes              || '',
          mood:               d.mood               || null,
          meaningfulActivity: d.meaningfulActivity || '',
          wastedTime:         d.wastedTime         || '',
          tags:               d.tags               || [],
        })),
      };
      const { week: w } = await api.saveWeek(weekNumber, payload);
      setWeek(w);
      setDays(buildDays(startDate, w?.days || []));
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
    }
    setSaving(false);
  };
  const refreshMilestones = async () => {
    const { milestones } = await api.getMilestones();
    setMilestones(milestones);
  };
  if (loading) return (
    <div style={{ minHeight: 'calc(100vh - 52px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span className="label">loading...</span>
    </div>
  );
  const loggedDays  = days.filter(d => d.mood || d.notes || d.meaningfulActivity);
  const moodVals    = days.filter(d => d.mood).map(d => d.mood);
  const avgMood     = moodVals.length ? (moodVals.reduce((a,b) => a+b,0) / moodVals.length).toFixed(1) : null;
  return (
    <div style={{ minHeight: 'calc(100vh - 52px)', background: 'var(--bg)' }}>
      <div style={{ maxWidth: '820px', margin: '0 auto', padding: '32px 28px' }}>
        {}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'28px' }}>
          <Link to="/grid" style={{ fontFamily:"'Geist Mono',monospace", fontSize:'11px', color:'var(--sub)', textDecoration:'none', letterSpacing:'0.06em' }}>
            ← grid
          </Link>
          <div style={{ display:'flex', gap:'6px' }}>
            <button onClick={() => navigate(`/week/${weekNumber-1}`)} disabled={weekNumber<=1} className="btn" style={{ padding:'5px 12px' }}>←</button>
            <button onClick={() => navigate(`/week/${weekNumber+1}`)} disabled={weekNumber>=user.totalWeeks} className="btn" style={{ padding:'5px 12px' }}>→</button>
          </div>
        </div>
        {}
        <motion.div initial={{ opacity:0, y:-6 }} animate={{ opacity:1, y:0 }} style={{ marginBottom:'36px' }}>
          <div className="label" style={{ marginBottom:'6px', display:'flex', gap:'10px', alignItems:'center' }}>
            <span>week {weekNumber}</span>
            <span style={{ color:'var(--dim)' }}>·</span>
            <span>{calYear}</span>
            {isCurrent && <span style={{ color:'var(--accent)' }}>· now</span>}
            {isFuture  && <span style={{ color:'var(--dim)', fontStyle:'italic' }}>· upcoming</span>}
          </div>
          <div className="serif" style={{ fontSize:'2.8rem', color:'var(--text)', lineHeight:1, marginBottom:'6px' }}>
            age {age}
          </div>
          <div style={{ fontFamily:"'Geist Mono',monospace", fontSize:'12px', color:'var(--sub)' }}>
            {formatDate(startDate)} — {formatDate(endDate)}
          </div>
        </motion.div>
        {}
        <div style={{ marginBottom:'0' }}>
          <div className="label" style={{ marginBottom:'14px' }}>days — click to log</div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:'6px' }}>
            {days.map((day, i) => {
              const date     = new Date(day.date);
              const hasLog   = day.mood || day.notes || day.meaningfulActivity;
              const isToday  = i === todayIdx;
              const isOpen   = openDayIdx === i;
              return (
                <motion.button
                  key={i}
                  onClick={() => setOpenDayIdx(isOpen ? null : i)}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.96 }}
                  style={{
                    background: isOpen ? 'rgba(201,169,110,0.08)' : 'var(--surface)',
                    border: `1px solid ${isOpen ? 'var(--accent)' : isToday ? 'rgba(201,169,110,0.35)' : 'var(--border)'}`,
                    borderBottom: isOpen ? '1px solid var(--surface)' : `1px solid ${isToday ? 'rgba(201,169,110,0.35)' : 'var(--border)'}`,
                    padding: '14px 8px 12px',
                    cursor: 'pointer',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '7px',
                    transition: 'border-color 0.15s, background 0.15s',
                    position: 'relative',
                    zIndex: isOpen ? 2 : 1,
                  }}
                >
                  {}
                  {isToday && !isOpen && (
                    <div style={{
                      position:'absolute', top:'5px', right:'5px',
                      width:'5px', height:'5px', borderRadius:'50%',
                      background:'var(--accent)',
                      animation:'cellPulse 2.5s ease-in-out infinite',
                    }} />
                  )}
                  {}
                  <span style={{
                    fontFamily:"'Geist Mono',monospace", fontSize:'9px',
                    letterSpacing:'0.12em', textTransform:'uppercase',
                    color: isOpen ? 'var(--accent)' : isToday ? 'var(--accent)' : 'var(--sub)',
                  }}>
                    {DAY_SHORT[i]}
                  </span>
                  {}
                  <span className="serif" style={{
                    fontSize: '1.8rem', lineHeight: 1,
                    color: isOpen ? 'var(--accent)' : hasLog ? 'var(--text)' : isToday ? 'var(--text)' : 'var(--sub)',
                    fontWeight: 400,
                  }}>
                    {date.getDate()}
                  </span>
                  {}
                  <span style={{
                    fontFamily:"'Geist Mono',monospace", fontSize:'9px',
                    color:'var(--dim)', letterSpacing:'0.06em',
                  }}>
                    {date.toLocaleDateString('en-US',{ month:'short' }).toUpperCase()}
                  </span>
                  {}
                  <div style={{ width:'100%', height:'3px', borderRadius:'2px', marginTop:'2px',
                    background: day.mood ? MOOD_COLORS[day.mood] : hasLog ? 'var(--dim)' : 'var(--border)',
                    opacity: day.mood || hasLog ? 1 : 0.4,
                  }} />
                </motion.button>
              );
            })}
          </div>
          {}
          <AnimatePresence mode="wait">
            {openDayIdx !== null && (
              <motion.div
                key={openDayIdx}
                initial={{ opacity:0, y:-4 }}
                animate={{ opacity:1, y:0 }}
                exit={{ opacity:0, y:-4 }}
                transition={{ duration:0.18 }}
              >
                <DayLogPanel
                  day={days[openDayIdx]}
                  dayIndex={openDayIdx}
                  dayName={DAY_FULL[openDayIdx]}
                  date={new Date(days[openDayIdx].date)}
                  onChange={handleDayChange}
                  onClose={() => setOpenDayIdx(null)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {}
        <div style={{ marginTop:'32px', marginBottom:'12px', padding:'20px 20px', background:'var(--surface)', border:'1px solid var(--border)' }}>
          <div className="field-label" style={{ marginBottom:'8px' }}>week summary</div>
          <textarea
            value={week?.summary || ''}
            onChange={e => setWeek(prev => ({ ...prev, summary: e.target.value }))}
            placeholder="in a sentence, what defined this week..."
            style={{
              width:'100%', minHeight:'44px', resize:'none',
              fontSize:'13px', color:'var(--text)', lineHeight:'1.7',
              background:'transparent', border:'none', outline:'none',
              fontFamily:"'Geist Mono',monospace",
            }}
          />
        </div>
        {}
        {loggedDays.length > 0 && (
          <div style={{ display:'flex', gap:'1px', background:'var(--border)', marginBottom:'12px' }}>
            {[
              { label:'days logged',  value:`${loggedDays.length}/7` },
              avgMood && { label:'avg mood', value:`${avgMood}/5`, accent:true },
              week?.meaningfulScore != null && { label:'meaningful', value:`${week.meaningfulScore}/10` },
              week?.wastedScore     != null && { label:'wasted',     value:`${week.wastedScore}/10` },
            ].filter(Boolean).map(s => (
              <div key={s.label} style={{ flex:1, background:'var(--surface)', padding:'12px 14px' }}>
                <div className="label" style={{ marginBottom:'4px' }}>{s.label}</div>
                <div className="serif" style={{ fontSize:'1.3rem', color: s.accent ? 'var(--accent)' : 'var(--text)' }}>{s.value}</div>
              </div>
            ))}
          </div>
        )}
        {}
        <button onClick={() => setShowReflection(r => !r)} className="btn"
          style={{ width:'100%', justifyContent:'space-between', padding:'12px 16px', marginBottom:'0' }}>
          <span>weekly reflection</span>
          <span style={{ color:'var(--dim)', fontSize:'11px' }}>{showReflection ? '↑' : '↓'}</span>
        </button>
        <AnimatePresence>
          {showReflection && (
            <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }} exit={{ opacity:0, height:0 }} style={{ overflow:'hidden', marginBottom:'12px' }}>
              <div style={{ padding:'22px 20px', background:'var(--surface)', border:'1px solid var(--border)', borderTop:'none' }}>
                <WeeklyReflection data={week || {}} onChange={handleReflectionChange} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {}
        <div style={{ marginTop:'12px', marginBottom:'28px' }}>
          <div style={{ padding:'18px 20px', background:'var(--surface)', border:'1px solid var(--border)' }}>
            <MilestonePanel weekNumber={weekNumber} milestones={milestones} onUpdate={refreshMilestones} />
          </div>
        </div>
        {}
        <div style={{ display:'flex', alignItems:'center', gap:'14px' }}>
          <button onClick={saveWeek} disabled={saving} className="btn btn-primary">
            {saving ? 'saving...' : saved ? '✓ saved' : 'save week'}
          </button>
          {saved && <span className="label" style={{ color:'var(--accent)' }}>saved</span>}
        </div>
      </div>
    </div>
  );
}
```

### `frontend/src/store/auth.jsx`

```jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../utils/api.js';
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api.me()
      .then(({ user }) => setUser(user))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);
  const login = async (email, password) => {
    const { user } = await api.login({ email, password });
    setUser(user);
    return user;
  };
  const register = async (data) => {
    const { user } = await api.register(data);
    setUser(user);
    return user;
  };
  const logout = async () => {
    await api.logout().catch(() => {});
    setUser(null);
  };
  const refreshUser = async () => {
    const { user } = await api.me();
    setUser(user);
  };
  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}
export const useAuth = () => useContext(AuthContext);
```

### `frontend/src/store/settings.jsx`

```jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
const DEFAULTS = {
  showStats: false,
  showBirthday: true,
  showMilestones: true,
  showYearLabels: true,
  showMonthMarkers: false,
  highlightLogged: true,
};
const SettingsContext = createContext(null);
export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('weeks_settings');
      return saved ? { ...DEFAULTS, ...JSON.parse(saved) } : DEFAULTS;
    } catch { return DEFAULTS; }
  });
  useEffect(() => {
    localStorage.setItem('weeks_settings', JSON.stringify(settings));
  }, [settings]);
  const toggle = (key) => setSettings(s => ({ ...s, [key]: !s[key] }));
  const set = (key, val) => setSettings(s => ({ ...s, [key]: val }));
  return (
    <SettingsContext.Provider value={{ settings, toggle, set }}>
      {children}
    </SettingsContext.Provider>
  );
}
export const useSettings = () => useContext(SettingsContext);
```

### `frontend/src/utils/api.js`

```js
const BASE = import.meta.env.VITE_API_URL || '/api';
async function request(path, options = {}) {
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };
  const finalHeaders = { ...defaultHeaders, ...(options.headers || {}) };
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: finalHeaders,
    credentials: options.credentials ?? 'include',
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || `Request failed (${res.status})`);
  }
  return data;
}
export const api = {
  register:      (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login:         (body) => request('/auth/login',    { method: 'POST', body: JSON.stringify(body) }),
  me:            ()     => request('/auth/me'),
  updateProfile: (body) => request('/auth/me',       { method: 'PATCH', body: JSON.stringify(body) }),
  logout:        ()     => request('/auth/logout',   { method: 'POST' }),
  getWeeks:   ()        => request('/weeks'),
  getWeek:    (n)       => request(`/weeks/${n}`),
  saveWeek:   (n, body) => request(`/weeks/${n}`,          { method: 'POST',  body: JSON.stringify(body) }),
  saveDay:    (n, i, b) => request(`/weeks/${n}/day/${i}`, { method: 'PATCH', body: JSON.stringify(b) }),
  searchWeeks:(q)       => request(`/weeks/search/query?q=${encodeURIComponent(q)}`),
  getMilestones:   ()     => request('/milestones'),
  createMilestone: (body) => request('/milestones',     { method: 'POST',   body: JSON.stringify(body) }),
  deleteMilestone: (id)   => request(`/milestones/${id}`, { method: 'DELETE' }),
  getOverview:  () => request('/analytics/overview'),
  getMoodTrend: () => request('/analytics/mood-trend'),
};
```

### `frontend/src/utils/dates.js`

```js
export const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;
export const MS_PER_DAY  = 24 * 60 * 60 * 1000;
function getMondayOf(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  const diff = (day === 0) ? -6 : 1 - day; 
  d.setDate(d.getDate() + diff);
  return d;
}
function getEpoch(dob) {
  return getMondayOf(new Date(dob));
}
export function getWeekDates(dob, weekNumber) {
  const epoch = getEpoch(dob);
  const startDate = new Date(epoch.getTime() + (weekNumber - 1) * MS_PER_WEEK);
  const endDate   = new Date(startDate.getTime() + 6 * MS_PER_DAY);
  return { startDate, endDate };
}
export function getWeeksLived(dob) {
  const epoch = getEpoch(dob);
  const now   = new Date();
  now.setHours(0, 0, 0, 0);
  return Math.floor((now - epoch) / MS_PER_WEEK);
}
export function getCurrentWeek(dob) {
  return getWeeksLived(dob) + 1;
}
export function getAgeAtWeek(dob, weekNumber) {
  const { startDate } = getWeekDates(dob, weekNumber);
  const dobDate = new Date(dob);
  const years = (startDate - dobDate) / (365.25 * MS_PER_DAY);
  return Math.floor(years);
}
export function getYearFromWeek(weekNumber) {
  return Math.ceil(weekNumber / 52);
}
export function formatDate(date) {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}
export function formatShortDate(date) {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
```

### `frontend/tailwind.config.js`

```js
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0d0d0f',
        surface: '#161618',
        border: '#252528',
        border2: '#303035',
        text: '#e8e6e1',
        sub: '#7a7880',
        dim: '#3a3840',
        accent: '#c9a96e',
        accent2: '#e8c98a',
      },
    },
  },
  plugins: [],
};
```

### `frontend/vite.config.js`

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        cookieDomainRewrite: 'localhost',
      },
    },
  },
});
```

### `package.json`

```json
{
  "name": "weeks",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "install:all": "cd backend && npm install && cd ../frontend && npm install",
    "dev:backend": "cd backend && npm run dev",
    "dev:frontend": "cd frontend && npm run dev",
    "build": "cd frontend && npm run build",
    "start": "cd backend && npm start"
  }
}
```

---

*End of context. You now have full visibility into this project.*
