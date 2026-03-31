const fs = require('fs');
const path = require('path');

const PAGES_DIR = path.join(__dirname, '../../app/src/pages');
const TARGET_FILES = [
  'Architecture.jsx',
  'DigitalInfra.jsx',
  'Furniture.jsx',
  'LabsLibraries.jsx',
  'Libraries.jsx',
  'Mathematics.jsx',
  'SchoolDesigns.jsx',
  'Science.jsx',
  'Sports.jsx'
];

const RESOURCE_JSX = `
                 {/* Dynamic Resources & Trending Blocks */}
                 {blocks?.sidebar_resources?.data?.items?.length > 0 && (
                    <div className="mt-8 p-6 bg-white rounded-[25px] border border-gray-200 shadow-sm">
                       <span className="text-[8px] font-black text-gray-400 tracking-[0.2em] uppercase mb-4 block">Resources</span>
                       <div className="space-y-3">
                          {blocks.sidebar_resources.data.items.map((item, i) => (
                             <div key={i} className="flex items-center gap-3">
                                <FileText size={14} className="text-blue-600" />
                                <span className="text-[9px] font-black uppercase text-gray-900 leading-tight">{item}</span>
                             </div>
                          ))}
                       </div>
                    </div>
                 )}
                 {blocks?.sidebar_trending?.data?.items?.length > 0 && (
                    <div className="mt-4 p-6 bg-gray-900 rounded-[25px] border border-gray-800 shadow-xl">
                       <span className="text-[8px] font-black text-blue-400 tracking-[0.2em] uppercase mb-4 block">Trending Now</span>
                       <div className="space-y-3">
                          {blocks.sidebar_trending.data.items.map((item, i) => (
                             <div key={i} className="flex items-center gap-3">
                                <Stars size={14} className="text-yellow-400" />
                                <span className="text-[9px] font-black uppercase text-white leading-tight">{item}</span>
                             </div>
                          ))}
                       </div>
                    </div>
                 )}`;

TARGET_FILES.forEach(filename => {
  const filePath = path.join(PAGES_DIR, filename);
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Fix Array Mappings (e.g. compositeItems.map -> filteredItems.map)
  // We look for .map((work, i) or .map((item, i) inside the main grid section
  content = content.replace(/\{(compositeItems|sportsWorks|designWorks|mathItems|sportsItems)\.map/g, '{filteredItems.map');

  // 2. Fix the slicing logic for InlineQuickView if it uses the old array name
  content = content.replace(/(compositeItems|sportsWorks|designWorks|mathItems|sportsItems)\.slice/g, 'filteredItems.slice');
  content = content.replace(/(compositeItems|sportsWorks|designWorks|mathItems|sportsItems)\.some/g, 'filteredItems.some');
  content = content.replace(/(compositeItems|sportsWorks|designWorks|mathItems|sportsItems)\.length/g, 'filteredItems.length');

  // 3. Ensure work.name and work.subcategory are used instead of work.title/cat if still present
  content = content.replace(/\{work\.title\}/g, '{work.name}');
  content = content.replace(/\{work\.cat\}/g, '{work.subcategory}');
  content = content.replace(/alt=\{work\.title\}/g, 'alt={work.name}');

  // 4. Inject Resource/Trending Blocks into the Sidebar
  // We find the end of the sidebar category mapping or the compliance block
  // A good insertion point is right before the </aside> or after the last sidebar block
  if (!content.includes('sidebar_resources')) {
     const asideEnd = content.lastIndexOf('</aside>');
     if (asideEnd !== -1) {
        content = content.slice(0, asideEnd) + RESOURCE_JSX + content.slice(asideEnd);
     }
  }

  // 5. Remove Highlight Filtering (ensure all categories show with fallbacks)
  content = content.replace(/\{cats\.filter\(c => c\.img \|\| c\.description\)\.map/g, '{cats.map');

  fs.writeFileSync(filePath, content);
  console.log(`✅ Patched ${filename}`);
});
