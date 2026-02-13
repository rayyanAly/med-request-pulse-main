import { apiRequest } from './baseApi';
import { Product, ProductStock, Category } from './types';

/**
 * Fetch all products
 * GET /?c=products
 */
export const fetchProducts = async (filters?: {
  category?: number;
  limit?: number;
  page?: number;
}): Promise<{ success: number; error: string; data?: Product[] }> => {
  const params = new URLSearchParams();
  if (filters?.category) params.append('category', String(filters.category));
  if (filters?.limit) params.append('limit', String(filters.limit));
  if (filters?.page) params.append('page', String(filters.page));

  const query = params.toString();
  return apiRequest(`/?c=products${query ? `&${query}` : ''}`);
};

/**
 * Check product stock availability
 * GET /?c=products&m=showstock&sku=SKU
 */
export const checkProductStock = async (sku: string): Promise<{ success: number; error: string; data?: ProductStock }> => {
  return apiRequest(`/?c=products&m=showstock&sku=${sku}`);
};

/**
 * Fetch all categories
 * GET /?c=categories
 */
export const fetchCategories = async (): Promise<{ success: number; error: string; data?: Category[] }> => {
  return apiRequest('/?c=categories');
};
