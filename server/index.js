import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import healthRoutes from './routes/healthRoutes.js';
import stayRoutes from './routes/stayRoutes.js';
import authRoutes from './routes/authRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// 1. Load environment variables from .env
dotenv.config();

// 2. Initialize database connection
connectDB();

// 3. Initialize Express application
const app = express();

// 4. Configure CORS to permit the Vite frontend origin (default: http://localhost:3000)
const allowedOrigin = process.env.CLIENT_URL || 'http://localhost:3000';
app.use(cors({
  origin: allowedOrigin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 5. Configure JSON and URL-encoded request body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root welcome route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Veloura Luxury Resort & Residences API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health'
    }
  });
});

// 6. Mount API Routes
app.use('/api/health', healthRoutes);
app.use('/api/stays', stayRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);

// 7. Centralized Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

// 8. Start server listener on configured port (process.env.PORT || 5000)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🌿 Veloura API server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`🔗 Local endpoint: http://localhost:${PORT}`);
  console.log(`🔗 Health check:  http://localhost:${PORT}/api/health`);
});

export default app;

