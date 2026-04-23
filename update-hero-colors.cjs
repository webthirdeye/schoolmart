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

  // Fix the container bg color
  content = content.replace(
    /className="(md:col-span-5|lg:col-span-5|flex-grow) (bg-white|bg-gray-50) (rounded-\[40px\].*?)"/g,
    'className="$1 $3" style={{ backgroundColor: heroBlock.bgColor || ( \'$2\' === \'bg-white\' ? \'#ffffff\' : \'#f9fafb\' ) }}'
  );

  // Fix H1
  content = content.replace(
    /className="(text-4xl[^"]*) text-gray-900 (uppercase[^"]*)"/g,
    'className="$1 $2" style={{ color: heroBlock.textColor || undefined }}'
  );

  // Fallback for H1 if text-gray-900 is at the end or somewhere else
  // Let's do a more generic replacement for the subtitle <p>
  content = content.replace(
    /<p className="text-gray-400 (text-\[[^\]]+\][^"]*)"(>|\s*dangerouslySetInnerHTML)/g,
    '<p style={{ color: heroBlock.textColor || undefined }} className={`$1 ${heroBlock.textColor ? \'opacity-80\' : \'text-gray-400\'}`}$2'
  );

  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`Updated ${file}`);
}
