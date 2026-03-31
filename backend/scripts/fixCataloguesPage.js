/**
 * fixCataloguesPage.js
 * Removes stale page_hero block from catalogues page (Catalogues.jsx reads catalogues_page_content, not page_hero)
 */

const mongoose = require('mongoose');
require('dotenv').config();
const Page = require('../models/Page');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  // Remove page_hero from catalogues (frontend reads catalogues_page_content)
  const cat = await Page.findOne({ pageSlug: 'catalogues' });
  if (cat) {
    const before = cat.blocks.map(b => b.blockType);
    cat.blocks = cat.blocks.filter(b => b.blockType !== 'page_hero');
    const after = cat.blocks.map(b => b.blockType);
    if (before.length !== after.length) {
      await cat.save();
      console.log(`✅ catalogues: removed page_hero. Now: [${after.join(', ')}]`);
    } else {
      console.log(`✔️  catalogues: no page_hero found, already clean`);
    }
  }

  // Verify all pages
  const pages = await Page.find({}).lean();
  console.log('\n═══ FINAL BLOCK STATE ═══');
  pages.forEach(p => {
    console.log(`${p.pageSlug}: [${p.blocks.map(b => b.blockType).join(', ')}]`);
  });

  mongoose.disconnect();
  console.log('\n✅ Done!');
}).catch(e => { console.error(e.message); process.exit(1); });
