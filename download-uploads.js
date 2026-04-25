const https = require('https');
const fs = require('fs');

// The backend URL on Railway (change this if your Railway URL is different)
const backendUrl = 'https://schoolmart-backend.up.railway.app/api/uploads/export'; // Assuming this is the URL, or they can use their vercel one if routed.

console.log('Please open your browser and go to the following URL to download your uploads:');
console.log('https://schoolmart-ashen.vercel.app/api/uploads/export'); // Wait, Vercel routes to the backend!
