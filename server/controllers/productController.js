const Product = require('../models/Product');
const Category = require('../models/Category');

// Helper: generate URL-safe slug from a name + random suffix
const makeSlug = (name) => {
  const base = (name || 'product')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  const suffix = Math.random().toString(36).slice(2, 7);
  return `${base}-${suffix}`;
};

// Get products with filtering support
exports.getProducts = async (req, res) => {
  try {
    const { category, subcategory, slug, limit } = req.query;
    const { Op } = require('sequelize');
    const where = {};
    
    if (category) where.category = category;
    if (subcategory) where.subcategory = { [Op.iLike]: subcategory };
    if (slug) where.slug = slug;
    
    const products = await Product.findAll({
      where,
      limit: limit ? parseInt(limit) : undefined,
      order: [['createdAt', 'DESC']]
    });
    // Set Cache-Control for Vercel/Browser caching (1 min fresh, 10 min stale-while-revalidate)
    res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=600');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create product
exports.createProduct = async (req, res) => {
  try {
    const data = { ...req.body };
    // Auto-generate slug if not provided
    if (!data.slug) {
      data.slug = makeSlug(data.name);
    }
    const product = await Product.create(data);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    const data = { ...req.body };
    // Ensure slug is always set
    if (!data.slug && !product.slug) {
      data.slug = makeSlug(data.name || product.name);
    }
    await product.update(data);
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    await product.destroy();
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Bulk rename subcategory — called when admin renames a sidebar category
exports.bulkRenameSubcategory = async (req, res) => {
  try {
    const { category, oldSubcategory, newSubcategory } = req.body;
    if (!category || !oldSubcategory) {
      return res.status(400).json({ message: 'category and oldSubcategory are required' });
    }

    const { Op } = require('sequelize');
    const [count] = await Product.update(
      { subcategory: newSubcategory || '' },
      { where: { category, subcategory: { [Op.iLike]: oldSubcategory } } }
    );

    res.json({ message: `Updated ${count} products`, count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


