import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import healthRoutes from '../server/routes/healthRoutes.js';
import stayRoutes from '../server/routes/stayRoutes.js';
import authRoutes from '../server/routes/authRoutes.js';
import bookingRoutes from '../server/routes/bookingRoutes.js';
import { notFound, errorHandler } from '../server/middleware/errorMiddleware.js';

const app = express();

app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serverless Mongoose connection caching
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null, lastError: null };
}

const connectDB = async () => {
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    cached.lastError = 'MONGO_URI environment variable is not defined on Vercel.';
    return null;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Prevents 10-second buffering timeout when disconnected
      serverSelectionTimeoutMS: 6000,
      connectTimeoutMS: 8000
    };

    cached.promise = mongoose.connect(mongoUri, opts)
      .then((m) => {
        cached.lastError = null;
        return m;
      })
      .catch((err) => {
        cached.promise = null;
        cached.lastError = err.message;
        console.error('MongoDB Atlas connection error in Vercel function:', err.message);
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    cached.conn = null;
  }

  return cached.conn;
};

// Middleware: connect DB before handling requests
app.use(async (req, res, next) => {
  // Allow health check to run even if DB is still connecting
  if (req.path === '/api/health' || req.path === '/health') {
    await connectDB().catch(() => {});
    return next();
  }

  try {
    await connectDB();
    if (mongoose.connection.readyState !== 1) {
      const reason = !process.env.MONGO_URI
        ? 'MONGO_URI is missing in Vercel Environment Variables.'
        : cached.lastError
        ? `Database connection error: ${cached.lastError}`
        : 'Database is still establishing connection or IP is blocked by Atlas.';

      return res.status(503).json({
        success: false,
        message: `${reason} Ensure 0.0.0.0/0 is whitelisted in MongoDB Atlas Network Access.`,
        code: 'DB_DISCONNECTED'
      });
    }
  } catch (err) {
    return res.status(503).json({
      success: false,
      message: `Database connection failed: ${err.message}. Please ensure 0.0.0.0/0 is whitelisted in MongoDB Atlas.`,
      code: 'DB_CONNECTION_ERROR'
    });
  }

  next();
});

// Enhanced health route with diagnostics
app.get('/api/health', (req, res) => {
  const isConnected = mongoose.connection.readyState === 1;
  res.status(200).json({
    success: true,
    message: 'Veloura API is running',
    database: isConnected ? 'connected' : 'disconnected',
    hasMongoUri: Boolean(process.env.MONGO_URI),
    lastError: cached.lastError,
    timestamp: new Date().toISOString()
  });
});

app.use('/api/stays', stayRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
