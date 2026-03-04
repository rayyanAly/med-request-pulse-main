import { apiRequest } from './baseApi';

export interface PartnerUser {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  user_type: string;
  user_name: string;
  status: string;
}

export interface CreatePartnerUserRequest {
  full_name: string;
  email: string;
  phone: string;
  username: string;
  password: string;
  position: number;
}

export interface UpdatePartnerUserRequest {
  id: string;
  full_name?: string;
  email?: string;
  phone?: string;
  username?: string;
  password?: string;
  position?: number;
}

/**
 * Fetch all partner users
 * GET /?c=partners&m=users
 */
export const fetchPartnerUsers = async (): Promise<{ success: number; error: string; data?: PartnerUser[] }> => {
  return apiRequest('/?c=partners&m=users');
};

/**
 * Fetch single partner user by ID
 * GET /?c=partners&m=users&id=USER_ID
 */
export const fetchPartnerUser = async (userId: string): Promise<{ success: number; error: string; data?: PartnerUser }> => {
  return apiRequest(`/?c=partners&m=users&id=${userId}`);
};

/**
 * Create new partner user
 * POST /?c=partners&m=users
 */
export const createPartnerUser = async (
  data: CreatePartnerUserRequest
): Promise<{ success: number; error: string; data?: any }> => {
  const formData = new URLSearchParams();
  formData.append('full_name', data.full_name);
  formData.append('email', data.email);
  formData.append('phone', data.phone);
  formData.append('username', data.username);
  formData.append('password', data.password);
  formData.append('position', String(data.position));

  return apiRequest('/?c=partners&m=users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData.toString(),
  });
};

/**
 * Update existing partner user
 * POST /?c=partners&m=users (with id field)
 */
export const updatePartnerUser = async (
  data: UpdatePartnerUserRequest
): Promise<{ success: number; error: string; data?: any }> => {
  const formData = new URLSearchParams();
  formData.append('id', data.id);
  
  if (data.full_name !== undefined) {
    formData.append('full_name', data.full_name);
  }
  if (data.email !== undefined) {
    formData.append('email', data.email);
  }
  if (data.phone !== undefined) {
    formData.append('phone', data.phone);
  }
  if (data.username !== undefined) {
    formData.append('username', data.username);
  }
  if (data.password) {
    formData.append('password', data.password);
  }
  if (data.position !== undefined) {
    formData.append('position', String(data.position));
  }

  return apiRequest('/?c=partners&m=users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData.toString(),
  });
};

/**
 * Delete partner user
 * POST /?c=partners&m=users (with action: 'delete')
 */
export const deletePartnerUser = async (
  userId: string
): Promise<{ success: number; error: string; data?: any }> => {
  const formData = new URLSearchParams();
  formData.append('id', userId);
  formData.append('action', 'delete');

  return apiRequest('/?c=partners&m=users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData.toString(),
  });
};
