/**
 * canonicalSync.cjs — Single authoritative CMS cleanup script
 * 
 * This script defines the EXACT modules each page should have, then:
 *  1. Deletes blocks that don't belong to a page
 *  2. Sets the correct `order` value on every remaining block
 *  3. Removes orphan pages that aren't in the canonical list
 *  4. Creates any missing pages/blocks with defaults
 * 
 * Run: node canonicalSync.cjs
 */

require('dotenv').config();
const { sequelize } = require('./config/db');
const CMSPage  = require('./models/CMSPage');
const CMSBlock = require('./models/CMSBlock');

// ═══════════════════════════════════════════════════════════════════════════════
// CANONICAL PAGE → BLOCK MAPPING
// Each page lists its allowed block keys IN ORDER.
// Any block NOT listed here will be DELETED from that page.
// ═══════════════════════════════════════════════════════════════════════════════

const CANONICAL = {
  // ── HOME ────────────────────────────────────────────────────────────────────
  home: {
    title: 'HOME PAGE',
    blocks: [
      'topbar',              // 1
      'ticker',              // 2
      'navbar',              // 3
      'hero',                // 4
      'product_carousel',    // 5
      'tiles',               // 6
      'solutions',           // 7
      'cta_whatsapp',        // 8
      'partners',            // 9
      'sidebar_trending',    // 10
      'sidebar_resources',   // 11
      'sidebar_banners',     // 12
    ]
  },

  // ── REGISTRATION & LOGIN ────────────────────────────────────────────────────
  registration: {
    title: 'Registration',
    blocks: [
      'registration_hero',
      'registration_fields',
      'registration_services',
      'registration_school_types',
      'registration_features',
    ]
  },
  login: {
    title: 'Login',
    blocks: [
      'login_hero',
      'login_fields',
    ]
  },
  'forgot-password': {
    title: 'Forgot Password',
    blocks: []
  },

  // ── PRODUCT / CATEGORY INNER PAGES ──────────────────────────────────────────
  furniture: {
    title: 'Furniture',
    blocks: ['inner_page_hero', 'sidebar_categories', 'action_strip']
  },
  'school-building-design': {
    title: 'Architecture',
    blocks: ['inner_page_hero']
  },
  digital: {
    title: 'Digital Infra',
    blocks: ['inner_page_hero', 'sidebar_categories', 'action_strip']
  },
  sports: {
    title: 'Sports',
    blocks: ['inner_page_hero', 'sidebar_categories', 'action_stack', 'info_split_grid']
  },
  libraries: {
    title: 'Libraries',
    blocks: ['inner_page_hero', 'sidebar_categories']
  },
  mathematics: {
    title: 'Mathematics',
    blocks: ['inner_page_hero', 'sidebar_categories']
  },
  science: {
    title: 'Science',
    blocks: ['inner_page_hero', 'sidebar_categories']
  },
  labs: {
    title: 'Labs & Libraries',
    blocks: ['inner_page_hero', 'sidebar_categories']
  },
  design: {
    title: 'School Designs',
    blocks: ['inner_page_hero', 'sidebar_categories']
  },

  // ── SPECIAL CMS PAGES ──────────────────────────────────────────────────────
  environments: {
    title: 'Environments',
    blocks: ['inner_page_hero', 'environments_page_content']
  },
  guides: {
    title: 'Guides',
    blocks: ['guides_page_content']
  },
  manufacturing: {
    title: 'Manufacturing',
    blocks: ['manufacturing_hero']
  },
  corporate: {
    title: 'Corporate',
    blocks: ['corporate_hero', 'page_features']
  },
  fundraising: {
    title: 'Fundraising',
    blocks: ['inner_page_hero', 'advisory_items', 'case_studies']
  },

  // ── CONTENT / INFO PAGES ──────────────────────────────────────────────────
  aboutus: {
    title: 'About Us',
    blocks: ['page_hero', 'page_content', 'page_stats']
  },
  'contact-us': {
    title: 'Contact Us',
    blocks: ['page_hero', 'page_faq']
  },
  catalogues: {
    title: 'Catalogues',
    blocks: ['page_hero', 'pdf_resource']
  },
  'school-sale': {
    title: 'School Sale',
    blocks: ['page_hero']
  },
  partnerships: {
    title: 'Partnerships',
    blocks: ['page_hero']
  },
  'setup-guide': {
    title: 'Setup Guide',
    blocks: ['page_hero', 'setup_phases']
  },
  workshops: {
    title: 'Workshops',
    blocks: ['inner_page_hero', 'workshops_list']
  },
  'how-it-works': {
    title: 'How It Works',
    blocks: ['page_hero', 'how_steps']
  },
  pricing: {
    title: 'Pricing',
    blocks: ['page_hero', 'pricing_plans']
  },
  blog: {
    title: 'Blog',
    blocks: ['page_hero', 'blog_posts']
  },

  // ── POLICY / SIMPLE TEXT PAGES ─────────────────────────────────────────────
  'shipping-policy':         { title: 'Shipping Policy',        blocks: ['page_content'] },
  'cancellation-policy':     { title: 'Cancellation Policy',    blocks: ['page_content'] },
  'replacement-return':      { title: 'Returns & Refunds',      blocks: ['page_content'] },
  payments:                  { title: 'Payments',               blocks: ['page_content'] },
  'order-rejection-policy':  { title: 'Order Rejection',        blocks: ['page_content'] },
  'seller-help':             { title: 'Seller Help',            blocks: ['page_content'] },
  'sell-on-schoolmart':      { title: 'Sell on SchoolMart',     blocks: ['page_content'] },
  'report-issue':            { title: 'Report Issue',           blocks: ['page_content'] },
  'delivery-locations':      { title: 'Delivery Locations',     blocks: ['page_content'] },
};

