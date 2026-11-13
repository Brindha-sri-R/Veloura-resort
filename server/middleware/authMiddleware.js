import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Protect routes: requires a valid JWT Bearer token
 */
export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const secret = process.env.JWT_SECRET || 'veloura_jwt_secret_luxury_retreat_2026';
      const decoded = jwt.verify(token, secret);

      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        res.status(401);
        return next(new Error('User account not found'));
      }
      return next();
    } catch (error) {
      res.status(401);
      return next(new Error('Not authorized, token failed verification'));
    }
  }

  if (!token) {
    res.status(401);
    return next(new Error('Not authorized, no token provided'));
  }
};

/**
 * Optional authentication: if token is present, attach req.user,
 * otherwise proceed as anonymous guest without blocking
 */
export const optionalAuth = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const secret = process.env.JWT_SECRET || 'veloura_jwt_secret_luxury_retreat_2026';
      const decoded = jwt.verify(token, secret);
      req.user = await User.findById(decoded.id).select('-password');
    } catch (err) {
      // Ignore token decode error for optional auth
      req.user = null;
    }
  } else {
    req.user = null;
  }
  next();
};

