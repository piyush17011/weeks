import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'] || '';
    const cookieToken = req.cookies?.weeks_token || '';

    const token = authHeader.startsWith('Bearer ')
      ? authHeader.slice(7).trim()
      : cookieToken;

    console.log('AUTH CHECK', {
      url: req.originalUrl,
      method: req.method,
      hasAuthHeader: !!authHeader,
      hasCookieToken: !!cookieToken,
      tokenLength: token?.length ?? 0,
      tokenPreview: token ? `${token.slice(0, 20)}...` : null,
    });

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('JWT_SECRET is not set in environment variables!');
      return res.status(500).json({ message: 'Server configuration error' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, secret);
    } catch (err) {
      console.error('JWT verification failed:', err.name, '-', err.message);
      // err.name will be one of:
      // JsonWebTokenError  → wrong secret or malformed
      // TokenExpiredError  → token expired
      // NotBeforeError     → token not yet valid
      return res.status(401).json({ message: err.message });
    }

    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('Unexpected auth error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};