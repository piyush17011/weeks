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

// GET /api/weeks
router.get('/', async (req, res) => {
  try {
    const weeks = await Week.find({ userId: req.user._id })
      .select('weekNumber summary meaningfulScore wastedScore days.mood')
      .lean();
    res.json({ weeks });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/weeks/:weekNumber
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

// POST /api/weeks/:weekNumber
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

// PATCH /api/weeks/:weekNumber/day/:dayIndex
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

// GET /api/weeks/search/query
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