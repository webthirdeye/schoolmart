const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const ChatLead = sequelize.define('ChatLead', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  sessionId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  // Lead info (captured mid-conversation)
  name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  schoolName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true
  },
  // Conversation data
  messages: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  // AI-extracted intent
  intent: {
    type: DataTypes.STRING,
    allowNull: true  // e.g. "new_school_setup", "library_upgrade", "lab_inquiry"
  },
  estimatedBudget: {
    type: DataTypes.STRING,
    allowNull: true
  },
  boardType: {
    type: DataTypes.STRING,
    allowNull: true  // CBSE, ICSE, IB, etc.
  },
  studentCount: {
    type: DataTypes.STRING,
    allowNull: true
  },
  // Tracking
  currentPage: {
    type: DataTypes.STRING,
    allowNull: true
  },
  leadScore: {
    type: DataTypes.INTEGER,
    defaultValue: 0  // 0-100, increases with engagement
  },
  status: {
    type: DataTypes.ENUM('active', 'captured', 'contacted', 'converted'),
    defaultValue: 'active'
  }
}, {
  timestamps: true
});

module.exports = ChatLead;
