/**
 * Formats image URLs to ensure they load correctly in the browser.
 * Specifically handles Google Drive 'view' links and converts them to 'uc' (export) links.
 */
export const formatImgUrl = (url) => {
  const FALLBACK = 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800'; 
  if (!url || typeof url !== 'string' || !url.trim()) return FALLBACK;
  
  let cleanUrl = url.trim().replace(/^["']|["']$/g, '');

  // 1. Force all internal /uploads/ paths to use the production backend URL if not on localhost
  const hostname = window.location.hostname;
  const isLocal = hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('192.168.') || hostname.endsWith('.local');
  const PRODUCTION_BACKEND = 'https://schoolmart-production.up.railway.app';

  // Fix: Force all railway.app links to HTTPS regardless of where they come from
  if (cleanUrl.includes('railway.app') && !cleanUrl.startsWith('https://')) {
    cleanUrl = cleanUrl.replace('http://', 'https://');
  }

  if (cleanUrl.includes('/uploads/') || cleanUrl.includes('localhost:5000')) {
    if (!isLocal) {
       // On Vercel, always force images to Railway HTTPS
       // Extract filename if it's a full URL or just the path
       const parts = cleanUrl.split('/uploads/');
       const filename = parts[parts.length - 1];
       return encodeURI(`${PRODUCTION_BACKEND}/uploads/${filename}`);
    } else {
       // On Local, ensure it points to local backend (port 5000)
       if (cleanUrl.startsWith('/uploads/')) {
         return encodeURI(`http://localhost:5000${cleanUrl}`);
       }
       // If it's already an absolute URL but maybe wrong host/protocol
       if (cleanUrl.includes('localhost:5000') || cleanUrl.includes('127.0.0.1:5000')) {
         return encodeURI(cleanUrl.replace('https://', 'http://'));
       }
    }
  }

  // 2. Handle Google Drive file links
  if (cleanUrl.includes('drive.google.com')) {
    const idMatch = cleanUrl.match(/\/file\/d\/([^/]+)\//) || cleanUrl.match(/id=([^&]+)/);
    if (idMatch && idMatch[1]) {
      return `https://drive.google.com/uc?export=view&id=${idMatch[1]}`;
    }
  }

  return cleanUrl ? encodeURI(cleanUrl) : FALLBACK;
};
