const mongoose = require('mongoose');
const User = require('../models/User');

const MONGO_URI = process.env.MONGO_URI;

let cachedConnection = null;

async function seedDefaults() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@bookbeacon.com';
    const adminPw = process.env.ADMIN_PASSWORD || 'BB_Admin@2026!Secure';
    const adminExists = await User.findOne({ email: adminEmail });
    if (!adminExists) {
      await User.create({ name: 'Admin', email: adminEmail, phone: '01000000000', password: adminPw, role: 'admin', isVerified: true });
      console.log('Default admin seeded');
    }
    const cashierExists = await User.findOne({ email: 'cashier@bookbeacon.com' });
    if (!cashierExists) {
      await User.create({ name: 'كاشير', email: 'cashier@bookbeacon.com', phone: '01000000001', password: 'cashier123', role: 'cashier', isVerified: true });
      console.log('Default cashier seeded');
    }
  } catch (e) {
    console.error('Seed error:', e.message);
  }
}

async function connectDB() {
  if (cachedConnection) return cachedConnection;

  if (!MONGO_URI) {
    console.error('MONGO_URI is not defined in environment variables');
    throw new Error('MONGO_URI is not defined');
  }

  try {
    const conn = await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    cachedConnection = conn;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    await seedDefaults();
    return conn;
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    throw error;
  }
}

module.exports = connectDB;
