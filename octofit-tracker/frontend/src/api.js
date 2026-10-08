// Set VITE_CODESPACE_NAME (e.g. in .env.local) to use the Codespaces API URL.
const codespaceName = import.meta.env.VITE_CODESPACE_NAME

export const apiBase = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : 'http://localhost:8000'

// Accepts both plain array responses and paginated ones ({ results: [...] }).
export function toList(data) {
  if (Array.isArray(data)) return data
  if (data && Array.isArray(data.results)) return data.results
  return []
}
