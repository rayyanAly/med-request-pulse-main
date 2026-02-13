import { apiRequest } from './baseApi';
import {
  CreateOrderRequest,
  ApiResponse,
  CartItem,
  Order,
  OrderStatus,
  OrderTrack,
  CancelOrderRequest,
  CancelOrderResponse,
  CreateOrderResponse,
} from './types';

// Use query params format: api_panel/v2/?c=orders&m=...

/**
 * Fetch all orders with optional filters
 * GET /?c=orders&m=index
 */
export const fetchOrders = async (filters?: {
  limit?: number;
  page?: number;
  sort?: string;
  orderby?: string;
  customer?: string;
}): Promise<ApiResponse<Order[]>> => {
  const params = new URLSearchParams();
  if (filters?.limit) params.append('limit', String(filters.limit));
  if (filters?.page) params.append('page', String(filters.page));
  if (filters?.sort) params.append('sort', filters.sort);
  if (filters?.orderby) params.append('orderby', filters.orderby);
  if (filters?.customer) params.append('customer', filters.customer);

  const query = params.toString();
  return apiRequest(`/?c=orders&m=index${query ? `&${query}` : ''}`);
};

/**
 * Fetch single order by ID
 * GET /?c=orders&m=index&id=ORDER_ID
 */
export const fetchSingleOrder = async (orderId: string): Promise<ApiResponse<Order>> => {
  return apiRequest(`/?c=orders&m=index&id=${orderId}`);
};

/**
 * Get order status
 * GET /?c=orders&m=status&id=ORDER_ID
 */
export const fetchOrderStatus = async (orderId: string): Promise<ApiResponse<OrderStatus>> => {
  return apiRequest(`/?c=orders&m=status&id=${orderId}`);
};

/**
 * Track order (driver info, location)
 * GET /?c=orders&m=track&id=ORDER_ID
 */
export const fetchOrderTrack = async (orderId: string): Promise<ApiResponse<OrderTrack>> => {
  return apiRequest(`/?c=orders&m=track&id=${orderId}`);
};

/**
 * Create new order
 * POST /?c=orders&m=create
 * 
 * Required fields: first_name, last_name, contact_number, building, unit
 * Products: JSON string with format [{"sku": "12345", "qty": 1}]
 * Payment methods: cash, card, online, pal, paid_already
 */
export const createOrder = async (
  orderData: CreateOrderRequest,
  files: File[] = []
): Promise<ApiResponse<CreateOrderResponse>> => {
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

  return apiRequest('/?c=orders&m=create', {
    method: 'POST',
    body: formData,
  });
};

/**
 * Cancel order
 * POST /?c=orders&m=cancel
 * 
 * Required: id (order_id), cancel_key
 */
export const cancelOrder = async (
  data: CancelOrderRequest
): Promise<ApiResponse<CancelOrderResponse>> => {
  const formData = new URLSearchParams();
  formData.append('id', String(data.id));
  formData.append('cancel_key', String(data.cancel_key));

  return apiRequest('/?c=orders&m=cancel', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData.toString(),
  });
};

/**
 * Get dashboard statistics
 * GET /?c=stats
 */
export const fetchDashboardStats = async (): Promise<ApiResponse<{
  total_sale: number;
  total_orders: number;
  total_customers: number;
  average_value: number;
}>> => {
  return apiRequest('/?c=stats');
};
