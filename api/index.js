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

let isConnected = false;
const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState === 1) return;
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.warn('MONGO_URI is not defined in environment variables.');
    return;
  }
  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 6000,
      connectTimeoutMS: 8000
    });
    isConnected = true;
  } catch (err) {
    console.error('MongoDB connection error in Vercel function:', err.message);
  }
};

app.use(async (req, res, next) => {
  await connectDB();
  next();
});

app.use('/api/health', healthRoutes);
app.use('/api/stays', stayRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;

