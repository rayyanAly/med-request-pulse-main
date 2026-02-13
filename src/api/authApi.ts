import { apiRequest } from './baseApi';
import { LoginRequest, LoginResponse } from './types';

/**
 * Partner login
 * POST /?c=partners&m=login
 * 
 * Required: user_name, password
 * Returns: partner_session, partner_id, partner_ref_id
 */
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

/**
 * Generate session token using partner credentials
 * GET /session
 * 
 * Requires X-Partner-Id and X-Security-Code headers
 * Alternative to login for session-based auth
 */
export const generateSession = async (): Promise<{ data?: { session: string } }> => {
  return apiRequest('/session');
};

/**
 * Customer login
 * POST /?c=customers&m=login
 */
export const customerLogin = async (username: string, password: string): Promise<any> => {
  const formData = new URLSearchParams();
  formData.append('username', username);
  formData.append('password', password);

  return apiRequest('/?c=customers&m=login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData.toString(),
  });
};

/**
 * Logout
 * POST /?c=customers&m=logout
 */
export const logout = async (): Promise<any> => {
  return apiRequest('/?c=customers&m=logout', {
    method: 'POST',
  });
};
