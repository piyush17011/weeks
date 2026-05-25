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