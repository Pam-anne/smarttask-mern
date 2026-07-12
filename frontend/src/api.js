// Thin wrapper around fetch that talks to the SmartTask backend.
// The JWT (saved after login) is attached to every request so the
// protected task endpoints accept it.

// In development we use "/api" and let the Vite proxy forward to the backend.
// In production set VITE_API_URL to the deployed backend, e.g.
//   VITE_API_URL=https://smarttask-api.onrender.com/api
const BASE = import.meta.env.VITE_API_URL || "/api";

function getToken() {
  return localStorage.getItem("token");
}

async function request(path, { method = "GET", body } = {}) {
  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || "Request failed");
  }
  return data;
}

export const api = {
  register: (payload) =>
    request("/auth/register", { method: "POST", body: payload }),
  login: (payload) => request("/auth/login", { method: "POST", body: payload }),
  getTasks: (params = {}) => {
    // Drop empty values so we only send the filters the user actually set.
    const query = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== "" && v != null)
    ).toString();
    return request(`/tasks${query ? `?${query}` : ""}`);
  },
  createTask: (payload) =>
    request("/tasks", { method: "POST", body: payload }),
  updateTask: (id, payload) =>
    request(`/tasks/${id}`, { method: "PUT", body: payload }),
  deleteTask: (id) => request(`/tasks/${id}`, { method: "DELETE" }),
};
