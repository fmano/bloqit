import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectToDatabase = async () => {
  try {
    const mongoURI =
      process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/bloqit-db';
    await mongoose.connect(mongoURI);

    console.log('connected to db');
  } catch (error) {
    console.error('db connection error: ', error);
    process.exit(1); // TODO use json files as db alternative?
  }
};
