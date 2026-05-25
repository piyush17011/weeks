import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Must call before anything else — but in ESM this still won't help
// because imports are hoisted. Use dotenv/config import instead:
dotenv.config({ path: path.join(__dirname, '.env') });

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import weekRoutes from './routes/weeks.js';
import milestoneRoutes from './routes/milestones.js';
import analyticsRoutes from './routes/analytics.js';
import cookieParser from 'cookie-parser';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cookieParser());
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/weeks', weekRoutes);
app.use('/api/milestones', milestoneRoutes);
app.use('/api/analytics', analyticsRoutes);

app.get('/api/health', (_, res) => res.json({ status: 'ok' }));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/weeks')
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    console.error('Unable to start backend without a working MongoDB connection. Please start MongoDB or set MONGO_URI.');
    process.exit(1);
  });

export default app;
