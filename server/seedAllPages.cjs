require('dotenv').config();
const { sequelize } = require('./config/db');
const CMSPage = require('./models/CMSPage');
const CMSBlock = require('./models/CMSBlock');

// ── REGISTRATION PAGE ──────────────────────────────────────────
const REGISTRATION_BLOCKS = [
  {
    key: 'registration_hero', type: 'registration_hero', order: 1,
    data: {
      badge: 'Partner Network',
      heading: 'Join <br/> The <span class="text-sm-blue italic font-serif opacity-80">Circle.</span>',
      description: 'Get exclusive access to architectural blueprints, customized institutional catalogs, and early-bird campus planning consultancy.',
      statCards: [
        { title: 'Pre-Approved', subtitle: 'Pricing for Schools' },
        { title: 'Priority', subtitle: 'Architect Meetings' },
      ]
    }
  },
  {
    key: 'registration_fields', type: 'registration_fields', order: 2,
    data: {
      formTitle: 'Partner school Registration Form.',
      formSubtitle: 'Please Select the services and get information on new products discounts and seasonal offers',
      sectionHeading: 'Institutional Info',
      submitLabel: 'SUBMIT',
      fields: [
        { label: 'School Name', placeholder: 'school Name', type: 'text', required: false },
        { label: 'Email id*', placeholder: 'Email ID*', type: 'email', required: true },
        { label: 'Create Password*', placeholder: 'Create Password*', type: 'password', required: true },
        { label: 'Phone Number', placeholder: 'Phone Number', type: 'tel', required: false },
        { label: 'Authorised Person', placeholder: 'Authorised Person', type: 'text', required: false },
        { label: 'Address', placeholder: 'Address', type: 'text', required: false },
        { label: 'Pincode', placeholder: 'Pincode', type: 'text', required: false },
        { label: 'Type of school', placeholder: 'Select school type', type: 'select', required: false, options: ['International school','CBSE School','ICSE School','STATE Board School','College University','Business Educational Partners'] },
        { label: 'Message', placeholder: 'Write your message here...', type: 'textarea', required: false },
      ]
    }
  },
  {
    key: 'registration_services', type: 'registration_services', order: 3,
    data: {
      heading: 'Select Services',
      services: [
        'School design architecture services green schools',
        'Project management planning to completion',
        'Existing school refurbishmentredesign',
        'kindergarden furniture',
        'High school Furniture',
        'Premium furniture for International schools',
        'Hostel furniture',
        'Tablets with pre loaded content CBSE ICSE State',
        'SmartTech Computer Labs',
        'GPRS for buses student tracking',
        'Auggmented Reality Libraries',
        'AI based School content',
        'Mathematica',
        'Discovery Pod',
        'Mini and Mega Auditoriums',
        'Phygital Libraries',
        'Phygital Science labs',
        'Art Music Enviroments',
        'Animated play Interactive walls',
        'School sports acaedemy',
        'Pools aqua complex',
        'Surface Sports Tennis basketball',
        'Cricket baseball pitches',
        'Artificial turf Synthetic Acrylic surfaces',
        'Playscapes Childhood activity',
        'School funding JV & operations',
        'School buy and sell services'
      ]
    }
  },
  {
    key: 'registration_school_types', type: 'registration_school_types', order: 4,
    data: {
      options: ['International school','CBSE School','ICSE School','STATE Board School','College University','Business Educational Partners']
    }
  },
  {
    key: 'registration_features', type: 'registration_features', order: 5,
    data: {
      cards: [
        { title: 'Data Privacy', description: 'Your institutional data is protected by bank-level encryption.', icon: 'ShieldCheck' },
        { title: 'Network Access', description: 'Discover the list of our 1500+ institutional members.', icon: 'Globe' },
        { title: 'Exclusive Docs', description: 'Download 200+ case studies and architectural PDFs.', icon: 'Sparkles' },
        { title: 'Direct Entry', description: 'Fast-track your first order with simplified workflow.', icon: 'ArrowRight' },
      ]
    }
  }
];

// ── LOGIN PAGE ─────────────────────────────────────────────────
const LOGIN_BLOCKS = [
  {
    key: 'login_hero', type: 'login_hero', order: 1,
    data: {
      badge: 'Secure Institutional Portal',
      heading: 'Welcome <br/> <span class="text-sm-blue italic font-serif opacity-80 decoration-sm-blue decoration-4 underline underline-offset-[20px]">Back.</span>',
      description: 'Manage your project timelines, view your quotation history, and access exclusive design resources from one dashboard.',
      statsTitle: 'Member Circle',
      statsCount: '15k+ Institutions Online'
    }
  },
  {
    key: 'login_fields', type: 'login_fields', order: 2,
    data: {
      step1Heading: 'SIGN IN',
      step1Subtitle: 'Everything a school needs is within reach.',
      emailLabel: 'Work Email',
      emailPlaceholder: 'example@institutional.in',
      passwordLabel: 'Security Key',
      forgotText: 'Forgot?',
      loginBtnText: 'Authorize Portal',
      newUserPrompt: 'New Institution?',
      registerLinkText: 'Create School Account',
      step2Heading: '2FA VERIFY',
      step2Subtitle: 'Enter the code from your email',
      verifyBtnText: 'Verify Identity',
      resendText: 'Resend Security Code'
    }
  }
];

