const mongoose = require('mongoose');

// Generic block schema — each block is a section of a page
const blockSchema = new mongoose.Schema({
  blockType: { type: String, required: true }, // e.g. 'topbar', 'ticker', 'hero', 'tiles', etc.
  data: { type: mongoose.Schema.Types.Mixed, default: {} },
  order: { type: Number, default: 0 },
  isVisible: { type: Boolean, default: true },
}, { _id: true });

const pageSchema = new mongoose.Schema({
  pageSlug: { type: String, required: true, unique: true },  // e.g. 'home', 'furniture', 'about'
  pageTitle: { type: String, required: true },
  blocks: [blockSchema],
  isPublished: { type: Boolean, default: true },
  lastUpdatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Page', pageSchema);
