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
