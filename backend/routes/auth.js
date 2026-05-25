import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'weeks-secret-key';
const COOKIE_NAME = 'weeks_token';
const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  maxAge: 30 * 24 * 60 * 60 * 1000,
  path: '/',
};

const makeToken = (userId) => jwt.sign({ userId }, JWT_SECRET, { expiresIn: '30d' });
const setAuthCookie = (res, token) => res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS);

// Register
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

// Login
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

// Logout
router.post('/logout', (req, res) => {
  res.clearCookie(COOKIE_NAME, { path: '/' });
  res.json({ ok: true });
});

// Get current user
router.get('/me', authenticate, (req, res) => {
  res.json({ user: req.user.toPublic() });
});

// Update profile
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
