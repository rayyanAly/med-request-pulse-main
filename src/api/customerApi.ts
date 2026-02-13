import { apiRequest } from './baseApi';
import { Customer, RegisterCustomerRequest, RegisterCustomerResponse } from './types';

/**
 * Fetch all customers
 * GET /?c=customers
 */
export const fetchCustomers = async (filters?: {
  limit?: number;
  page?: number;
}): Promise<{ success: number; error: string; data?: Customer[] }> => {
  const params = new URLSearchParams();
  if (filters?.limit) params.append('limit', String(filters.limit));
  if (filters?.page) params.append('page', String(filters.page));

  const query = params.toString();
  return apiRequest(`/?c=customers${query ? `&${query}` : ''}`);
};

/**
 * Fetch single customer by ID
 * GET /?c=customers&id=CUSTOMER_ID
 */
export const fetchCustomer = async (customerId: string): Promise<any> => {
  return apiRequest(`/?c=customers&id=${customerId}`);
};

/**
 * Register new customer
 * POST /?c=customers&m=register
 */
export const registerCustomer = async (
  data: RegisterCustomerRequest
): Promise<{ success: number; error: string; data?: RegisterCustomerResponse }> => {
  const formData = new URLSearchParams();
  formData.append('first_name', data.first_name);
  formData.append('last_name', data.last_name);
  formData.append('password', data.password);
  formData.append('confirm_password', data.confirm_password);
  formData.append('contact_number', data.contact_number);
  if (data.email) formData.append('email', data.email);

  return apiRequest('/?c=customers&m=register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData.toString(),
  });
};

/**
 * Customer login
 * POST /?c=customers&m=login
 */
export const customerLogin = async (
  username: string,
  password: string
): Promise<any> => {
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
 * Customer logout
 * POST /?c=customers&m=logout
 */
export const customerLogout = async (): Promise<any> => {
  return apiRequest('/?c=customers&m=logout', {
    method: 'POST',
  });
};
