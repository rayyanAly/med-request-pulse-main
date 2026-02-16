// 800 Pharmacy API Types
// Based on Postman collection and actual API responses

// ==================== Auth Types ====================

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: number;
  error: string;
  data?: {
    id: string; // partner_ref_id
    partner_id: string;
    partner_session: string;
    partner_name: string;
    store_name: string;
    store_status: string;
    user_name: string;
    whatsapp_number?: string | null;
    store_logo?: string | null;
    store_phone?: string | null;
    delivery_charges: number;
  };
  message?: string;
}

export interface SessionResponse {
  data?: {
    session: string;
  };
}

// ==================== API Response Types ====================

export interface ApiResponse<T> {
  success: number;
  error: string;
  data?: T;
  message?: string;
}

// ==================== Order Types ====================

export interface OrderProduct {
  product_id: number;
  sku: string;
  name: string;
  quantity: number;
  price: number;
  discount_applied?: number;
  total: number;
  image?: string;
}

export interface OrderActivity {
  received_at: string;
  accepted_at?: string | null;
  prepared_at?: string | null;
  dispatched?: string | null;
  driver_started_at?: string | null;
  delivered_at?: string | null;
}

export interface OrderTotal {
  code: string;
  title: string;
  value: number;
  sort_order: number;
}

// API format for order creation (uses sku and qty)
export interface OrderProductApi {
  sku: string;
  qty: number;
}

export interface Order {
  order_id: string;
  order_id_internal?: string;
  firstname?: string;
  lastname?: string;
  email?: string;
  telephone?: string;
  payment_method?: string;
  payment_status?: string;
  payment_reference?: string | null;
  shipping_method?: string | null;
  shipping_lat?: string;
  shipping_lng?: string;
  comment?: string;
  currency_code?: string;
  currency_value?: number;
  ip?: string | null;
  date_added?: string;
  date_modified?: string;
  delivery_date?: string;
  delivery_time?: string;
  rating?: string;
  insurance?: number;
  prescription?: number;
  order_status?: string;
  internal_name?: string | null;
  // total can be a number (in orders list) or OrderTotal[] (in single order details)
  total?: number | OrderTotal[];
  address?: string | null;
  activities?: OrderActivity;
  attachments?: OrderAttachment[];
  products?: OrderProduct[];
  erx?: string;
  order_status_id?: string;
  cancel_key?: string;
  cancel_reason?: string | null;
  agent_name?: string | null;
  item_total?: number;
  a_notes?: string;
}

export interface OrderAttachment {
  attachment_url: string;
  attachment_type: string;
}

export interface OrderStatus {
  order_id: string;
  status: string;
  last_update?: string;
}

export interface OrderTrack {
  order_id: string;
  status: string;
  driver_name?: string;
  driver_phone?: string;
  driver_location?: {
    lat: number;
    lng: number;
  };
}

export interface CreateOrderRequest {
  // Required fields
  first_name: string;
  last_name: string;
  contact_number: string;
  
  // Products array (API format: sku and qty)
  products: OrderProductApi[];
  
  // Payment method: cash, card, online, pal, paid_already
  payment_method: string;
  
  // Insurance and Prescription flags
  with_insurance: boolean;
  with_prescription: boolean;
  
  // Optional fields
  customer_id?: string;
  eid_no?: string;  // Sent as 'eid' to API
  erx?: string;
  notes?: string;   // Sent as 'comments' to API
  deliver_date?: string;
  delivery_time?: string;
  policy_number?: string;
  
  // Session ID for pre-uploaded prescriptions (via upload_temp)
  // Use 'session' field name - same ID used when uploading via upload_temp
  session?: string;
}

export interface CreateOrderResponse {
  order_id: string;
  customer_id: string;
  address_id: string;
  cancel_key: string;
}

export interface CancelOrderRequest {
  id: string;
  cancel_key: string;
}

export interface CancelOrderResponse {
  order_id: string;
  status: string;
}

// ==================== Customer Types ====================

export interface Customer {
  customer_id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  telephone?: string;
  total_orders?: number;
}

export interface RegisterCustomerRequest {
  first_name: string;
  last_name: string;
  password: string;
  confirm_password: string;
  contact_number: string;
  email?: string;
}

export interface RegisterCustomerResponse {
  customer_id: string;
}

export interface CustomerLoginResponse {
  customer_id: number;
  external_id: string;
  firstname: string;
  lastname: string;
  email: string;
}

// ==================== Product Types ====================

export interface Product {
  product_id: number;
  sku: string;
  name: string;
  price: number;
  category_name?: string;
  unit?: string;
  description?: string;
  manufacturer?: string;
  category_id?: number;
  image?: string;
  special?: number;
  available_stock?: number;
  prescription_required?: number;
  currency?: string;
  pharmacy_generic_name?: string;
  plus_symptoms?: string;
}

export interface ProductStock {
  name: string;
  stock_available: boolean;
  available_qty?: number;
}

// ==================== Category Types ====================

export interface Category {
  category_id: number;
  name: string;
  description?: string;
  meta_title?: string;
  image?: string;
}

// ==================== Stats Types ====================

export interface DashboardStats {
  total_sale: number;
  total_orders: number;
  total_customers: number;
  average_value: number;
}

// ==================== Cart Types ====================

export interface CartItem {
  product_id: number;
  sku: string;
  qty: number;
}

// ==================== Order Files Types ====================

export interface OrderFiles {
  prescription?: File | null;
  insurance?: File | null;
  emirates_id?: File | null;
}

// ==================== UI Types ====================

export interface OrderListItem {
  id: string;
  customerName: string;
  customerPhone: string;
  value: number;
  status: string;
  dateTime: string;
  preparedBy?: string;
  preparedAt?: string;
  dispatchedAt?: string;
  deliveredAt?: string;
}

// ==================== Response Types ====================

export type PaymentMethod = 'cash' | 'card' | 'online' | 'pal' | 'paid_already';

// ==================== Component Props Types ====================

export interface OrdersTableProps {
  statusFilter: string;
  filteredOrders?: any[];
}

export interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  trend?: "up" | "down";
  icon: React.ElementType;
  prefix?: string;
  suffix?: string;
  loading?: boolean;
}
