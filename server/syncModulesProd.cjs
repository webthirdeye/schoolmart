const { Sequelize } = require('sequelize');

async function syncAllModules() {
  const connectionString = 'postgresql://postgres:AnkvVIDqtWkaFfhvhlwMBOmDHBRAtxxf@metro.proxy.rlwy.net:21904/railway';
  const sequelize = new Sequelize(connectionString, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: { ssl: { require: true, rejectUnauthorized: false } }
  });

  const slugs = [
    'furniture', 'architecture', 'school-building-design', 'digital', 'libraries', 'design', 'sports',
    'mathematics', 'gamified-math-labs', 'science', 'science-is-fun', 'labs', 'aboutus', 'corporate',
    'manufacturing', 'catalogues', 'guides', 'contact-us', 'how-it-works', 'pricing', 'shipping-policy',
    'registration', 'login'
  ];

  try {
    await sequelize.authenticate();
    console.log('--- GLOBAL MODULE SYNC STARTED ---');
    
    for (const slug of slugs) {
      console.log(`Seeding modules for: ${slug}`);
      
      const defaultBlocks = [
        { key: 'inner_page_hero', type: 'inner_page_hero' },
        { key: 'sidebar_categories', type: 'sidebar_categories' },
        { key: 'page_content', type: 'page_content' }
      ];

      for (const block of defaultBlocks) {
        await sequelize.query(`
          INSERT INTO "CMSBlocks" (id, "pageSlug", key, type, data, "isVisible", "createdAt", "updatedAt")
          VALUES (gen_random_uuid(), :pageSlug, :key, :type, '{}', true, NOW(), NOW())
          ON CONFLICT ("pageSlug", key) DO NOTHING
        `, { replacements: { pageSlug: slug, key: block.key, type: block.type } });
      }
    }
    
    console.log('--- ALL 43 PAGES NOW HAVE DEFAULT MODULES ---');
  } catch (error) {
    console.error('Module Sync Error:', error);
  } finally {
    await sequelize.close();
  }
}

syncAllModules();
