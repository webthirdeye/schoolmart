// src/hooks/useCMSBlock.js
// Custom hook that fetches a specific block from a CMS page
import { useState, useEffect } from 'react';
import { getPage } from '../services/api';

const cache = {};

// Call this after any admin save to force a fresh fetch on next page visit
export function clearCMSCache(slug) {
  if (slug) {
    delete cache[slug];
  } else {
    Object.keys(cache).forEach(k => delete cache[k]);
  }
}

export function useCMSPage(slug) {
  const [blocks, setBlocks] = useState(cache[slug] || null);
  const [loading, setLoading] = useState(!cache[slug]);

  useEffect(() => {
    if (cache[slug]) { setBlocks(cache[slug]); setLoading(false); return; }
    getPage(slug)
      .then(page => {
        const indexed = {};
        (page.blocks || []).forEach(b => {
          if (b.isVisible !== false) indexed[b.blockType] = b.data;
        });
        cache[slug] = indexed;
        setBlocks(indexed);
      })
      .catch(() => setBlocks({}))
      .finally(() => setLoading(false));
  }, [slug]);

  return { blocks, loading };
}

export function useCMSBlock(slug, blockType, fallback = {}) {
  const { blocks, loading } = useCMSPage(slug);
  const data = blocks?.[blockType];
  return { data: data ?? fallback, loading };
}
