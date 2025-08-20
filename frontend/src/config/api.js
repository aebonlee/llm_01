export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://llm-01.onrender.com'

export const API_ENDPOINTS = {
  CHAT: `${API_BASE_URL}/api/chat`,
  HEALTH: `${API_BASE_URL}/api/health`
}