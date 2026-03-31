/**
 * fixAllPageBlocks.js
 * 
 * Ensures that ALL pages have their standard set of allowed blocks automatically.
 */

const mongoose = require('mongoose');
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const Page = require('../models/Page');

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
  environments:['environments_page_content'],
  catalogues:  ['catalogues_page_content', 'catalogues_list'],
  guides:      ['guides_page_content', 'guides_list'],
  aboutus:     ['about_hero', 'stats', 'mission_vision'],
  'contact-us':['contact_page_content', 'contact_info'],
};

async function fixPages() {
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/schoolmart';
  await mongoose.connect(MONGO_URI);
  console.log('✅ Connected to MongoDB\n');

  const allSlugs = Object.keys(PAGE_ALLOWED_BLOCKS);

  for (const slug of allSlugs) {
    const page = await Page.findOne({ pageSlug: slug });
    if (!page) {
      console.log(`⚠️  Page "${slug}" not found, skipping.`);
      continue;
    }

    let changed = false;
    const currentTypes = page.blocks.map(b => b.blockType);
    const allowed = PAGE_ALLOWED_BLOCKS[slug];

    for (const type of allowed) {
      if (!currentTypes.includes(type)) {
        // Special mapping for legacy 'page_hero' if it exists for this page
        if (type === 'inner_page_hero' && currentTypes.includes('page_hero')) {
           const oldIdx = page.blocks.findIndex(b => b.blockType === 'page_hero');
           page.blocks[oldIdx].blockType = 'inner_page_hero';
           const oldData = page.blocks[oldIdx].data || {};
           page.blocks[oldIdx].data = {
             badge: '',
             badgeIcon: '',
             titleHtml: oldData.title || '',
             subtitle: oldData.subtitle || '',
             mediaType: oldData.mediaType || 'image',
             mediaUrl: oldData.mediaUrl || oldData.img || '',
           };
           changed = true;
           console.log(`  🔄 [${slug}] Migrated page_hero to inner_page_hero`);
        } else {
           // Add blank block
           page.blocks.push({
             blockType: type,
             data: {},
             order: page.blocks.length,
             isVisible: true
           });
           changed = true;
           console.log(`  ➕ [${slug}] Added missing block: ${type}`);
        }
      }
    }

    if (changed) {
      // Re-order cleanly based on PAGE_ALLOWED_BLOCKS array order
      page.blocks.sort((a, b) => {
        const ai = allowed.indexOf(a.blockType);
        const bi = allowed.indexOf(b.blockType);
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
  console.log('✅ All website pages have been standardized.');
}

fixPages().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
