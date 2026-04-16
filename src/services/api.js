// src/services/api.js
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

// ─── Auth ────────────────────────────────────────────────────────────────────
export const login = async (email, password) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) {
    const text = await res.text();
    let msg = 'Login failed';
    try { msg = JSON.parse(text).message || msg; } catch {}
    throw new Error(msg);
  }
  const data = await res.json();
  if (data.token) localStorage.setItem('token', data.token);
  return data;
};

export const register = async (name, email, password, phone, selectedServices = []) => {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ name, email, password, phone, selectedServices })
  });
  return await res.json();
};

export const verifyOtp = async (email, otp) => {
  const res = await fetch(`${API_URL}/auth/verify-otp`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ email, otp })
  });
  const data = await res.json();
  if (data.token) localStorage.setItem('token', data.token);
  return data;
};

export const getMe = async () => {
  const res = await fetch(`${API_URL}/auth/me`, { headers: getHeaders() });
  if (!res.ok) throw new Error('Unauthorized');
  const data = await res.json();
  return data.user ?? data; // return just the user object
};

export const forgotPassword = async (email) => {
  const res = await fetch(`${API_URL}/auth/forgot-password`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ email })
  });
  return await res.json();
};

export const resetPassword = async (email, otp, newPassword) => {
  const res = await fetch(`${API_URL}/auth/reset-password`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ email, otp, newPassword })
  });
  return await res.json();
};

export const resendOtp = async (email) => {
  const res = await fetch(`${API_URL}/auth/resend-otp`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ email })
  });
  return await res.json();
};

// ─── Products ────────────────────────────────────────────────────────────────
export const getProducts = async (params = {}) => {
  const res = await fetch(`${API_URL}/products`);
  const data = await res.json();

  let filtered = [...data];

  if (params.category) {
    const target = params.category.toUpperCase();
    filtered = filtered.filter(p => {
      // Check direct string field first (saved by CMS admin UI)
      if (p.category?.toUpperCase() === target) return true;
      // Fallback: check relational Category association
      const catName = p.Category?.name?.toUpperCase() || '';
      const parentName = p.Category?.parent?.name?.toUpperCase() || '';
      return catName === target || parentName === target;
    });
  }

  return filtered.map(p => ({
    ...p,
    title: p.name,
    // Use the direct image field first, then fall back to images array
    image: p.image || p.images?.[0] || 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&q=80',
    images: p.images?.length ? p.images : (p.image ? [p.image] : []),
    // Use direct string category/subcategory first, fall back to relational
    category: p.category || p.Category?.parent?.name || p.Category?.name || '',
    subcategory: p.subcategory || (p.Category?.parentId ? p.Category?.name : '') || '',
  }));
};

export const getProduct = async (id) => {
  const res = await fetch(`${API_URL}/products/${id}`);
  return await res.json();
};

export const createProduct = async (data) => {
  const res = await fetch(`${API_URL}/products`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data)
  });
  return await res.json();
};

