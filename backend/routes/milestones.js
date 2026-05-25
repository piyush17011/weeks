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
