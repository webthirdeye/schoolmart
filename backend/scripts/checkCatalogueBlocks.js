const mongoose = require('mongoose');
require('dotenv').config();
const Page = require('../models/Page');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  // Check all catalogue-type pages
  const slugs = ['furniture', 'architecture', 'digital', 'sports', 'libraries', 'labs', 'mathematics', 'science', 'design'];
  for (const slug of slugs) {
    const p = await Page.findOne({ pageSlug: slug }).lean();
    if (!p) { console.log(slug, '-> NOT FOUND'); continue; }
    const blockTypes = p.blocks.map(b => b.blockType);
    console.log(slug + ' -> blocks: [' + blockTypes.join(', ') + ']');
  }
  
  // Also check what the DB page_hero data looks like for furniture
  const furn = await Page.findOne({ pageSlug: 'furniture' }).lean();
  const hero = furn.blocks.find(b => b.blockType === 'page_hero');
  console.log('\nFurniture page_hero data keys: ' + Object.keys(hero?.data || {}).join(', '));
  console.log('Furniture page_hero data: ' + JSON.stringify(hero?.data));
  
  mongoose.disconnect();
}).catch(e => { console.error(e.message); process.exit(1); });
