const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { connectDB, sequelize } = require('./config/db');

const app = express();

// Middleware — explicit CORS for Vercel ↔ Railway cross-origin
const allowedOrigins = [
  'https://schoolmart-ashen.vercel.app',
  'https://schoolmart.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      // If you want to be more permissive during development, you can just return true here
      // return callback(null, true); 
      var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
}));
app.options('*', cors());   // handle all OPTIONS preflight requests
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

// Sanity check for uploads folder
if (!fs.existsSync(uploadDir)) {
  console.log('📁 Creating missing uploads directory at:', uploadDir);
  fs.mkdirSync(uploadDir, { recursive: true });
}
console.log('🚀 Serving static files from:', uploadDir);

app.use('/uploads', express.static(uploadDir));
// Basic Route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to SchoolMart API' });
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
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message, err.stack);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message, err.stack);
  process.exit(1);
});

startServer();

