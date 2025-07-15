// API Configuration for different environments
const getApiBaseUrl = () => {
  // In development, use relative URLs (proxy to localhost:5000)
  if (import.meta.env.DEV) {
    return '';
  }
  
  // In production, use the deployed backend URL
  // You can set this via environment variable or use a default
  const backendUrl = import.meta.env.VITE_API_URL || 'https://your-backend-url.com';
  return backendUrl;
};

export const API_BASE_URL = getApiBaseUrl();

// Helper function to build full API URLs
export const buildApiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint}`;
}; 