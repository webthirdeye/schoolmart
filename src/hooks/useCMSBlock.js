// src/hooks/useCMSBlock.js
// Custom hook that fetches a specific block from a CMS page
import { useState, useEffect } from 'react';
import { getPage } from '../services/api';

const cache = {};
let cacheVersion = 0;

// Call this after any admin save to force a fresh fetch on next page visit
export function clearCMSCache(slug) {
  cacheVersion++;
  if (slug) {
    delete cache[slug];
  } else {
    Object.keys(cache).forEach(k => delete cache[k]);
  }
}

export function useCMSPage(slug) {
  const [blocks, setBlocks] = useState(cache[slug]?.data || null);
  const [loading, setLoading] = useState(!cache[slug]);
  const [ver, setVer] = useState(cacheVersion);

  useEffect(() => {
    // Re-fetch when cache is cleared (version changed) or first load
    if (cache[slug] && cache[slug].version === cacheVersion) {
      setBlocks(cache[slug].data);
      setLoading(false);
      return;
    }
    setLoading(true);
    getPage(slug)
      .then(page => {
        const indexed = {};
        (page.blocks || []).forEach(b => {
          if (b.isVisible !== false) {
            // Index by BOTH key and type so lookups work either way
            indexed[b.key] = b.data;
            if (b.type && b.type !== b.key) {
              indexed[b.type] = b.data;
            }
          }
        });
        cache[slug] = { data: indexed, version: cacheVersion };
        setBlocks(indexed);
      })
      .catch(() => setBlocks({}))
      .finally(() => setLoading(false));
  }, [slug, cacheVersion]);

  return { blocks, loading };
}

export function useCMSBlock(slug, blockType, fallback = {}) {
  const { blocks, loading } = useCMSPage(slug);
  const data = blocks?.[blockType];
  return { data: data ?? fallback, loading };
}

export function useFormConfig(slug) {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    import('../services/api').then(api => {
      api.getFormConfig(slug)
        .then(res => setConfig(res))
        .catch(() => setConfig(null))
        .finally(() => setLoading(false));
    });
  }, [slug]);

  return { config, loading };
}
