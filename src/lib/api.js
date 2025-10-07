import axios from 'axios'

// Resolve base URL robustly, fixing cases like ':500' or '/api'
function resolveBaseURL() {
  const raw = (import.meta.env.VITE_API_BASE_URL || '').trim()
  if (!raw) return 'http://localhost:4000'
  // If someone set just a port like ':5000' or '5000'
  if (/^:?\d{2,5}$/.test(raw)) {
    const port = raw.replace(':', '')
    return `http://localhost:${port}`
  }
  // If it starts with '/' (path only)
  if (raw.startsWith('/')) {
    return `http://localhost:4000${raw}`
  }
  // Otherwise return as-is
  return raw
}

const resolvedBaseURL = resolveBaseURL()

export const api = axios.create({
  baseURL: resolvedBaseURL,
  timeout: 10000,
})


