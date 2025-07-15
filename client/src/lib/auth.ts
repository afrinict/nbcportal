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
  const response = await fetch(buildApiUrl('/api/auth/me'), {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to get current user');
  }
  
  return response.json();
}
