const mongoose = require('mongoose');
require('dotenv').config();
const User = require('../models/User');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/schoolmart';

async function verifyAdmin() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const result = await User.updateOne(
      { email: 'admin@schoolmart.in' },
      { $set: { isVerified: true } }
    );

    if (result.matchedCount > 0) {
      console.log('✅ Admin user verified successfully.');
    } else {
      console.log('❌ Admin user not found with email admin@schoolmart.in');
    }

    process.exit(0);
  } catch (err) {
    console.error('❌ Error verifying admin:', err.message);
    process.exit(1);
  }
}

verifyAdmin();
