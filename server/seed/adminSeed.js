import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import connectDB from '../config/mongodb.js';
import userModel from '../models/usermodel.js';

async function run() {
  try {
    await connectDB();
    const email = process.env.SEED_ADMIN_EMAIL;
    const name = process.env.SEED_ADMIN_NAME || 'Super Admin';
    const password = process.env.SEED_ADMIN_PASSWORD;
    if (!email || !password) {
      console.error('Missing SEED_ADMIN_EMAIL or SEED_ADMIN_PASSWORD');
      process.exit(1);
    }
    const existing = await userModel.findOne({ email });
    if (existing) {
      existing.role = 'admin';
      await existing.save();
      console.log('Existing user promoted to admin:', email);
    } else {
      const hashed = await bcrypt.hash(password, 10);
      await userModel.create({ name, email, password: hashed, role: 'admin' });
      console.log('Admin user created:', email);
    }
  } catch (e) {
    console.error(e);
  } finally {
    await mongoose.connection.close();
  }
}

run();


