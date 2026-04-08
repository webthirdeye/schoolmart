const express = require('express');
const router = express.Router();
const Page = require('../models/Page');
const auth = require('../middleware/auth');
const { adminOnly } = require('../middleware/auth');

// GET /api/cms/:slug  — public endpoint (auto-create if missing)
router.get('/:slug', async (req, res) => {
  try {
    let page = await Page.findOne({ pageSlug: req.params.slug });
    
    // If page doesn't exist, create a draft version with standard template blocks
    if (!page) {
      page = new Page({
        pageSlug: req.params.slug,
        pageTitle: req.params.slug.replace(/-/g, ' ').toUpperCase(),
        isPublished: true,
        blocks: [
          { blockType: 'inner_page_hero', data: { title: req.params.slug.replace(/-/g, ' ').toUpperCase() }, order: 0 },
          { blockType: 'sidebar_resources', data: { items: [] }, order: 1 },
          { blockType: 'sidebar_trending', data: { items: [] }, order: 2 },
          { blockType: 'text_content', data: { 
            title: `Strategic Framework for ${req.params.slug.replace(/-/g, ' ').toUpperCase()}`, 
            body: '<p>Standardizing institutional growth through dedicated frameworks and tactical resource allocation.</p><h2>Objective</h2><p>To establish a robust ecosystem for academic excellence.</p>' 
          }, order: 3 },
          { blockType: 'cta_whatsapp', data: {}, order: 4 }
        ]
      });
      await page.save();
    }
    
    res.json(page);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/cms   — list all pages (admin)
router.get('/', auth, adminOnly, async (req, res) => {
  try {
    const pages = await Page.find().select('pageSlug pageTitle isPublished updatedAt blocks');
    res.json(pages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/cms/:slug  — full page update (admin)
router.put('/:slug', auth, adminOnly, async (req, res) => {
  try {
    const { pageTitle, blocks, isPublished } = req.body;
    const page = await Page.findOneAndUpdate(
      { pageSlug: req.params.slug },
      { pageTitle, blocks, isPublished, lastUpdatedBy: req.user.id },
      { new: true, upsert: true, runValidators: true }
    );
    res.json(page);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/cms/:slug/block/:blockId  — update a single block (admin)
router.patch('/:slug/block/:blockId', auth, adminOnly, async (req, res) => {
  try {
    const page = await Page.findOne({ pageSlug: req.params.slug });
    if (!page) return res.status(404).json({ message: 'Page not found' });

    const block = page.blocks.id(req.params.blockId);
    if (!block) return res.status(404).json({ message: 'Block not found' });

    if (req.body.data !== undefined) block.data = req.body.data;
    if (req.body.isVisible !== undefined) block.isVisible = req.body.isVisible;
    if (req.body.order !== undefined) block.order = req.body.order;

    page.lastUpdatedBy = req.user.id;
    await page.save();
    res.json(page);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/cms/:slug/block  — add a block (admin)
router.post('/:slug/block', auth, adminOnly, async (req, res) => {
  try {
    const page = await Page.findOne({ pageSlug: req.params.slug });
    if (!page) return res.status(404).json({ message: 'Page not found' });

    page.blocks.push(req.body);
    await page.save();
    res.status(201).json(page);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/cms/:slug/block/:blockId  — remove a block (admin)
router.delete('/:slug/block/:blockId', auth, adminOnly, async (req, res) => {
  try {
    const page = await Page.findOne({ pageSlug: req.params.slug });
    if (!page) return res.status(404).json({ message: 'Page not found' });

    page.blocks = page.blocks.filter(b => b._id.toString() !== req.params.blockId);
    await page.save();
    res.json({ message: 'Block deleted', page });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/cms/standardize  — (Admin Only) automatically add missing blocks to all pages
router.post('/standardize', auth, adminOnly, async (req, res) => {
  try {
    const PAGE_ALLOWED_BLOCKS = {
      home:        ['hero', 'product_carousel', 'tiles', 'solutions', 'sidebar_trending', 'sidebar_resources', 'sidebar_banners', 'cta_whatsapp', 'partners', 'topbar', 'navbar', 'ticker'],
      furniture:   ['inner_page_hero', 'sidebar_categories', 'sidebar_resources', 'sidebar_trending', 'cta_whatsapp'],
      architecture:['inner_page_hero', 'sidebar_categories', 'sidebar_resources', 'sidebar_trending', 'cta_whatsapp'],
      digital:     ['inner_page_hero', 'sidebar_categories', 'sidebar_resources', 'sidebar_trending', 'cta_whatsapp'],
      sports:      ['inner_page_hero', 'sidebar_categories', 'sidebar_resources', 'sidebar_trending', 'cta_whatsapp'],
      libraries:   ['inner_page_hero', 'sidebar_categories', 'sidebar_resources', 'sidebar_trending', 'cta_whatsapp'],
      labs:        ['inner_page_hero', 'sidebar_categories', 'sidebar_resources', 'sidebar_trending', 'cta_whatsapp'],
      mathematics: ['inner_page_hero', 'sidebar_categories', 'sidebar_resources', 'sidebar_trending', 'cta_whatsapp'],
      science:     ['inner_page_hero', 'sidebar_categories', 'sidebar_resources', 'sidebar_trending', 'cta_whatsapp'],
      design:      ['inner_page_hero', 'sidebar_categories', 'sidebar_resources', 'sidebar_trending', 'cta_whatsapp'],
      manufacturing:['inner_page_hero', 'sidebar_resources', 'sidebar_trending', 'cta_whatsapp', 'text_content'],
      corporate:   ['inner_page_hero', 'sidebar_resources', 'sidebar_trending', 'cta_whatsapp', 'text_content'],
      environments:['environments_page_content', 'sidebar_resources', 'sidebar_trending', 'cta_whatsapp'],
      catalogues:  ['catalogues_page_content', 'catalogues_list', 'sidebar_resources', 'sidebar_trending', 'cta_whatsapp'],
      guides:      ['guides_page_content', 'guides_list', 'sidebar_resources', 'sidebar_trending', 'cta_whatsapp'],
      aboutus:     ['about_hero', 'stats', 'mission_vision', 'about_philosophy', 'journey', 'sidebar_resources', 'sidebar_trending'],
      'contact-us':['contact_page_content', 'contact_info', 'sidebar_resources', 'sidebar_trending'],
      'school-sale': ['inner_page_hero', 'sidebar_categories', 'listings', 'cta_whatsapp'],
      partnerships: ['inner_page_hero', 'sidebar_categories', 'categories', 'cta_whatsapp'],
      'setup-guide': ['inner_page_hero', 'sidebar_categories', 'benefits', 'cta_whatsapp'],
      workshops:   ['inner_page_hero', 'sidebar_categories', 'upcoming_events', 'cta_whatsapp'],
      fundraising: ['inner_page_hero', 'sidebar_categories', 'categories', 'cta_whatsapp'],
      'digitization-guide': ['inner_page_hero', 'text_content', 'sidebar_categories', 'cta_whatsapp'],
      'catalogue-2025': ['inner_page_hero', 'text_content', 'sidebar_categories', 'cta_whatsapp'],
      'skill-lab-guide': ['inner_page_hero', 'text_content', 'sidebar_categories', 'cta_whatsapp'],
      'play-furniture-lookbook': ['inner_page_hero', 'text_content', 'sidebar_categories', 'cta_whatsapp'],
      'math-resources': ['inner_page_hero', 'text_content', 'sidebar_categories', 'cta_whatsapp'],
      'completed-projects': ['inner_page_hero', 'text_content', 'sidebar_categories', 'cta_whatsapp'],
      'design-ideas': ['inner_page_hero', 'text_content', 'sidebar_categories', 'cta_whatsapp'],
      'library-trends': ['inner_page_hero', 'text_content', 'sidebar_categories', 'cta_whatsapp'],
      'job-openings': ['inner_page_hero', 'text_content', 'sidebar_categories', 'cta_whatsapp'],
      'influencer-program': ['inner_page_hero', 'text_content', 'sidebar_categories', 'cta_whatsapp'],
    };

    const allSlugs = Object.keys(PAGE_ALLOWED_BLOCKS);
    let results = { updated: 0, skipped: 0 };

    for (const slug of allSlugs) {
      let page = await Page.findOne({ pageSlug: slug });
      let isNew = false;
      if (!page) {
        page = new Page({ 
          pageSlug: slug, 
          pageTitle: slug.replace(/-/g, ' ').toUpperCase(), 
          isPublished: true, 
          blocks: [] 
        });
        isNew = true;
      }

      let changed = false;
      const currentTypes = page.blocks.map(b => b.blockType);
      const allowed = PAGE_ALLOWED_BLOCKS[slug];

      for (const type of allowed) {
        if (!currentTypes.includes(type)) {
          if (type === 'inner_page_hero' && currentTypes.includes('page_hero')) {
             const oldIdx = page.blocks.findIndex(b => b.blockType === 'page_hero');
             page.blocks[oldIdx].blockType = 'inner_page_hero';
             const oldData = page.blocks[oldIdx].data || {};
             page.blocks[oldIdx].data = {
               badge: '', badgeIcon: '', 
               titleHtml: oldData.title || '', 
               subtitle: oldData.subtitle || '', 
               mediaType: oldData.mediaType || 'image', 
               mediaUrl: oldData.mediaUrl || oldData.img || '' 
             };
             changed = true;
          } else {
             page.blocks.push({ blockType: type, data: {}, order: page.blocks.length, isVisible: true });
             changed = true;
          }
        }
      }

      if (changed || isNew) {
        page.blocks.sort((a, b) => allowed.indexOf(a.blockType) - allowed.indexOf(b.blockType));
        page.blocks.forEach((b, i) => b.order = i);
        await page.save();
        results.updated++;
      } else {
        results.skipped++;
      }
    }
    res.json({ message: 'Standardization complete', ...results });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
