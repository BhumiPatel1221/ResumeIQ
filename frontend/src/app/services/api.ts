/**
 * ResumeIQ — API Service
 * Centralised HTTP client for all backend API calls.
 */

const API_BASE = 'http://localhost:5000/api';

// ---------- Helper: get stored auth token ----------
const getToken = (): string | null => localStorage.getItem('resumeiq_token');

// ---------- Helper: build headers ----------
const authHeaders = (extra: Record<string, string> = {}): Record<string, string> => {
  const headers: Record<string, string> = { ...extra };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

// ---------- Helper: handle response ----------
const handleResponse = async (res: Response) => {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  return data;
};

// ==================== AUTH ====================

export const registerUser = async (name: string, email: string, password: string) => {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  return handleResponse(res);
};

export const loginUser = async (email: string, password: string) => {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(res);
};

// ==================== RESUME ====================

export const uploadResume = async (file: File) => {
  const formData = new FormData();
  formData.append('resume', file);

  const res = await fetch(`${API_BASE}/resume/upload`, {
    method: 'POST',
    headers: authHeaders(),
    body: formData,
  });
  return handleResponse(res);
};

// ==================== ANALYSIS ====================

export const runAnalysis = async (resumeId: string, jobDescription: string) => {
  const res = await fetch(`${API_BASE}/analyze`, {
    method: 'POST',
    headers: authHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ resumeId, jobDescription }),
  });
  return handleResponse(res);
};

export const getAnalysisHistory = async (page = 1, limit = 10) => {
  const res = await fetch(`${API_BASE}/analysis/history?page=${page}&limit=${limit}`, {
    headers: authHeaders(),
  });
  return handleResponse(res);
};

export const getAnalysisById = async (id: string) => {
  const res = await fetch(`${API_BASE}/analysis/${id}`, {
    headers: authHeaders(),
  });
  return handleResponse(res);
};

// ==================== TOKEN MANAGEMENT ====================

export const saveAuth = (token: string, user: { id: string; name: string; email: string }) => {
  localStorage.setItem('resumeiq_token', token);
  localStorage.setItem('resumeiq_user', JSON.stringify(user));
};

export const getStoredUser = () => {
  const raw = localStorage.getItem('resumeiq_user');
  return raw ? JSON.parse(raw) : null;
};

export const clearAuth = () => {
  localStorage.removeItem('resumeiq_token');
  localStorage.removeItem('resumeiq_user');
};

export const isAuthenticated = (): boolean => !!getToken();
