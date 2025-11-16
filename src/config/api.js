// API Configuration
// This file handles dynamic API URL configuration for different environments

// Get API base URL from environment variable or use default
// In production, set REACT_APP_API_URL environment variable
// For development, it defaults to localhost:8000
const getApiBaseUrl = () => {
  // Check if we're in production (built app)
  if (process.env.NODE_ENV === 'production') {
    // In production, use environment variable or relative URL
    // If REACT_APP_API_URL is set, use it
    if (process.env.REACT_APP_API_URL) {
      return process.env.REACT_APP_API_URL;
    }
    // Otherwise, use relative URL (same origin)
    // This works when frontend and backend are on the same domain
    return '';
  }
  
  // In development, use localhost or environment variable
  return process.env.REACT_APP_API_URL || 'http://localhost:8000';
};

// Export the API base URL
export const API_BASE_URL = getApiBaseUrl();

// Helper function to build full API endpoint URLs
export const getApiUrl = (endpoint) => {
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  
  // If API_BASE_URL is empty (production, same origin), use relative path
  if (!API_BASE_URL) {
    return `/api/${cleanEndpoint}`;
  }
  
  // Otherwise, combine base URL with endpoint
  return `${API_BASE_URL}/api/${cleanEndpoint}`;
};

// Export specific API endpoints
export const API_ENDPOINTS = {
  CHATBOT: getApiUrl('chatbot/'),
  SCANNER: getApiUrl('scanner/'),
};

export default {
  API_BASE_URL,
  getApiUrl,
  API_ENDPOINTS,
};

