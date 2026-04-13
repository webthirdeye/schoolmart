require('dotenv').config();
const { sequelize } = require('./config/db');
const CMSPage = require('./models/CMSPage');
const CMSBlock = require('./models/CMSBlock');

const HOME_BLOCKS = [
  {
    key: 'topbar', type: 'topbar', order: 1,
    data: {
      bgColor: '#0057A8',
      textColor: '#FFFFFF',
      email: 'info@schoolmart.in',
      phone1: '+91 9966109191',
      phone2: '+91 9866091111',
      socials: {
        facebook: 'https://www.facebook.com/schoolmart.in',
        twitter: 'https://twitter.com/schoolmarts',
        instagram: 'https://www.instagram.com/schoolmart.in/',
        linkedin: 'https://www.linkedin.com/school/schoolmart-india/',
        youtube: 'https://www.youtube.com/channel/UCgKY_Kf8jH1hoP3p0I0tiRA'
      }
    }
  },
  {
    key: 'ticker', type: 'ticker', order: 2,
    data: {
      label: 'Latest Updates',
      items: [
        'Digital Transformation Summit: 15 May 2026',
        'New AI-Powered Learning Stations now available for pre-order',
        'Join our upcoming Campus Design Webinar on 15th April 2026',
        'Annual Sports Meet Registrations closing soon',
        'New Sustainable Furniture Catalogue Launched'
      ]
    }
  },
  {
    key: 'navbar', type: 'navbar', order: 3,
    data: {
      categories: [
        { name: 'FURNITURE', path: '/furniture', icon: 'Armchair' },
        { name: 'ARCHITECTURE', path: '/school-building-design', icon: 'Building2' },
        { name: 'DIGITAL INFRA', path: '/digital', icon: 'Laptop' },
        { name: 'SCHOOL DESIGNS', path: '/design', icon: 'Palette' },
        { name: 'LIBRARIES', path: '/libraries', icon: 'BookOpen' },
        { name: 'SPORTS', path: '/sports', icon: 'Trophy' },
        { name: 'MATHEMATICS', path: '/gamified-math-labs', icon: 'Calculator' },
        { name: 'SCIENCE', path: '/science-is-fun', icon: 'FlaskConical' },
        { name: 'LABS', path: '/labs', icon: 'Library' },
      ]
    }
  },
  {
    key: 'hero', type: 'hero', order: 4,
    data: {
      badge: 'Price · Quality · Range Promise',
      headline1: 'FURNITURE',
      headline2: 'QUICK DELIVERY',
      subline1: 'Order Now',
      subline2: 'Kindergarten · Highschools · Labs · Libraries',
      cta1: { label: 'Shop Furniture →', path: '/furniture' },
      cta2: { label: 'View Catalogue', path: '/catalogues' },
      bgColor: '',
      mediaType: 'image',
      mediaUrl: ''
    }
  },
  {
    key: 'product_carousel', type: 'product_carousel', order: 5,
    data: {
      heading: 'FEATURED PRODUCTS',
      items: [
        { title: 'C-Shape Dynamic Stool', price: '3,500.00', img: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=600&q=80', path: '/furniture' },
        { title: 'Lab Workstation V2', price: '18,500.00', img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&q=80', path: '/furniture' },
        { title: 'Ergonomic Faculty Chair', price: '7,500.00', img: 'https://images.unsplash.com/photo-1582213793728-9cc0034a34ea?w=600&q=80', path: '/furniture' },
        { title: 'Stem Robotics Station', price: '36,000.00', img: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=600&q=80', path: '/furniture' },
        { title: 'Digital Hub Monitor', price: '18,500.00', img: 'https://images.unsplash.com/photo-1558448231-314777598379?w=600&q=80', path: '/digital' },
      ]
    }
  },
  {
    key: 'tiles', type: 'tiles', order: 6,
    data: {
      tiles: [
        { title: 'IMMERSIVE LEARNING', subtitle: 'VR & AR in Education', path: '/p/immersive-learning', height: 'h-64', img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&q=80' },
        { title: 'KINDERGARTEN DESIGN', subtitle: 'Playful Learning Spaces', path: '/p/kindergarten-design', height: 'h-48', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80' },
        { title: 'COMPOSITE SKILL LABS', subtitle: 'Future-Ready Education', path: '/p/skill-labs', height: 'h-56', img: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600&q=80' },
        { title: 'LIBRARY INNOVATIONS', subtitle: 'Modern Reading Spaces', path: '/p/library-innovations', height: 'h-72', img: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=600&q=80' },
        { title: 'FURNITURE DESIGN & PLANNING', subtitle: 'Custom Solutions', path: '/p/furniture-planning', height: 'h-52', img: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&q=80' },
        { title: 'SELLING OR BUYING A SCHOOL', subtitle: 'CHECK OPPORTUNITIES WITH US', path: '/p/school-sale', height: 'h-64', img: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&q=80', featured: true },
        { title: 'GAMIFIED MATH LABS', subtitle: 'Learn Math Through Play', path: '/p/math-labs', height: 'h-48', img: 'https://images.unsplash.com/photo-1596496181871-9681eacf9764?w=600&q=80' },
        { title: 'INTERACTIVE WALLS', subtitle: 'Engaging Learning Tools', path: '/p/interactive-walls', height: 'h-60', img: 'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&q=80' },
        { title: '16 LATEST INTERACTIVE PANELS', subtitle: 'FOR CLASSROOMS', path: '/p/interactive-panels', height: 'h-56', img: 'https://images.unsplash.com/photo-1548544149-4835e62ee5b3?w=600&q=80' },
        { title: 'WONDERGARTENS', subtitle: 'Magical Learning Spaces', path: '/p/wondergartens', height: 'h-48', img: 'https://images.unsplash.com/photo-1541367777708-7905fe3296c0?w=600&q=80' },
        { title: '20+ AI TOOLS FOR CLASSROOMS', subtitle: 'WITH TRAINING SUPPORT', path: '/p/ai-classroom', height: 'h-52', img: 'https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?w=600&q=80' },
        { title: 'SMART SPORTS FOR SCHOOLS', subtitle: 'Next-Gen Sports Infrastructure', path: '/p/smart-sports', height: 'h-64', img: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80' },
      ]
    }
  },
  {
    key: 'solutions', type: 'solutions', order: 7,
    data: {
      heading: 'Explore Our Solutions',
      items: [
        { title: 'School Furniture', description: '1200+ ergonomic products for every classroom, lab and library', path: '/furniture', badge: { label: 'Furniture', color: '#F97316' }, img: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80' },
        { title: 'Digital Infrastructure', description: 'Cutting-edge ed-tech, interactive panels and smart classrooms', path: '/digital', badge: { label: 'Technology', color: '#3B82F6' }, img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80' },
        { title: 'Sports Infrastructure', description: 'Professional-grade courts, equipment and sports facilities', path: '/sports', badge: { label: 'Sports', color: '#22C55E' }, img: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80' },
        { title: 'School Architecture', description: 'NEP-ready campus planning and interior design by expert architects', path: '/school-building-design', badge: { label: 'Architecture', color: '#8B5CF6' }, img: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80' },
        { title: 'Learning Environments', description: 'STEM labs, libraries, maker-spaces and activity rooms', path: '/environments', badge: { label: 'Environments', color: '#0EA5E9' }, img: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80' },
        { title: 'School Design & Planning', description: 'End-to-end campus setup, expansion and renovation services', path: '/design', badge: { label: 'Design', color: '#EC4899' }, img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80' },
      ]
    }
  },
  {
    key: 'cta_whatsapp', type: 'cta_whatsapp', order: 8,
    data: {
      badge: 'Direct Consultation',
      headline: 'Ready to scale your campus?',
      description: 'At SchoolMart, we provide end-to-end expertise in guiding you to set up your new campus project. From spatial planning to high-density procurement, we help you maximize ROI and institutional growth.',
      whatsappNumber: '919966109191',
      phone: '+91 9966109191',
      bgColor: '',
      whatsappLabel: 'Connect on WhatsApp',
      phoneLabel: 'Call Support'
    }
  },
  {
    key: 'partners', type: 'partners', order: 9,
    data: {
      heading: 'Trusted by Leading Schools',
      subheading: '4000+ partner schools across India',
      clients: [
        { name: 'AVN Vida International School' }, { name: 'Alwar Das Group' },
        { name: 'DRS International School' }, { name: 'Bhashyam Educational Institutions' },
        { name: 'Excel Edge The Value School' }, { name: 'Delhi Public School' },
        { name: 'DAV Public School' }, { name: 'Podar International' },
        { name: 'CMS School' }, { name: 'VIBGYOR Group' },
      ],
      stats: [
        { value: '4000+', label: 'Partner Schools' },
        { value: '7+', label: 'Years Experience' },
        { value: '1200+', label: 'Products' },
        { value: '16+', label: 'Panel Architects' },
      ]
    }
  },
  {
    key: 'sidebar_trending', type: 'sidebar_trending', order: 10,
    data: {
      items: [
        'Schools for Sale / Lease',
        'Fundraising',
        'Partnerships',
        'Workshops',
        'Job Openings',
        'Join as Influencers'
      ]
    }
  },
  {
    key: 'sidebar_resources', type: 'sidebar_resources', order: 11,
    data: {
      items: [
        'Setup School in India',
        'Digitization Guide',
        'Product Catalog 2025',
        'Skill Lab Guide',
        'Lookbook – Play Furniture',
        'Gamified Math Resources',
        'Completed Projects',
        '20 Stunning School Design Ideas',
        'Library Trends'
      ]
    }
  },
  {
    key: 'sidebar_banners', type: 'sidebar_banners', order: 12,
    data: {
      banners: [
        { label: 'Products for', sublabel: 'Govt Schools', color: '#0057A8', path: '/govt' },
        { label: 'School Renovation', sublabel: 'Services', color: '#9333EA', path: '/renovation' },
        { label: '20 Smart School Ideas', sublabel: '', color: '#F97316', path: '/ideas' },
      ]
    }
  }
];

async function seed() {
  await sequelize.authenticate();
  await sequelize.sync({ alter: true });

  for (const block of HOME_BLOCKS) {
    const [existing, created] = await CMSBlock.findOrCreate({
      where: { pageSlug: 'home', key: block.key },
      defaults: {
        type: block.type,
        key: block.key,
        data: block.data,
        order: block.order,
        isVisible: true,
        pageSlug: 'home'
      }
    });
    if (!created) {
      await existing.update({ type: block.type, order: block.order });
      console.log(`  ↺ ${block.key} (exists, preserved user data)`);
    } else {
      console.log(`  ✓ ${block.key} (seeded)`);
    }
  }

  console.log('\\n✅ HOME PAGE BLOCKS FULLY SEEDED');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
