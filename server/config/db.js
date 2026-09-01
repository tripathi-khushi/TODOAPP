import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoMemoryServer = null;

export const connectDB = async () => {
  const primaryUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/smartech_todo';

  try {
    console.log(`Connecting to MongoDB at: ${primaryUri}...`);
    await mongoose.connect(primaryUri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log('Successfully connected to standalone MongoDB.');
  } catch (err) {
    console.warn(`Could not connect to standalone MongoDB (${err.message}).`);
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
