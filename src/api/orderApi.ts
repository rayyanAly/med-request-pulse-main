import { apiRequest } from './baseApi';
import { OrdersResponse, SingleOrderResponse, CreateOrderRequest, ApiResponse } from './types';

export const fetchOrders = async (): Promise<OrdersResponse> => {
  return apiRequest('/?c=orders&m=index');
};

export const fetchSingleOrder = async (orderId: string): Promise<SingleOrderResponse> => {
  return apiRequest(`/?c=orders&m=index&id=${orderId}`);
};

export const createOrder = async (orderData: CreateOrderRequest): Promise<ApiResponse<any>> => {
  const formData = new URLSearchParams();
  if (orderData.customer_id) {
    formData.append('customer_id', orderData.customer_id);
  }
  if (orderData.first_name) {
    formData.append('first_name', orderData.first_name);
  }
  if (orderData.last_name) {
    formData.append('last_name', orderData.last_name);
  }
  if (orderData.contact_number) {
    formData.append('contact_number', orderData.contact_number);
  }
  if (orderData.eid_no) {
    formData.append('eid_no', orderData.eid_no);
  }
  if (orderData.erx_no) {
    formData.append('erx_no', orderData.erx_no);
  }
  formData.append('products', JSON.stringify(orderData.products));
  formData.append('delivery_address', orderData.delivery_address);
  if (orderData.notes) {
    formData.append('notes', orderData.notes);
  }

  return apiRequest('/?c=orders&m=create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData,
  });
};
