const CMSPage = require('../models/CMSPage');
const CMSBlock = require('../models/CMSBlock');

// ── Canonical page slugs — the only slugs the admin dashboard recognises ─────
const CANONICAL_SLUGS = new Set([
  'home', 'furniture', 'architecture', 'digital', 'sports', 'libraries',
  'environments', 'aboutus', 'contact-us', 'mathematics', 'science', 'labs',
  'design', 'manufacturing', 'corporate', 'catalogues', 'guides', 'school-sale',
  'partnerships', 'setup-guide', 'registration', 'login', 'workshops',
  'fundraising', 'how-it-works', 'pricing', 'shipping-policy', 'cancellation-policy',
  'replacement-return', 'payments', 'order-rejection-policy', 'seller-help',
  'sell-on-schoolmart', 'report-issue', 'blog', 'delivery-locations', 'forgot-password'
]);

// Get all pages — returns all registered pages in the database
exports.getAllPages = async (req, res) => {
  try {
    const pages = await CMSPage.findAll({ order: [['title', 'ASC']] });
    
    // Attach blocks to each page
    const allBlocks = await CMSBlock.findAll({ order: [['order', 'ASC']] });
    const blocksByPage = {};
    allBlocks.forEach(b => {
      if (!blocksByPage[b.pageSlug]) blocksByPage[b.pageSlug] = [];
      blocksByPage[b.pageSlug].push({
        id: b.id,
        key: b.key,
        type: b.type,
        data: b.data,
        isVisible: b.isVisible
      });
    });

    const result = pages.map(p => ({
      ...p.toJSON(),
      blocks: blocksByPage[p.slug] || []
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single page with its blocks
exports.getPageContent = async (req, res) => {
  try {
    const { slug } = req.params;
    let page = await CMSPage.findOne({ where: { slug } });
    
    // Only auto-create pages for recognised canonical slugs
    if (!page) {
      if (!CANONICAL_SLUGS.has(slug)) {
        return res.status(404).json({ message: `Unknown page slug: ${slug}` });
      }
      page = await CMSPage.create({ 
        slug, 
        title: slug.replace(/-/g, ' ').toUpperCase() 
      });
    }

    const blocks = await CMSBlock.findAll({ 
      where: { pageSlug: slug },
      order: [['order', 'ASC']]
    });

    // Transform to key-value map for frontend ease
    const blockMap = {};
    blocks.forEach(b => {
      blockMap[b.key] = {
        id: b.id,
        key: b.key,
        type: b.type,
        data: b.data,
        isVisible: b.isVisible
      };
    });

    res.json({ page, blocks: blockMap });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update or Create block
exports.updateBlock = async (req, res) => {
  try {
    const { pageSlug, key, type, data, isVisible, id } = req.body;
    
    let block;
    // Prefer lookup by explicit ID if provided, otherwise fallback to pageSlug/key pair
    if (id) {
      block = await CMSBlock.findByPk(id);
    } 
    if (!block && pageSlug && key) {
      block = await CMSBlock.findOne({ where: { pageSlug, key } });
    }

    if (block) {
      block.data = data !== undefined ? data : block.data;
      if (type) block.type = type;
      if (isVisible !== undefined) block.isVisible = isVisible;
      // Force Sequelize to detect JSONB change — without this, mutations to
      // nested arrays (like removing a category) are silently skipped.
      block.changed('data', true);
      await block.save();
    } else {
      block = await CMSBlock.create({ pageSlug, key, type, data, isVisible });
    }

    res.json(block);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add block (for dynamic lists)
exports.addBlock = async (req, res) => {
  try {
    const block = await CMSBlock.create(req.body);
    res.status(201).json(block);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a CMS page and all its blocks (admin cleanup)
exports.deletePage = async (req, res) => {
  try {
    const { slug } = req.params;
    await CMSBlock.destroy({ where: { pageSlug: slug } });
    await CMSPage.destroy({ where: { slug } });
    res.json({ message: `Page '${slug}' and all its blocks deleted.` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete block
exports.deleteBlock = async (req, res) => {
  try {
    const { id } = req.params;
    await CMSBlock.destroy({ where: { id } });
    res.json({ message: 'Block deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new page manually
exports.createPage = async (req, res) => {
  try {
    const { slug, name } = req.body;
    let page = await CMSPage.findOne({ where: { slug } });
    if (!page) {
      page = await CMSPage.create({ 
        slug, 
        title: name || slug.replace(/-/g, ' ').toUpperCase() 
      });
    }
    res.status(201).json(page);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



