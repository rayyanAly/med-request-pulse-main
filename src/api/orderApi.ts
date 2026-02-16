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
  OrderFiles,
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
 * Required fields: first_name, last_name, contact_number
 * Products: JSON string with format [{"sku": "12345", "qty": 1}]
 * Payment methods: cash, card, online, pal, paid_already
 * 
 * File uploads (use specific field names):
 * - prescription: For prescription orders
 * - insurance: For insured orders
 * - emirates_id: For new customers
 */
export const createOrder = async (
  orderData: CreateOrderRequest,
  files: OrderFiles = {}
): Promise<ApiResponse<CreateOrderResponse>> => {
  const formData = new FormData();

  // Required fields
  formData.append('first_name', String(orderData.first_name || ''));
  formData.append('last_name', String(orderData.last_name || ''));
  formData.append('contact_number', String(orderData.contact_number || ''));

  // Products - MUST use "sku" and "qty" (NOT product_id and quantity)
  const productsArray = orderData.products.map((p: CartItem) => ({
    sku: String(p.sku),
    qty: Number(p.qty)
  }));
  formData.append('products', JSON.stringify(productsArray));

  // Payment method
  if (orderData.payment_method) {
    formData.append('payment_method', String(orderData.payment_method));
  }

  // Insurance and Prescription flags (as '0' or '1' strings)
  formData.append('with_insurance', orderData.with_insurance ? '1' : '0');
  formData.append('with_prescription', orderData.with_prescription ? '1' : '0');

  // Optional fields
  if (orderData.eid_no) {
    formData.append('eid', String(orderData.eid_no));
  }
  if (orderData.erx) {
    formData.append('erx', String(orderData.erx));
  }
  if (orderData.notes) {
    formData.append('comments', String(orderData.notes));
  }
  if (orderData.policy_number) {
    formData.append('policy_number', String(orderData.policy_number));
  }
  if (orderData.deliver_date) {
    formData.append('deliver_date', String(orderData.deliver_date));
  }
  if (orderData.delivery_time) {
    formData.append('delivery_time', String(orderData.delivery_time));
  }
  
  // Session ID for pre-uploaded prescriptions (via upload_temp)
  // Use 'session' field name - same ID used when uploading via upload_temp
  if (orderData.session) {
    formData.append('session', String(orderData.session));
  }

  // File attachments with specific field names
  // IMPORTANT: Don't set Content-Type header - let browser set it for FormData
  if (files.prescription) {
    formData.append('prescription', files.prescription);
  }
  if (files.insurance) {
    formData.append('insurance', files.insurance);
  }
  if (files.emirates_id) {
    formData.append('emirates_id', files.emirates_id);
  }

  return apiRequest('/?c=orders&m=create', {
    method: 'POST',
    body: formData,
    // Note: Don't set Content-Type header - browser will set it with correct boundary for FormData
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

/**
 * Upload temporary prescription image
 * POST /?c=orders&m=upload_temp
 * 
 * Use this to pre-upload prescription images before creating an order.
 * Supports up to 3 prescription images per order.
 * 
 * @param file - The prescription image file
 * @param session - Unique session ID to group multiple uploads
 * @returns Response with inserted_id and file path
 */
export const uploadTempPrescription = async (
  file: File,
  session: string
): Promise<ApiResponse<{ inserted_id: string; file: string }>> => {
  const formData = new FormData();
  formData.append('prescription', file);
  formData.append('session', session);

  return apiRequest('/?c=orders&m=upload_temp', {
    method: 'POST',
    body: formData,
  });
};

/**
 * Delete temporary uploaded file
 * GET /?c=orders&m=delete_temp&id={inserted_id}&session={session}
 * 
 * Use this to remove a previously uploaded file when user removes it from the form.
 * 
 * @param insertedId - The inserted_id from upload_temp response
 * @param session - The session ID used during upload
 * @returns Response with success status
 */
export const deleteTempFile = async (
  insertedId: string,
  session: string
): Promise<ApiResponse<{ success: boolean }>> => {
  return apiRequest(`/?c=orders&m=delete_temp&id=${insertedId}&session=${session}`);
};

/**
 * Generate unique session ID for temp uploads
 * Format: timestamp only (e.g., 1771063659)
 */
export const generateSessionId = (): string => {
  return String(Date.now());
};
