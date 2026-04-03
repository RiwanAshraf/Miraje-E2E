import { getIdToken } from "./auth";
import { API_BASE } from "../config/analysisConfig";

/* ── Authenticated fetch helper ── */
async function authFetch(url, options = {}) {
  const token = await getIdToken();
  const headers = {
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(err.error || `Request failed: ${response.status}`);
  }
  return response.json();
}

/* ── Image prediction ── */
export async function predictImage(file) {
  const formData = new FormData();
  formData.append("image", file);
  return authFetch(`${API_BASE}/predict-image`, { method: "POST", body: formData });
}

/* ── Audio prediction ── */
export async function predictAudio(file) {
  const formData = new FormData();
  formData.append("audio", file);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60000);
  try {
    const result = await authFetch(`${API_BASE}/predict-audio`, {
      method: "POST",
      body: formData,
      signal: controller.signal,
    });
    return result;
  } finally {
    clearTimeout(timeout);
  }
}

/* ── Signature prediction ── */
export async function predictSignature(file) {
  const formData = new FormData();
  formData.append("signature", file);
  return authFetch(`${API_BASE}/predict-signature`, { method: "POST", body: formData });
}

/* ── Verify user token with backend ── */
export async function verifyToken() {
  return authFetch(`${API_BASE}/auth/me`);
}
