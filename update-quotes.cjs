const fs = require('fs');
const files = [
  { path: 'src/pages/Architecture.jsx', name: 'Architecture' },
  { path: 'src/pages/DigitalInfra.jsx', name: 'Digital Infra' },
  { path: 'src/pages/SchoolDesigns.jsx', name: 'School Designs' },
  { path: 'src/pages/Sports.jsx', name: 'Sports' },
  { path: 'src/pages/Mathematics.jsx', name: 'Mathematics' },
  { path: 'src/pages/Science.jsx', name: 'Science' },
  { path: 'src/pages/LabsLibraries.jsx', name: 'Labs & Libraries' }
];

files.forEach(file => {
  let content = fs.readFileSync(file.path, 'utf8');
  
  if (!content.includes('QuoteSidebarWidget')) {
    content = content.replace("import CatalogueCard from '../components/CatalogueCard';", "import CatalogueCard from '../components/CatalogueCard';\nimport QuoteSidebarWidget from '../components/QuoteSidebarWidget';");
  }
  
  if (!content.includes('<QuoteSidebarWidget')) {
    content = content.replace(/((\s*)<\/div>\s*\{\/\* MAIN CONTENT GALLERY)/, "\n$2   <QuoteSidebarWidget sourcePage=\"" + file.name + "\" />\n$1");
  }
  
  fs.writeFileSync(file.path, content);
});
console.log('Quote widget applied to all pages.');
