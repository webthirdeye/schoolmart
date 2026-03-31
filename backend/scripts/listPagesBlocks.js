const mongoose = require('mongoose');
require('dotenv').config();
const Page = require('../models/Page');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const pages = await Page.find({}).lean();
  for (const p of pages) {
    console.log(`\n=== ${p.pageSlug} (${p.pageTitle}) ===`);
    for (const b of p.blocks) {
      console.log(`  [${b.blockType}] visible=${b.isVisible}`);
    }
  }
  mongoose.disconnect();
}).catch(e => { console.error(e); process.exit(1); });
