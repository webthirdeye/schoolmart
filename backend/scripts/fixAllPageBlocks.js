/**
 * fixAllPageBlocks.js
 * 
 * Ensures that all catalogue pages have the standard set of blocks automatically.
 * This saves the user from having to manually click "Add Missing Section" for each.
 */

const mongoose = require('mongoose');
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const Page = require('../models/Page');

const CATALOGUE_SLUGS = [
  'furniture', 'architecture', 'digital', 'sports',
  'libraries', 'labs', 'mathematics', 'science', 'design',
  'manufacturing', 'corporate'
];

const REQUIRED_BLOCKS = [
  { type: 'inner_page_hero', data: { badge: '', titleHtml: '', subtitle: '', mediaType: 'image', mediaUrl: '' } },
  { type: 'sidebar_categories', data: { title: 'Core Categories', categories: [] } },
  { type: 'sidebar_resources', data: { items: [] } },
  { type: 'sidebar_trending', data: { items: [] } },
  { type: 'cta_whatsapp', data: { badge: 'Get a Quote', headline: 'Need help with procurement?', description: 'Chat with our experts.', whatsappNumber: '919966109191', phone: '+91 9966109191' } }
];

async function fixPages() {
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/schoolmart';
  await mongoose.connect(MONGO_URI);
  console.log('✅ Connected to MongoDB\n');

  for (const slug of CATALOGUE_SLUGS) {
    const page = await Page.findOne({ pageSlug: slug });
    if (!page) {
      console.log(`⚠️  Page "${slug}" not found, skipping.`);
      continue;
    }

    let changed = false;
    const currentTypes = page.blocks.map(b => b.blockType);

    for (const req of REQUIRED_BLOCKS) {
      if (!currentTypes.includes(req.type)) {
        page.blocks.push({
          blockType: req.type,
          data: req.data,
          order: page.blocks.length,
          isVisible: true
        });
        changed = true;
        console.log(`  ➕ [${slug}] Added missing block: ${req.type}`);
      }
    }

    // Special case: migration from page_hero to inner_page_hero
    const pageHeroIdx = page.blocks.findIndex(b => b.blockType === 'page_hero');
    if (pageHeroIdx !== -1) {
      const innerHeroIdx = page.blocks.findIndex(b => b.blockType === 'inner_page_hero');
      if (innerHeroIdx !== -1) {
        // Transfer data if inner was blank and page_hero had something
        if (!page.blocks[innerHeroIdx].data.titleHtml && page.blocks[pageHeroIdx].data.title) {
           page.blocks[innerHeroIdx].data.titleHtml = page.blocks[pageHeroIdx].data.title;
           page.blocks[innerHeroIdx].data.subtitle = page.blocks[pageHeroIdx].data.subtitle;
           page.blocks[innerHeroIdx].data.mediaUrl = page.blocks[pageHeroIdx].data.img;
        }
        page.blocks.splice(pageHeroIdx, 1);
        changed = true;
        console.log(`  🗑️  [${slug}] Migrated page_hero to inner_page_hero`);
      }
    }

    if (changed) {
      // Re-order cleanly based on standard arrangement
      const ORDER = REQUIRED_BLOCKS.map(b => b.type);
      page.blocks.sort((a, b) => {
        const ai = ORDER.indexOf(a.blockType);
        const bi = ORDER.indexOf(b.blockType);
        if (ai === -1 && bi === -1) return 0;
        if (ai === -1) return 1;
        if (bi === -1) return -1;
        return ai - bi;
      });
      page.blocks.forEach((b, i) => b.order = i);

      await page.save();
      console.log(`  💾 [${slug}] Saved changes!\n`);
    } else {
      console.log(`  ✅ [${slug}] Already has all blocks\n`);
    }
  }

  await mongoose.disconnect();
  console.log('✅ All catalog pages have been standardized.');
}

fixPages().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
