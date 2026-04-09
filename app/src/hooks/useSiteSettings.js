// src/hooks/useSiteSettings.js
import { useState, useEffect } from 'react';
import { getSetting } from '../services/api';

const cache = {};

export function useSiteSettings(key, fallback = {}) {
  const [data, setData] = useState(cache[key] || null);
  const [loading, setLoading] = useState(!cache[key]);

  useEffect(() => {
    if (cache[key]) {
      setData(cache[key]);
      setLoading(false);
      return;
    }

    getSetting(key)
      .then(res => {
        const settingsData = res.data || {};
        cache[key] = settingsData;
        setData(settingsData);
      })
      .catch(() => setData(fallback))
      .finally(() => setLoading(false));
  }, [key]);

  return { data: data || fallback, loading };
}
