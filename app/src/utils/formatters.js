/**
 * Formats image URLs to ensure they load correctly in the browser.
 * Specifically handles Google Drive 'view' links and converts them to 'uc' (export) links.
 */
export const formatImgUrl = (url) => {
  const FALLBACK = 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800'; // Science lab/Furniture fallback
  if (!url || typeof url !== 'string' || !url.trim()) return FALLBACK;
  
  // Clean potential whitespace or extra quotes from CSV bulk loads
  let cleanUrl = url.trim().replace(/^["']|["']$/g, '');

  // Handle Google Drive file links
  if (cleanUrl.includes('drive.google.com')) {
    // Extract file ID from /file/d/ID/view or id=ID
    const idMatch = cleanUrl.match(/\/file\/d\/([^/]+)\//) || cleanUrl.match(/id=([^&]+)/);
    if (idMatch && idMatch[1]) {
      return `https://drive.google.com/uc?export=view&id=${idMatch[1]}`;
    }
  }

  return cleanUrl || FALLBACK;
};
