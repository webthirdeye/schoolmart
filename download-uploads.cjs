const https = require('https');
const fs = require('fs');
const path = require('path');

// Your Railway Production URL
const url = 'https://schoolmart-production-2477.up.railway.app/api/upload/export';
const outputPath = path.join(__dirname, `schoolmart_uploads_${Date.now()}.tar.gz`);

console.log('🚀 Starting download from Railway Production...');
console.log(`📡 Connecting to: ${url}`);

const file = fs.createWriteStream(outputPath);

https.get(url, (response) => {
  if (response.statusCode !== 200) {
    console.error(`❌ Failed to download: Server returned ${response.statusCode}`);
    console.log('Check if your Railway server is awake and the /api/upload/export route is active.');
    return;
  }

  const totalSize = parseInt(response.headers['content-length'], 10);
  let downloadedSize = 0;

  response.on('data', (chunk) => {
    downloadedSize += chunk.length;
    if (totalSize) {
      const percent = ((downloadedSize / totalSize) * 100).toFixed(2);
      process.stdout.write(`\r📥 Downloading: ${percent}% (${(downloadedSize / 1024 / 1024).toFixed(2)} MB)`);
    } else {
      process.stdout.write(`\r📥 Downloading: ${(downloadedSize / 1024 / 1024).toFixed(2)} MB...`);
    }
  });

  response.pipe(file);

  file.on('finish', () => {
    file.close();
    console.log('\n\n✅ Download Complete!');
    console.log(`📦 File saved to: ${outputPath}`);
    console.log('--------------------------------------------------');
    console.log('💡 TIP: You can extract this .tar.gz file using:');
    console.log('   - WinRAR / 7-Zip');
    console.log('   - Windows 11 Explorer');
    console.log('   - Terminal: tar -xzf ' + path.basename(outputPath));
    console.log('--------------------------------------------------');
  });
}).on('error', (err) => {
  fs.unlink(outputPath, () => {}); 
  console.error(`\n❌ Error: ${err.message}`);
});