// ── ALL REMAINING PAGES ────────────────────────────────────────
// Each inner page gets: hero + page content + optional sections
const INNER_PAGES = {
  'furniture': {
    title: 'Furniture',
    blocks: [
      { key: 'inner_page_hero', type: 'inner_page_hero', order: 1, data: { badge: 'Performance 2025', titleHtml: 'School<br/><span class="text-sm-blue">Furniture</span>', subtitle: 'Ergonomic designs for modern classrooms' } },
      { key: 'sidebar_categories', type: 'sidebar_categories', order: 2, data: { categories: ['Classroom Desks','Student Chairs','Lab Furniture','Library Furniture','Teacher Desks','Storage','Hostel Furniture','Kindergarten'] } },
    ]
  },
  'school-building-design': {
    title: 'Architecture',
    blocks: [
      { key: 'inner_page_hero', type: 'inner_page_hero', order: 1, data: { badge: 'Design Excellence', titleHtml: 'School<br/><span class="text-sm-blue">Architecture</span>', subtitle: 'NEP-ready campus planning and design' } },
    ]
  },
  'digital': {
    title: 'Digital Infra',
    blocks: [
      { key: 'inner_page_hero', type: 'inner_page_hero', order: 1, data: { badge: 'Future Ready', titleHtml: 'Digital<br/><span class="text-sm-blue">Infrastructure</span>', subtitle: 'Smart classrooms and ed-tech solutions' } },
      { key: 'sidebar_categories', type: 'sidebar_categories', order: 2, data: { categories: ['Interactive Panels','Smart Boards','Projectors','Computer Labs','Digital Podiums','AV Systems'] } },
    ]
  },
  'sports': {
    title: 'Sports',
    blocks: [
      { key: 'inner_page_hero', type: 'inner_page_hero', order: 1, data: { badge: 'Champions Arena', titleHtml: 'Sports<br/><span class="text-sm-blue">Infrastructure</span>', subtitle: 'Professional-grade sports facilities for schools' } },
      { key: 'sidebar_categories', type: 'sidebar_categories', order: 2, data: { categories: ['Cricket','Football','Basketball','Tennis','Swimming','Athletics','Indoor Sports','Playground Equipment'] } },
    ]
  },
  'libraries': {
    title: 'Libraries',
    blocks: [
      { key: 'inner_page_hero', type: 'inner_page_hero', order: 1, data: { badge: 'Knowledge Hub', titleHtml: 'Modern<br/><span class="text-sm-blue">Libraries</span>', subtitle: 'Phygital libraries and reading spaces' } },
    ]
  },
  'environments': {
    title: 'Environments',
    blocks: [
      { key: 'inner_page_hero', type: 'inner_page_hero', order: 1, data: { badge: 'Learning Spaces', titleHtml: 'Learning<br/><span class="text-sm-blue">Environments</span>', subtitle: 'STEM labs, maker-spaces and activity rooms' } },
    ]
  },
  'aboutus': {
    title: 'About Us',
    blocks: [
      { key: 'page_hero', type: 'page_hero', order: 1, data: { badge: 'Our Story', titleHtml: 'About<br/><span class="text-sm-blue">SchoolMart</span>', subtitle: 'India\'s leading school infrastructure partner', description: '' } },
      { key: 'page_content', type: 'page_content', order: 2, data: { heading: 'Our Mission', content: '' } },
      { key: 'page_stats', type: 'page_stats', order: 3, data: { stats: [{ value: '4000+', label: 'Partner Schools' },{ value: '7+', label: 'Years' },{ value: '1200+', label: 'Products' },{ value: '16+', label: 'Architects' }] } },
    ]
  },
  'contact-us': {
    title: 'Contact Us',
    blocks: [
      { key: 'page_hero', type: 'page_hero', order: 1, data: { badge: 'Get in Touch', titleHtml: 'Contact<br/><span class="text-sm-blue">Us</span>', subtitle: 'From architectural blueprints to furniture installations, we assist you in every step.' } },
      { key: 'page_faq', type: 'page_faq', order: 2, data: { heading: 'Frequently Asked Questions', items: [] } },
    ]
  },
  'mathematics': {
    title: 'Mathematics',
    blocks: [
      { key: 'inner_page_hero', type: 'inner_page_hero', order: 1, data: { badge: 'Gamified Learning', titleHtml: 'Gamified<br/><span class="text-sm-blue">Math Labs</span>', subtitle: 'Making mathematics fun and interactive' } },
    ]
  },
  'science': {
    title: 'Science',
    blocks: [
      { key: 'inner_page_hero', type: 'inner_page_hero', order: 1, data: { badge: 'Discovery Zone', titleHtml: 'Science<br/><span class="text-sm-blue">is Fun</span>', subtitle: 'Interactive science labs and equipment' } },
    ]
  },
  'design': {
    title: 'School Designs',
    blocks: [
      { key: 'inner_page_hero', type: 'inner_page_hero', order: 1, data: { badge: 'Campus Blueprint', titleHtml: 'School<br/><span class="text-sm-blue">Designs</span>', subtitle: 'End-to-end campus setup and renovation services' } },
    ]
  },
  'manufacturing': {
    title: 'Manufacturing',
    blocks: [
      { key: 'manufacturing_hero', type: 'manufacturing_hero', order: 1, data: { badge: 'Made in India', titleHtml: 'Our<br/><span class="text-sm-blue">Manufacturing</span>', description: 'State-of-the-art production facilities', images: [], partnerStat: '4K+', partnerLabel: 'Partner Schools' } },
    ]
  },
  'corporate': {
    title: 'Corporate',
    blocks: [
      { key: 'page_hero', type: 'page_hero', order: 1, data: { badge: 'Enterprise', titleHtml: 'Corporate<br/><span class="text-sm-blue">Solutions</span>', subtitle: 'Office and corporate furniture solutions' } },
      { key: 'page_features', type: 'page_features', order: 2, data: { heading: 'Our Capabilities', features: [] } },
    ]
  },
  'catalogues': {
    title: 'Catalogues',
    blocks: [
      { key: 'page_hero', type: 'page_hero', order: 1, data: { badge: 'Downloads', titleHtml: 'Product<br/><span class="text-sm-blue">Catalogues</span>', subtitle: 'Download our complete product catalogues' } },
      { key: 'pdf_resource', type: 'pdf_resource', order: 2, data: { title: 'Product Catalogue 2025', description: 'Complete range of school furniture and infrastructure', fileUrl: '', registeredOnly: true } },
    ]
  },
  'guides': {
    title: 'Guides',
    blocks: [
      { key: 'page_hero', type: 'page_hero', order: 1, data: { badge: 'Resources', titleHtml: 'Setup<br/><span class="text-sm-blue">Guides</span>', subtitle: 'Comprehensive guides for school setup and infrastructure' } },
      { key: 'page_gallery', type: 'page_gallery', order: 2, data: { heading: 'Featured Guides', images: [] } },
    ]
  },
  'school-sale': {
    title: 'School Sale',
    blocks: [
      { key: 'page_hero', type: 'page_hero', order: 1, data: { badge: 'Opportunities', titleHtml: 'School<br/><span class="text-sm-blue">Buy & Sell</span>', subtitle: 'Explore school acquisition and partnership opportunities' } },
    ]
  },
  'partnerships': {
    title: 'Partnerships',
    blocks: [
      { key: 'page_hero', type: 'page_hero', order: 1, data: { badge: 'Collaborate', titleHtml: 'Strategic<br/><span class="text-sm-blue">Partnerships</span>', subtitle: 'Join our growing network of education partners' } },
    ]
  },
  'setup-guide': {
    title: 'Setup Guide',
    blocks: [
      { key: 'page_hero', type: 'page_hero', order: 1, data: { badge: 'Step by Step', titleHtml: 'School<br/><span class="text-sm-blue">Setup Guide</span>', subtitle: 'Everything you need to start a new school in India' } },
    ]
  },
  'workshops': {
    title: 'Workshops',
    blocks: [
      { key: 'inner_page_hero', type: 'inner_page_hero', order: 1, data: { badge: 'Events', titleHtml: 'Professional<br/><span class="text-sm-blue">Workshops</span>', subtitle: 'Training and development programs for educators' } },
    ]
  },
  'fundraising': {
    title: 'Fundraising',
    blocks: [
      { key: 'inner_page_hero', type: 'inner_page_hero', order: 1, data: { badge: 'Growth Capital', titleHtml: 'School<br/><span class="text-sm-blue">Fundraising</span>', subtitle: 'Funding solutions for school infrastructure' } },
    ]
  },
  'how-it-works': {
    title: 'How It Works',
    blocks: [
      { key: 'page_hero', type: 'page_hero', order: 1, data: { badge: 'Process', titleHtml: 'How It<br/><span class="text-sm-blue">Works</span>', subtitle: 'Our end-to-end school infrastructure process' } },
    ]
  },
  'pricing': {
    title: 'Pricing',
    blocks: [
      { key: 'page_hero', type: 'page_hero', order: 1, data: { badge: 'Transparent', titleHtml: 'Our<br/><span class="text-sm-blue">Pricing</span>', subtitle: 'Competitive institutional pricing' } },
    ]
  },
  'shipping-policy': {
    title: 'Shipping Policy',
    blocks: [
      { key: 'page_content', type: 'page_content', order: 1, data: { heading: 'Shipping Policy', content: '' } },
    ]
  },
  'cancellation-policy': {
    title: 'Cancellation Policy',
    blocks: [
      { key: 'page_content', type: 'page_content', order: 1, data: { heading: 'Cancellation Policy', content: '' } },
    ]
  },
  'replacement-return': {
    title: 'Returns & Refunds',
    blocks: [
      { key: 'page_content', type: 'page_content', order: 1, data: { heading: 'Returns & Refund Policy', content: '' } },
    ]
  },
  'payments': {
    title: 'Payments',
    blocks: [
      { key: 'page_content', type: 'page_content', order: 1, data: { heading: 'Payment Methods', content: '' } },
    ]
  },
  'order-rejection-policy': {
    title: 'Order Rejection',
    blocks: [
      { key: 'page_content', type: 'page_content', order: 1, data: { heading: 'Order Rejection Policy', content: '' } },
    ]
  },
  'seller-help': {
    title: 'Seller Help',
    blocks: [
      { key: 'page_content', type: 'page_content', order: 1, data: { heading: 'Seller Help Center', content: '' } },
    ]
  },
  'sell-on-schoolmart': {
    title: 'Sell on SchoolMart',
    blocks: [
      { key: 'page_content', type: 'page_content', order: 1, data: { heading: 'Sell on SchoolMart', content: '' } },
    ]
  },
  'report-issue': {
    title: 'Report Issue',
    blocks: [
      { key: 'page_content', type: 'page_content', order: 1, data: { heading: 'Report an Issue', content: '' } },
    ]
  },
  'blog': {
    title: 'Blog',
    blocks: [
      { key: 'page_hero', type: 'page_hero', order: 1, data: { badge: 'Insights', titleHtml: 'Our<br/><span class="text-sm-blue">Blog</span>', subtitle: 'Latest news and insights from the education sector' } },
    ]
  },
  'delivery-locations': {
    title: 'Delivery Locations',
    blocks: [
      { key: 'page_content', type: 'page_content', order: 1, data: { heading: 'Delivery Locations', content: '' } },
    ]
  },
};