// ═══════════════════════════════════════════════════════════════════════════════

async function run() {
  await sequelize.authenticate();
  console.log('✅ Database connected\n');

  let totalDeleted = 0;
  let totalFixed = 0;
  let totalCreated = 0;
  let pagesRemoved = 0;

  const canonicalSlugs = new Set(Object.keys(CANONICAL));

  // ── 1. Remove orphan pages (not in canonical list) ─────────────────────────
  const allPages = await CMSPage.findAll();
  for (const page of allPages) {
    if (!canonicalSlugs.has(page.slug)) {
      const blockCount = await CMSBlock.count({ where: { pageSlug: page.slug } });
      await CMSBlock.destroy({ where: { pageSlug: page.slug } });
      await CMSPage.destroy({ where: { slug: page.slug } });
      console.log(`🗑️  REMOVED orphan page: /${page.slug} (${blockCount} blocks wiped)`);
      pagesRemoved++;
      totalDeleted += blockCount;
    }
  }

  // ── 2. For each canonical page: create if missing, prune stale blocks, fix order
  for (const [slug, config] of Object.entries(CANONICAL)) {
    console.log(`\n📄 /${slug} — "${config.title}"`);

    // Ensure page exists
    const [page, pageCreated] = await CMSPage.findOrCreate({
      where: { slug },
      defaults: { title: config.title, slug }
    });
    if (pageCreated) {
      console.log(`   ✨ Page created`);
      totalCreated++;
    }

    // Get all existing blocks for this page
    const existingBlocks = await CMSBlock.findAll({ where: { pageSlug: slug } });
    const existingKeys = new Set(existingBlocks.map(b => b.key));
    const allowedKeys = new Set(config.blocks);

    // Delete blocks that shouldn't be on this page
    for (const block of existingBlocks) {
      if (!allowedKeys.has(block.key)) {
        await CMSBlock.destroy({ where: { id: block.id } });
        console.log(`   ❌ DELETED stale block: ${block.key} (type: ${block.type})`);
        totalDeleted++;
      }
    }

    // Create missing blocks with empty data
    for (const key of config.blocks) {
      if (!existingKeys.has(key)) {
        await CMSBlock.create({
          pageSlug: slug,
          key,
          type: key,
          data: {},
          order: config.blocks.indexOf(key) + 1,
          isVisible: true,
        });
        console.log(`   ✨ CREATED missing block: ${key}`);
        totalCreated++;
      }
    }

    // Fix order for all remaining blocks
    for (let i = 0; i < config.blocks.length; i++) {
      const key = config.blocks[i];
      const correctOrder = i + 1;
      const block = await CMSBlock.findOne({ where: { pageSlug: slug, key } });
      if (block && block.order !== correctOrder) {
        await block.update({ order: correctOrder });
        console.log(`   🔧 Fixed order: ${key} → ${correctOrder}`);
        totalFixed++;
      } else if (block) {
        console.log(`   ✓ ${key} (order: ${correctOrder})`);
      }
    }
  }

  console.log('\n' + '═'.repeat(60));
  console.log(`✅ CANONICAL SYNC COMPLETE`);
  console.log(`   Pages removed:  ${pagesRemoved}`);
  console.log(`   Blocks deleted: ${totalDeleted}`);
  console.log(`   Blocks created: ${totalCreated}`);
  console.log(`   Orders fixed:   ${totalFixed}`);
  console.log('═'.repeat(60));

  process.exit(0);
}

run().catch(err => {
  console.error('❌ SYNC FAILED:', err);
  process.exit(1);
});
