import { apiClient } from '../api/client';

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
}

export const authService = {
  login: async (credentials: Record<string, string>): Promise<AuthResponse> => {
    await apiClient.post('/auth/login', credentials);
    const { data } = await apiClient.post('/auth/refresh-token', {});
    const accessToken = typeof data === 'string' ? data : data.accessToken;
    
    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
    }
    
    return { accessToken } as AuthResponse;
  },

  register: async (userData: Record<string, unknown>): Promise<void> => {
    await apiClient.post('/auth/register', userData);
  },

  logout: async (): Promise<void> => {
    localStorage.removeItem('accessToken');
    // If backend supported it, we'd clear the cookie here with a request.
  },

  getCurrentUser: () => {
    // Basic decode of JWT payload for mock purposes
    const token = localStorage.getItem('accessToken');
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        username: payload.sub || payload.unique_name || 'User',
      };
    } catch {
      return null;
    }
  }
};
