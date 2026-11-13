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

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error('MONGO_URI is not defined in environment variables.');
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 8000,
      connectTimeoutMS: 10000
    }).then(m => m);
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

// Connect to MongoDB Atlas for each incoming request
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('Database connection error in Vercel function:', error.message);
    res.status(500).json({
      success: false,
      message: `Database connection error: ${error.message}`
    });
  }
});

app.use('/api/health', healthRoutes);
app.use('/api/stays', stayRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
