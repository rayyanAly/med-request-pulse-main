import { apiRequest } from './baseApi';
import { CreateOrderRequest, ApiResponse, CartItem } from './types';

// Use proxy path in dev, direct URL in prod
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://800pharmacy.ae/api_panel/v2';
const PROXY_URL = import.meta.env.DEV ? '/api/api_panel/v2' : API_BASE_URL;

export const fetchOrders = async (): Promise<any> => {
  return apiRequest('/?c=orders&m=index');
};

export const fetchSingleOrder = async (orderId: string): Promise<any> => {
  return apiRequest(`/?c=orders&m=index&id=${orderId}`);
};

// Direct API call for order creation - uses query params format
export const createOrderDirect = async (orderData: CreateOrderRequest, files: File[] = []): Promise<ApiResponse<any>> => {
  const formData = new FormData();

  // Required fields
  formData.append('first_name', String(orderData.first_name || ''));
  formData.append('last_name', String(orderData.last_name || ''));
  formData.append('contact_number', String(orderData.contact_number || ''));
  formData.append('building', String(orderData.building || ''));
  formData.append('unit', String(orderData.unit || ''));

  // Products - convert CartItem[] to backend format {sku, qty}
  const productsArray = orderData.products.map((p: CartItem) => ({
    sku: String(p.sku),
    qty: Number(p.qty)
  }));
  
  console.log('Products being sent:', JSON.stringify(productsArray));
  formData.append('products', JSON.stringify(productsArray));

  // Payment method
  if (orderData.payment_method) {
    formData.append('payment_method', String(orderData.payment_method));
  }

  // Insurance and Prescription flags
  formData.append('with_insurance', orderData.with_insurance ? '1' : '0');
  formData.append('with_prescription', orderData.with_prescription ? '1' : '0');

  // Optional fields
  if (orderData.eid_no) {
    formData.append('eid_no', String(orderData.eid_no));
  }
  if (orderData.erx) {
    formData.append('erx', String(orderData.erx));
  }
  if (orderData.notes) {
    formData.append('notes', String(orderData.notes));
  }

  // Add files for prescription uploads
  if (files.length > 0) {
    files.forEach((file, index) => {
      formData.append(`file_${index}`, file);
    });
  }

  // Use query params format: api_panel/v2/?c=orders&m=create
  const url = `${PROXY_URL}/?c=orders&m=create`;
  console.log('Submitting order to:', url);

  // Get auth headers - use the same format as baseApi
  const partnerId = localStorage.getItem('partner_id') || import.meta.env.VITE_PARTNER_ID || '';
  const refId = localStorage.getItem('partner_ref_id') || import.meta.env.VITE_REF_ID || '';
  const sessionToken = localStorage.getItem('session_token');
  const securityCode = localStorage.getItem('security_code') || 
                       import.meta.env.VITE_SECURITY_CODE || 
                       import.meta.env.VITE_PARTNER_SECRET || '';

  console.log('Partner ID:', partnerId);
  console.log('Ref ID:', refId);
  console.log('Session Token:', sessionToken ? '***' : 'not set');
  console.log('Security Code:', securityCode ? '***' : 'not set');

  const headers: Record<string, string> = {
    'X-Partner-Id': partnerId,
    'X-Ref-Id': refId,
  };

  // Try X-Session first (what original code used), then X-Security-Code
  if (sessionToken) {
    headers['X-Session'] = sessionToken;
    console.log('Using X-Session header');
  } else if (securityCode) {
    headers['X-Security-Code'] = securityCode;
    console.log('Using X-Security-Code header');
  }

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: formData,
  });

  console.log('Response status:', response.status);

  const data = await response.json();
  console.log('Response data:', data);

  if (!response.ok) {
    throw new Error(data.message || `API request failed (status: ${response.status})`);
  }

  return data;
};

// Legacy function - uses baseApi
export const createOrder = async (orderData: CreateOrderRequest, files: File[] = []): Promise<ApiResponse<any>> => {
  const formData = new FormData();

  formData.append('first_name', String(orderData.first_name || ''));
  formData.append('last_name', String(orderData.last_name || ''));
  formData.append('contact_number', String(orderData.contact_number || ''));
  formData.append('building', String(orderData.building || ''));
  formData.append('unit', String(orderData.unit || ''));

  const productsArray = orderData.products.map((p: CartItem) => ({
    sku: String(p.sku),
    qty: Number(p.qty)
  }));
  formData.append('products', JSON.stringify(productsArray));

  if (orderData.payment_method) {
    formData.append('payment_method', String(orderData.payment_method));
  }

  formData.append('with_insurance', orderData.with_insurance ? '1' : '0');
  formData.append('with_prescription', orderData.with_prescription ? '1' : '0');

  if (orderData.eid_no) formData.append('eid_no', String(orderData.eid_no));
  if (orderData.erx) formData.append('erx', String(orderData.erx));
  if (orderData.notes) formData.append('notes', String(orderData.notes));

  if (files.length > 0) {
    files.forEach((file, index) => {
      formData.append(`file_${index}`, file);
    });
  }

  return apiRequest('/?c=orders&m=create', {
    method: 'POST',
    body: formData,
  });
};
