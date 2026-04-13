require('dotenv').config();
const { sequelize } = require('./config/db');
const CMSPage = require('./models/CMSPage');

const TITLES = {
  'gamified-math-labs': 'Mathematics',
  'science-is-fun': 'Science',
  'workshops': 'Workshops',
  'fundraising': 'Fundraising',
  'registration': 'Inquiry Labels',
  'login': 'Login Page',
  'forgot-password': 'Password Recovery',
  'how-it-works': 'How It Works',
  'pricing': 'Pricing',
  'shipping-policy': 'Shipping Policy',
  'cancellation-policy': 'Cancellation Policy',
  'replacement-return': 'Returns & Refunds',
  'payments': 'Payments',
  'order-rejection-policy': 'Order Rejection',
  'seller-help': 'Seller Help',
  'sell-on-schoolmart': 'Sell on SchoolMart',
  'report-issue': 'Report Issue',
  'blog': 'Blog',
  'delivery-locations': 'Delivery Locations',
  'home': 'Home Page',
  'furniture': 'Furniture',
  'sports': 'Sports',
  'digital': 'Digital Infra',
  'products': 'Products',
  'architecture': 'Architecture',
  'school-building-design': 'Architecture',
  'libraries': 'Libraries',
  'environments': 'Environments',
  'aboutus': 'About Us',
  'contact-us': 'Contact Us',
  'mathematics': 'Mathematics',
  'science': 'Science',
  'labs': 'Labs',
  'design': 'School Designs',
  'manufacturing': 'Manufacturing',
  'corporate': 'Corporate',
  'catalogues': 'Catalogues',
  'guides': 'Guides',
  'school-sale': 'School Sale',
  'partnerships': 'Partnerships',
  'setup-guide': 'Setup Guide'
};

async function sync() {
  await sequelize.authenticate();
  const pages = await CMSPage.findAll();
  for (const page of pages) {
    if (TITLES[page.slug]) {
       await page.update({ title: TITLES[page.slug] });
    }
  }
  console.log('✅ PAGE TITLES STANDARDIZED');
  process.exit(0);
}

sync().catch(console.error);
