import mongoose from 'mongoose';
import { Note } from '../models/notes.js';

export const connectionMongoDb = async () => {
  try {
    const mongoUrl = process.env.MONGODB_URL;
    await mongoose.connect(mongoUrl);
    console.log('✅ Connected to MongoDB');
    await Note.syncIndexes();
  } catch (error) {
    console.log('👎 Connection Error MongoDB', error.message);
    process.exit(1);
  }
};
