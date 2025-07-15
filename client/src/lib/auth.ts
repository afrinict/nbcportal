import { apiRequest } from './queryClient';
import { buildApiUrl } from './config';

export async function loginUser(email: string, password: string) {
  const response = await apiRequest('POST', buildApiUrl('/api/auth/login'), { email, password });
  return response.json();
}

export async function registerUser(userData: any) {
  const response = await apiRequest('POST', buildApiUrl('/api/auth/register'), userData);
  return response.json();
}

export async function getCurrentUser(token: string) {
  const response = await apiRequest('GET', '/api/auth/me');
  return response.json();
}

export async function checkAuthStatus() {
  const token = localStorage.getItem('token');
  if (!token) {
    return null;
  }
  
  try {
    const response = await apiRequest('GET', '/api/auth/me');
    return response.json();
  } catch (error) {
    // Token is invalid, remove it
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return null;
  }
}
