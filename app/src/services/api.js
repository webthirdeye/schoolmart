// src/services/api.js
// Centralized Axios-like fetch helper for backend communication
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('token');

const request = async (method, path, body) => {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);

  const res = await fetch(`${BASE_URL}${path}`, options);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
};

// ─── Auth ───────────────────────────────────
export const login = (email, password) => request('POST', '/auth/login', { email, password });
export const register = (name, email, password, role) => request('POST', '/auth/register', { name, email, password, role });
export const verifyOtp = (email, otp) => request('POST', '/auth/verify-otp', { email, otp });
export const resendOtp = (email) => request('POST', '/auth/resend-otp', { email });
export const getMe = () => request('GET', '/auth/me');

// ─── Utilities ──────────────────────────────
export const uploadFile = async (file) => {
  const token = getToken();
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${BASE_URL}/upload`, {
    method: 'POST',
    headers: token ? { 'Authorization': `Bearer ${token}` } : {},
    body: formData
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Upload failed');
  return data;
};

// ─── CMS ────────────────────────────────────
export const getPage = (slug) => request('GET', `/cms/${slug}`);
export const getAllPages = () => request('GET', '/cms');
export const updatePage = (slug, data) => request('PUT', `/cms/${slug}`, data);
export const updateBlock = (slug, blockId, data) => request('PATCH', `/cms/${slug}/block/${blockId}`, data);
export const addBlock = (slug, data) => request('POST', `/cms/${slug}/block`, data);
export const deleteBlock = (slug, blockId) => request('DELETE', `/cms/${slug}/block/${blockId}`);

// ─── Products ────────────────────────────────
export const getProducts = (params = {}) => {
  const qs = new URLSearchParams(params).toString();
  return request('GET', `/products${qs ? '?' + qs : ''}`);
};
export const getProduct = (id) => request('GET', `/products/${id}`);
export const createProduct = (data) => request('POST', '/products', data);
export const updateProduct = (id, data) => request('PUT', `/products/${id}`, data);
export const deleteProduct = (id) => request('DELETE', `/products/${id}`);

// ─── Quotes ──────────────────────────────────
export const submitQuote = (data) => request('POST', '/quotes', data);
export const getQuotes = (status) => request('GET', `/quotes${status ? '?status=' + status : ''}`);
export const updateQuoteStatus = (id, status) => request('PATCH', `/quotes/${id}/status`, { status });
export const deleteQuote = (id) => request('DELETE', `/quotes/${id}`);

// ─── Contacts ────────────────────────────────
export const submitContact = (data) => request('POST', '/contacts', data);
export const getContacts = () => request('GET', '/contacts');
export const updateContactStatus = (id, status) => request('PATCH', `/contacts/${id}/status`, { status });
export const deleteContact = (id) => request('DELETE', `/contacts/${id}`);
