import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoMemoryServer = null;

export const connectDB = async () => {
  const primaryUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/smartech_todo';
  const isCloudAtlas = primaryUri.includes('mongodb+srv') || primaryUri.includes('.mongodb.net');

  try {
    const maskedUri = primaryUri.replace(/:([^@]+)@/, ':****@');
    console.log(`Connecting to MongoDB at: ${maskedUri}...`);

    await mongoose.connect(primaryUri, {
      serverSelectionTimeoutMS: isCloudAtlas ? 10000 : 3000,
    });

    if (isCloudAtlas) {
      console.log('🎉 Successfully connected to Cloud MongoDB Atlas!');
    } else {
      console.log('✅ Successfully connected to local MongoDB.');
    }
  } catch (err) {
    if (isCloudAtlas) {
      console.error('❌ Failed to connect to MongoDB Atlas:', err.message);
      console.error('👉 Please verify in MongoDB Atlas:');
      console.error('   1. Database user password is correct in server/.env');
      console.error('   2. Network Access -> IP Access List includes 0.0.0.0/0 (Allow from anywhere)');
    } else {
      console.warn(`Could not connect to local MongoDB (${err.message}).`);
    }

    console.log('Initializing embedded MongoDB Memory Server for seamless fallback...');

    try {
      mongoMemoryServer = await MongoMemoryServer.create();
      const memoryUri = mongoMemoryServer.getUri();
      await mongoose.connect(memoryUri);
      console.log(`Connected to in-memory MongoDB at: ${memoryUri}`);
    } catch (fallbackError) {
      console.error('Fatal Error: Failed to connect to in-memory MongoDB', fallbackError);
      process.exit(1);
    }
  }

  mongoose.connection.on('error', (err) => {
    console.error('MongoDB Connection Error:', err);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected.');
  });
};

export const closeDB = async () => {
  try {
    await mongoose.disconnect();
    if (mongoMemoryServer) {
      await mongoMemoryServer.stop();
    }
  } catch (err) {
    console.error('Error closing MongoDB connection:', err);
  }
};
