import mongoose from 'mongoose';
import { Student } from '../models/students.js';

export const connectionMongoDb = async () => {
  try {
    const mongoUrl = process.env.MONGODB_URL;
    await mongoose.connect(mongoUrl);
    console.log('✅ Connected to MongoDB');
    await Student.syncIndexes();
  } catch (error) {
    console.log('👎 Connection Error MongoDB', error.message);
    process.exit(1);
  }
};
