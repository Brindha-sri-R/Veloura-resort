import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

/**
 * @route   GET /api/health
 * @desc    Health check endpoint reporting API and database connectivity status
 * @access  Public
 */
router.get('/', (req, res) => {
  // mongoose.connection.readyState values:
  // 0: disconnected, 1: connected, 2: connecting, 3: disconnecting
  const isDbConnected = mongoose.connection.readyState === 1;

  res.status(200).json({
    success: true,
    message: 'Veloura API is running',
    database: isDbConnected ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

export default router;

