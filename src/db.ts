import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { loadInitialDataToDb } from './utils/db.util';
import logger from './utils/logger.util';

dotenv.config();

export const connectToDatabase = async () => {
  try {
    const mongoURI =
      process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/bloqit-db';
    await mongoose.connect(mongoURI);

    logger.info('Connected to database');

    await loadInitialDataToDb();
  } catch (error) {
    logger.error('Database connection error', error);
    process.exit(1);
  }
};