export const updateProduct = async (id, data) => {
  const res = await fetch(`${API_URL}/products/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data)
  });
  return await res.json();
};

export const deleteProduct = async (id) => {
  const res = await fetch(`${API_URL}/products/${id}`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  return await res.json();
};

export const bulkRenameSubcategory = async (category, oldSubcategory, newSubcategory) => {
  const res = await fetch(`${API_URL}/products/bulk-rename-subcategory`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify({ category, oldSubcategory, newSubcategory })
  });
  return await res.json();
};

// ─── CMS Pages ───────────────────────────────────────────────────────────────
export const getPage = async (slug) => {
  const res = await fetch(`${API_URL}/cms/pages/${slug}`, {
    headers: getHeaders()
  });
  const data = await res.json();
  // Transform the blockMap back to an array for the CMSEditor component
  const blocksArray = data.blocks ? Object.values(data.blocks) : [];
  return { ...data.page, blocks: blocksArray };
};

export const getAllPages = async () => {
  const res = await fetch(`${API_URL}/cms/pages`, {
    headers: getHeaders()
  });
  return await res.json();
};

export const deletePage = async (slug) => {
  const res = await fetch(`${API_URL}/cms/pages/${slug}`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  return await res.json();
};

// ─── CMS Blocks ──────────────────────────────────────────────────────────────
export const updatePage = async (slug, data) => ({ message: 'Updated' });

export const updateBlock = async (id, data) => {
  const res = await fetch(`${API_URL}/cms/blocks`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify({ id, data })
  });
  return await res.json();
};

export const addBlock = async (pageSlug, key, type, data = {}) => {
  const res = await fetch(`${API_URL}/cms/blocks`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ pageSlug, key, type, data })
  });
  return await res.json();
};

export const deleteBlock = async (blockId) => {
  const res = await fetch(`${API_URL}/cms/blocks/${blockId}`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  return await res.json();
};

export const standardizeAllBlocks = async () => ({ message: 'Standardized' });

// ─── File Uploads ─────────────────────────────────────────────────────────────
export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${API_URL}/upload`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    body: formData
  });
  return await res.json();
};

export const bulkUploadFiles = async (files) => {
  const formData = new FormData();
  files.forEach(f => formData.append('files', f));
  const res = await fetch(`${API_URL}/upload/bulk`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    body: formData
  });
  if (!res.ok) {
    const text = await res.text();
    try { const j = JSON.parse(text); throw new Error(j.message || 'Upload failed'); } catch(e) { if (e.message) throw e; throw new Error('Upload failed (server error)'); }
  }
  return await res.json();
};

// ─── Site Settings ────────────────────────────────────────────────────────────
export const getSetting = async (key) => {
  const res = await fetch(`${API_URL}/settings`, { headers: getHeaders() });
  const all = await res.json();
  const found = (Array.isArray(all) ? all : []).find(s => s.key === key);
  return found?.data || {};
};

export const getAllSettings = async () => {
  const res = await fetch(`${API_URL}/settings`, { headers: getHeaders() });
  return await res.json();
};

export const updateSetting = async (key, data) => {
  const res = await fetch(`${API_URL}/settings`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ key, data })
  });
  return await res.json();
};

// ─── Quotes / Inquiries ───────────────────────────────────────────────────────
export const submitQuote = async (data) => submitContact(data);

export const getQuotes = async () => {
  const res = await fetch(`${API_URL}/contact`, { headers: getHeaders() });
  const json = await res.json();
  return json.data || json || [];
};

export const updateQuoteStatus = async (id, status) => {
  const res = await fetch(`${API_URL}/contact/${id}/status`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify({ status })
  });
  return await res.json();
};

export const deleteQuote = async (id) => {
  const res = await fetch(`${API_URL}/contact/${id}`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  return await res.json();
};

// ─── Contacts ─────────────────────────────────────────────────────────────────
export const submitContact = async (data) => {
  const res = await fetch(`${API_URL}/contact`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data)
  });
  return await res.json();
};

export const getContacts = async () => {
  const res = await fetch(`${API_URL}/contact`, { headers: getHeaders() });
  const json = await res.json();
  return json.data || json || [];
};

export const updateContactStatus = async (id, status) => {
  const res = await fetch(`${API_URL}/contact/${id}/status`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify({ status })
  });
  return await res.json();
};

export const deleteContact = async (id) => {
  const res = await fetch(`${API_URL}/contact/${id}`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  return await res.json();
};

// ─── Form Config ───────────────────────────────────────────────────────────────
export const getFormConfig = async (slug) => ({ slug, fields: [] });
export const updateFormConfig = async (slug, data) => ({ message: 'Updated' });

// ─── User Management ──────────────────────────────────────────────────────────
export const getUsers = async (params = {}) => [];
export const getUser = async (id) => ({});
export const updateUser = async (id, data) => ({ message: 'Updated' });
export const deleteUser = async (id) => ({ message: 'Deleted' });
export const getUsersExportUrl = () => '#';
