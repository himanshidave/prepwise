/*
  Tiny API helper: all backend calls go through here.
  Base URL comes from VITE_API_URL (see .env), falling back to the local
  dev backend on port 5000.
*/
export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000'

// apiFetch('/api/questions?category=react')  -> parsed JSON
// Attaches JSON headers, the saved auth token, and throws on non-2xx.
export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('prepwiseToken')

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  })

  let data = null
  try {
    data = await response.json()
  } catch {
    // non-JSON response (e.g. empty body)
  }

  if (!response.ok) {
    const message = data?.error || `Request failed (${response.status})`
    throw new Error(message)
  }
  return data
}
