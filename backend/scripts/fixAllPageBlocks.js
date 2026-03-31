/**
 * fixAllPageBlocks.js
 * 
 * Fixes the mismatch between what the admin CMS stores in MongoDB
 * and what the frontend pages actually read.
 *
 * For all catalogue-type pages:
 *   - Renames "page_hero" block → "inner_page_hero"
 *   - Remaps old page_hero data fields (title→titleHtml, subtitle stays,
 *     bgGradient dropped, mediaUrl/mediaType/img all preserved)
 *   - Adds missing "sidebar_resources" block if absent
 *   - Adds missing "sidebar_trending" block if absent
 *
 * Safe to run multiple times — idempotent checks are in place.
 */

const mongoose = require('mongoose');
require('dotenv').config();
const Page = require('../models/Page');

// These page slugs use "inner_page_hero" in their JSX frontend files
const CATALOGUE_SLUGS = [
  'furniture', 'architecture', 'digital', 'sports',
  'libraries', 'labs', 'mathematics', 'science', 'design',
  'manufacturing', 'corporate',
];

async function fixPages() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected to MongoDB\n');

  for (const slug of CATALOGUE_SLUGS) {
    const page = await Page.findOne({ pageSlug: slug });
    if (!page) {
      console.log(`⚠️  Page "${slug}" not found, skipping.`);
      continue;
    }

    let changed = false;

    // ── 1. Rename page_hero → inner_page_hero and remap data fields ──────────
    const pageHeroIdx = page.blocks.findIndex(b => b.blockType === 'page_hero');
    const innerHeroIdx = page.blocks.findIndex(b => b.blockType === 'inner_page_hero');

    if (pageHeroIdx !== -1 && innerHeroIdx === -1) {
      const oldBlock = page.blocks[pageHeroIdx];
      const oldData = oldBlock.data || {};

      // Remap: "title" in page_hero → "titleHtml" in inner_page_hero
      // Preserve: subtitle, mediaType, mediaUrl, img
      const newData = {
        badge:      oldData.badge      || '',
        badgeIcon:  oldData.badgeIcon  || '',
        titleHtml:  oldData.titleHtml  || oldData.title || '',
        subtitle:   oldData.subtitle   || '',
        mediaType:  oldData.mediaType  || 'image',
        mediaUrl:   oldData.mediaUrl   || oldData.img   || '',
        darkBlock: oldData.darkBlock   || { title: '', subtitle: '' },
      };

      page.blocks[pageHeroIdx].blockType = 'inner_page_hero';
      page.blocks[pageHeroIdx].data = newData;
      changed = true;
      console.log(`  🔄 [${slug}] Renamed page_hero → inner_page_hero, remapped data fields`);
    } else if (pageHeroIdx === -1 && innerHeroIdx === -1) {
      // Neither exists: add a blank inner_page_hero
      page.blocks.push({
        blockType: 'inner_page_hero',
        data: {
          badge: '',
          badgeIcon: '',
          titleHtml: '',
          subtitle: '',
          mediaType: 'image',
          mediaUrl: '',
          darkBlock: { title: '', subtitle: '' },
        },
        order: 0,
        isVisible: true,
      });
      changed = true;
      console.log(`  ➕ [${slug}] Added missing inner_page_hero block`);
    } else if (pageHeroIdx !== -1 && innerHeroIdx !== -1) {
      // Both exist — remove the stale page_hero
      page.blocks.splice(pageHeroIdx, 1);
      changed = true;
      console.log(`  🗑️  [${slug}] Removed duplicate page_hero (inner_page_hero already present)`);
    } else {
      console.log(`  ✔️  [${slug}] inner_page_hero already correct`);
    }

    // ── 2. Ensure sidebar_resources block exists ─────────────────────────────
    const hasSidebarResources = page.blocks.some(b => b.blockType === 'sidebar_resources');
    if (!hasSidebarResources) {
      page.blocks.push({
        blockType: 'sidebar_resources',
        data: { items: [] },
        order: page.blocks.length,
        isVisible: true,
      });
      changed = true;
      console.log(`  ➕ [${slug}] Added missing sidebar_resources block`);
    }

    // ── 3. Ensure sidebar_trending block exists ──────────────────────────────
    const hasSidebarTrending = page.blocks.some(b => b.blockType === 'sidebar_trending');
    if (!hasSidebarTrending) {
      page.blocks.push({
        blockType: 'sidebar_trending',
        data: { items: [] },
        order: page.blocks.length,
        isVisible: true,
      });
      changed = true;
      console.log(`  ➕ [${slug}] Added missing sidebar_trending block`);
    }

    // ── 4. Re-order blocks cleanly ───────────────────────────────────────────
    if (changed) {
      const ORDER = [
        'inner_page_hero', 'sidebar_categories', 'sidebar_resources',
        'sidebar_trending', 'cta_whatsapp', 'text_content',
      ];
      page.blocks.sort((a, b) => {
        const ai = ORDER.indexOf(a.blockType);
        const bi = ORDER.indexOf(b.blockType);
        if (ai === -1 && bi === -1) return 0;
        if (ai === -1) return 1;
        if (bi === -1) return -1;
        return ai - bi;
      });
      page.blocks.forEach((b, i) => { b.order = i; });

      await page.save();
      console.log(`  💾 [${slug}] Saved!\n`);
    } else {
      console.log(`  ✅ [${slug}] No changes needed\n`);
    }
  }

  // ── 5. Verify summary ─────────────────────────────────────────────────────
  console.log('\n═══ POST-FIX VERIFICATION ═══');
  for (const slug of CATALOGUE_SLUGS) {
    const page = await Page.findOne({ pageSlug: slug }).lean();
    if (!page) continue;
    const types = page.blocks.map(b => b.blockType).join(', ');
    console.log(`${slug}: [${types}]`);
  }

  await mongoose.disconnect();
  console.log('\n✅ Done! Refresh the website — admin edits will now appear correctly.');
}

fixPages().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
