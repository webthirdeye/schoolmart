const fs = require('fs');
const path = require('path');

const dir = path.join('d:', 'SchoolMart', 'src', 'pages');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx'));

files.forEach(f => {
  const filepath = path.join(dir, f);
  const content = fs.readFileSync(filepath, 'utf8');
  if (content.includes('const { blocks, loading } = useCMSPage') && !content.includes('if (loading)')) {
    const lines = content.split('\n');
    const newLines = [];
    lines.forEach(line => {
      newLines.push(line);
      if (line.includes('const { blocks, loading } = useCMSPage')) {
        newLines.push('  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center font-black uppercase tracking-widest text-sm-blue text-[12px]">Loading...</div>;');
      }
    });
    fs.writeFileSync(filepath, newLines.join('\n'), 'utf8');
    console.log('Updated ' + f);
  }
});
