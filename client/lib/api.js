const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const getToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("rafeeq_token");
};

export const setToken = (token) => {
  if (typeof window === "undefined") return;
  if (token) localStorage.setItem("rafeeq_token", token);
  else localStorage.removeItem("rafeeq_token");
};

export const apiCall = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: options.method || "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  let data;
  try {
    data = await res.json();
  } catch (e) {
    data = {};
  }

  if (!res.ok) {
    const err = new Error(data.message || "Request failed");
    err.status = res.status;
    throw err;
  }
  return data;
};

export const apiUpload = async (endpoint, file, extra = {}) => {
  const token = getToken();
  const form = new FormData();
  form.append("audio", file);
  Object.entries(extra).forEach(([k, v]) => form.append(k, v));

  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: "POST",
    headers,
    body: form,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Upload failed");
  return data;
};

export { API_BASE };
