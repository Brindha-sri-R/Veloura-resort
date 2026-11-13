import mongoose from 'mongoose';
import dns from 'dns';

// Ensure reliable DNS resolution for MongoDB Atlas SRV records on Windows
try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch (e) {
  // Ignore if not supported in environment
}

/**
 * Connect to MongoDB Atlas cluster using Mongoose with retry logic.
 */
const connectDB = async (retryCount = 0) => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.warn('⚠️  [Veloura DB] MONGO_URI is not defined in environment variables.');
    return;
  }

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 8000,
      connectTimeoutMS: 10000
    });
    console.log(`✅ [Veloura DB] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ [Veloura DB] MongoDB Connection Error: ${error.message}`);
    if (retryCount < 5) {
      const waitTime = Math.min(2000 * (retryCount + 1), 6000);
      console.log(`🔄 [Veloura DB] Retrying connection in ${waitTime / 1000}s (Attempt ${retryCount + 1}/5)...`);
      setTimeout(() => connectDB(retryCount + 1), waitTime);
    }
  }
};

export default connectDB;
