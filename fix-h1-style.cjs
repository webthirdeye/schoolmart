const fs = require('fs');
const path = require('path');

const files = [
  'Sports.jsx',
  'Science.jsx',
  'SchoolDesigns.jsx',
  'Mathematics.jsx',
  'LabsLibraries.jsx',
  'Libraries.jsx',
  'Furniture.jsx',
  'DigitalInfra.jsx',
  'Architecture.jsx'
];

for (const file of files) {
  const filePath = path.join('d:/SchoolMart/src/pages', file);
  if (!fs.existsSync(filePath)) continue;

  let content = fs.readFileSync(filePath, 'utf-8');

  // Remove duplicate style={{ color: heroBlock.textColor || undefined }} 
  content = content.replace(
    /style=\{\{ color: heroBlock\.textColor \|\| undefined \}\} className="(.*?)" style=\{\{ color: heroBlock\.textColor \|\| undefined \}\}/g,
    'style={{ color: heroBlock.textColor || undefined }} className="$1"'
  );

  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`Updated ${file}`);
}
