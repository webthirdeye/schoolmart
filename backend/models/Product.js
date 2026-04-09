const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  category: { type: String, required: true },   // e.g. 'Furniture', 'Digital Infra'
  subcategory: { type: String },
  price: { type: Number },
  image: { type: String },                     // primary single image URL
  images: [{ type: String }],                   // image URLs
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  isNew: { type: Boolean, default: false },
  tags: [{ type: String }],
  stats: [{
    label: { type: String },
    value: { type: String }
  }],
  resources: [{
    name: { type: String },
    size: { type: String },
    url: { type: String }
  }],
  featuresTitle: { type: String }, // e.g. "Key Features & Technical Specs"
  executionTitle: { type: String }, // e.g. "Execution Strategy"
  ctaLabel: { type: String },      // e.g. "Request Quote"
  ctaLink: { type: String },       // e.g. "/registration"
  chatLabel: { type: String },     // e.g. "Chat"
  chatLink: { type: String }       // e.g. "https://wa.me/..."
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
