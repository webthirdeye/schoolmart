const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { connectDB, sequelize } = require('./config/db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));
app.use('/api/cms', require('./routes/cmsRoutes'));
app.use('/api/settings', require('./routes/settingRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));

// Static Folders
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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
  await sequelize.sync({ alter: true });
  console.log('Database synced');

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

