const fs = require('fs');
const path = require('path');

const dir = path.join('d:', 'SchoolMart', 'src', 'pages');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx'));

files.forEach(f => {
  const filepath = path.join(dir, f);
  const content = fs.readFileSync(filepath, 'utf8');

  const targetLine = '  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center font-black uppercase tracking-widest text-sm-blue text-[12px]">Loading...</div>;';

  if (content.includes(targetLine)) {
    // 1. Remove the line from its current place
    let cleanContent = content.replace(targetLine + '\n', '');
    // Or if \r\n
    cleanContent = cleanContent.replace(targetLine + '\r\n', '');
    cleanContent = cleanContent.replace(targetLine, ''); // fallback

    // 2. Find the position of 'return (' which begins the main UI render
    // Since we need to place the loading block before the main return.
    // Some files might have early returns inside hooks, so we look for "return (" with standard component spacing.
    
    // We can confidently place it just before the LAST `return (` or `return <` in the file?
    // Let's use a regex to place it before `return (` that is indented 2 or 4 spaces.
    let lines = cleanContent.split('\n');
    let injectIdx = -1;
    for (let i = lines.length - 1; i >= 0; i--) {
       if (/^\s*return\s*\(/.test(lines[i]) || /^\s*return\s*<[A-Za-z]/.test(lines[i])) {
           injectIdx = i;
           break;
       }
    }

    if (injectIdx !== -1) {
       lines.splice(injectIdx, 0, targetLine);
       fs.writeFileSync(filepath, lines.join('\n'), 'utf8');
       console.log('Fixed hooks for ' + f);
    } else {
       console.log('Could not find return statement in ' + f);
    }
  }
});
