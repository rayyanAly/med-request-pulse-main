import { apiRequest } from './baseApi';
import { ProductsResponse, SingleProductResponse } from './types';

export const fetchProducts = async (): Promise<ProductsResponse> => {
  return apiRequest('/?c=products');
};

export const fetchProductById = async (productId: number): Promise<SingleProductResponse> => {
  return apiRequest(`/?c=products&id=${productId}`);
};
