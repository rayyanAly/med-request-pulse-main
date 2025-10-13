import { apiRequest } from './baseApi';
import { LoginRequest, LoginResponse } from './types';

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const formData = new URLSearchParams();
  formData.append('user_name', data.username);
  formData.append('password', data.password);

  return apiRequest('/?c=partners&m=login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData.toString(),
  });
};

export const logout = async (): Promise<any> => {
  const formData = new URLSearchParams();
  // Assuming email is needed, but since user is logged in, perhaps from state
  // For now, simple
  return apiRequest('/?c=customers&m=logout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData.toString(),
  });
};