export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  data?: any;
  session_token?: string;
  message?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface OrderAttachment {
  attachment_url: string;
  attachment_type: string;
}

export interface OrderActivities {
  received_at: string | null;
  accepted_at: string | null;
  prepared_at: string | null;
  dispatched: string | null;
  driver_started_at: string | null;
  delivered_at: string | null;
}

export interface Product {
  product_id: number;
  sku: string;
  name: string;
  unit: string;
  description: string;
  manufacturer: string;
  category_id: number;
  category_name: string;
  price: number;
  special: number;
  image: string;
  categories_list: ProductCategory[];
}

export interface ProductCategory {
  category_id: number;
  name: string;
  description: string;
  meta_title: string;
  image: string;
}

// Cart item - uses qty (not quantity) for backend compatibility
export interface CartItem {
  product_id: number;
  sku: string;
  qty: number;
}

export interface CreateOrderRequest {
  // Required fields
  first_name: string;
  last_name: string;
  contact_number: string;
  building: string;
  unit: string;
  
  // Products array
  products: CartItem[];
  
  // Payment method: cash, card, online, pal, paid_already
  payment_method?: string;
  
  // Insurance and Prescription flags
  with_insurance?: boolean;
  with_prescription?: boolean;
  
  // Optional fields
  customer_id?: string;
  eid_no?: string;
  erx?: string;
  notes?: string;
}

export interface Order {
  order_id: string;
  order_id_internal: string;
  firstname: string;
  lastname: string;
  email: string;
  telephone: string;
  payment_method: string;
  payment_status: string;
  payment_reference: string | null;
  shipping_method: string | null;
  shipping_lat: string;
  shipping_lng: string;
  comment: string;
  currency_code: string;
  currency_value: number;
  ip: string | null;
  date_added: string;
  date_modified: string;
  delivery_date: string;
  delivery_time: string;
  rating: string;
  insurance: number;
  prescription: number;
  order_status: string;
  total: number;
  comission: number;
  partner_name: string | null;
  item_total: number;
  received_at: string;
  accepted_at: string;
  prepared_at: string;
  dispatched: string;
  driver_started_at: string;
  delivered_at: string;
  duration: string;
  agent_name: string | null;
  attachments?: OrderAttachment[];
  products?: any[]; // Assuming array of products
  erx?: string;
  order_status_id?: string;
  cancel_key?: string;
  cancel_reason?: string | null;
  a_notes?: string;
  address?: string | null;
  internal_name?: string | null;
}

export interface OrdersResponse extends ApiResponse<Order[]> {}

export interface SingleOrderResponse extends ApiResponse<Order> {}

export interface ProductsResponse extends ApiResponse<Product[]> {}

export interface SingleProductResponse extends ApiResponse<Product> {}

// Payment method options
export type PaymentMethod = 'cash' | 'card' | 'online' | 'pal' | 'paid_already';
