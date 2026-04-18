/**
 * Formats image URLs to ensure they load correctly in the browser.
 * Specifically handles Google Drive 'view' links and converts them to 'uc' (export) links.
 */
export const formatImgUrl = (url) => {
  const FALLBACK = 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800'; 
  if (!url || typeof url !== 'string' || !url.trim()) return FALLBACK;
  
  let cleanUrl = url.trim().replace(/^["']|["']$/g, '');

  // 1. Force all internal /uploads/ paths to use the production backend URL if not on localhost
  const isLocal = window.location.hostname === 'localhost';
  const PRODUCTION_BACKEND = 'https://schoolmart-production.up.railway.app';

  if (cleanUrl.includes('/uploads/')) {
    if (!isLocal) {
       // On Vercel, always force images to Railway
       const filename = cleanUrl.split('/uploads/').pop();
       return `${PRODUCTION_BACKEND}/uploads/${filename}`;
    } else if (cleanUrl.includes('localhost:5000')) {
       // Keep localhost working for local dev
       return cleanUrl;
    } else if (cleanUrl.startsWith('/uploads/')) {
       // If relative path on local, prefix with localhost:5000
       return `http://localhost:5000${cleanUrl}`;
    }
  }

  // 2. Handle Google Drive file links
  if (cleanUrl.includes('drive.google.com')) {
    const idMatch = cleanUrl.match(/\/file\/d\/([^/]+)\//) || cleanUrl.match(/id=([^&]+)/);
    if (idMatch && idMatch[1]) {
      return `https://drive.google.com/uc?export=view&id=${idMatch[1]}`;
    }
  }

  return cleanUrl || FALLBACK;
};
