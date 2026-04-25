const express = require('express');
const cors = require('cors');
const compression = require('compression');
require('dotenv').config();
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
const { connectDB, sequelize } = require('./config/db');

const app = express();
app.use(compression()); // Optimize response sizes

// Middleware — explicit CORS for Vercel ↔ Railway cross-origin
const allowedOrigins = [
  'https://schoolmart-ashen.vercel.app',
  'https://schoolmart.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000'
];

// Manual CORS - Hardcoded for reliability
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS,PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Accept');
  
  // Handle Preflight
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});
app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));
app.use('/api/cms', require('./routes/cmsRoutes'));
app.use('/api/settings', require('./routes/settingRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));

// Static Folders
const path = require('path');
const fs = require('fs');
const uploadDir = process.env.UPLOAD_DIR || path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
console.log('Serving uploads from:', uploadDir);
app.use('/uploads', express.static(uploadDir));

// Basic Route
app.get('/', (req, res) => {
  res.json({ 
    message: 'SchoolMart API - ACTIVE',
    version: '1.2.5',
    timestamp: '2026-04-18_17:33'
  });
});

app.get('/api/dns-test', async (req, res) => {
  const dns = require('dns');
  try {
    dns.lookup('smtp.gmail.com', { all: true }, (err, addresses) => {
      res.json({ err, addresses, platform: process.platform, node: process.version });
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/test-email', async (req, res) => {
  const sendEmail = require('./utils/sendEmail');
  try {
    const result = await sendEmail({
      email: 'schoolmarttest@gmail.com', // Just a placeholder for testing
      subject: 'SERVER TEST EMAIL',
      message: 'This is a test of the email system.',
      html: '<h1>TEST SUCCESSFUL</h1>'
    });
    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: err.message, 
      code: err.code,
      command: err.command,
      stack: err.stack 
    });
  }
});

// Port
const PORT = process.env.PORT || 5000;

// Connect to Database and start server
const startServer = async () => {
  await connectDB();
  
  // Sync database (updates tables to match models)
  try {
    await sequelize.sync({ alter: true });
    console.log('Database synced');
  } catch (err) {
    console.warn('⚠️  sync({ alter: true }) failed:', err.message);
    console.log('Retrying with safe sync (no alter)...');
    await sequelize.sync();
    console.log('Database synced (safe mode)');
  }

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

process.on('unhandledRejection', (err) => {
  // Log but DO NOT crash — email delivery failures from Resend/SMTP should never
  // take down the entire server.
  console.error('UNHANDLED REJECTION (non-fatal):', err?.name, err?.message);
});

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message, err.stack);
  process.exit(1);
});

process.on('SIGTERM', () => {
  console.log('Gracefully shutting down SIGTERM');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('Gracefully shutting down SIGINT');
  process.exit(0);
});

startServer();

