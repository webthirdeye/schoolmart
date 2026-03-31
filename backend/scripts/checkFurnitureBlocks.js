const mongoose = require('mongoose');
require('dotenv').config();
const Page = require('../models/Page');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  // Check furniture page specifically
  const p = await Page.findOne({ pageSlug: 'furniture' }).lean();
  console.log('=== FURNITURE PAGE BLOCKS ===');
  for (const b of p.blocks) {
    console.log(`\n[${b.blockType}]`);
    console.log(JSON.stringify(b.data, null, 2));
  }
  mongoose.disconnect();
}).catch(e => { console.error(e); process.exit(1); });