async function seed() {
  await sequelize.authenticate();
  console.log('Connected.\n');

  // ── Seed Registration ────────────────────────────────────────
  await CMSPage.findOrCreate({ where: { slug: 'registration' }, defaults: { title: 'Registration', slug: 'registration' } });
  console.log('📋 REGISTRATION PAGE');
  for (const block of REGISTRATION_BLOCKS) {
    const [_, created] = await CMSBlock.findOrCreate({
      where: { pageSlug: 'registration', key: block.key },
      defaults: { ...block, pageSlug: 'registration', isVisible: true }
    });
    console.log(`  ${created ? '✓' : '↺'} ${block.key}`);
  }

  // ── Seed Login ───────────────────────────────────────────────
  await CMSPage.findOrCreate({ where: { slug: 'login' }, defaults: { title: 'Login', slug: 'login' } });
  console.log('\n🔐 LOGIN PAGE');
  for (const block of LOGIN_BLOCKS) {
    const [_, created] = await CMSBlock.findOrCreate({
      where: { pageSlug: 'login', key: block.key },
      defaults: { ...block, pageSlug: 'login', isVisible: true }
    });
    console.log(`  ${created ? '✓' : '↺'} ${block.key}`);
  }

  // ── Seed All Inner Pages ─────────────────────────────────────
  console.log('\n📄 INNER PAGES');
  for (const [slug, pageData] of Object.entries(INNER_PAGES)) {
    await CMSPage.findOrCreate({ where: { slug }, defaults: { title: pageData.title, slug } });
    console.log(`\n  📁 ${pageData.title} (/${slug})`);
    for (const block of pageData.blocks) {
      const [_, created] = await CMSBlock.findOrCreate({
        where: { pageSlug: slug, key: block.key },
        defaults: { ...block, pageSlug: slug, isVisible: true }
      });
      console.log(`    ${created ? '✓' : '↺'} ${block.key}`);
    }
  }

  console.log('\n\n✅ ALL PAGES SEEDED SUCCESSFULLY');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
