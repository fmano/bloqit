import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { loadInitialDataToDb } from './utils/db.util';
import logger from './utils/logger.util';

dotenv.config();

export const connectToDatabase = async () => {
  try {
    const dbName =
      process.env.NODE_ENV === 'test' ? 'bloqit-test' : 'bloqit-db';
    const mongoURI =
      process.env.MONGO_URI || `mongodb://127.0.0.1:27017/${dbName}`;
    await mongoose.connect(mongoURI);

    logger.info('Connected to database');

    await loadInitialDataToDb();
  } catch (error) {
    logger.error('Database connection error', error);
    process.exit(1);
  }
};
