export interface Template {
  id: number;
  name: string;
  language: string;
  placeholders: string | null;
  components: string;
  template: string;
  button_params: any; // Can be 0 or array of objects
  parameter_format: string;
  input_map: string[] | null;
}

export interface TemplateUsage {
  template_id: string;
  usage_count: number;
  latest_sent_at: string;
}

export interface TemplateState {
  templates: Template[];
  templateUsage: TemplateUsage[];
  loading: boolean;
  error: string | null;
}

export interface WhatsAppContact {
  id: number;
  name: string | null;
  lastname: string | null;
  phone_e164: string;
  wa_id: string;
}

export interface WhatsAppMessage {
  id: string;
  type: string;
  conversation_id: number;
  direction: 'in' | 'out';
  wamid: string | null;
  body: string | null;
  metadata: any; // Can be object or array
  template_name: string | null;
  template_language: string | null;
  template_components: string | null;
  send_status: string;
  error_code: string | null;
  error_message: string | null;
  sent_at: string | null;
  delivered_at: string | null;
  read_at: string | null;
  created_at: string;
  updated_at: string;
  notified: number;
}

export interface WhatsAppConversation {
  id: number;
  department_id: number;
  department_name: string;
  assigned_to: number;
  assigned_to_name: string;
  status: string;
  last_message_at: string;
  last_cust_message_at: string | null;
  session_expires_at: string | null;
  tags: any; // null in examples
  unread: number;
  contact: WhatsAppContact;
  resolution_code: string | null;
  resolution_summary: string | null;
  resolved_at: string | null;
  last_message: WhatsAppMessage | null;
  pin: any; // null
  is_pinned: boolean;
  is_unread: number;
  onhold_reason: string | null;
  onhold_details: string | null;
  onhold_at: string | null;
}

export interface WhatsAppConversationsResponse {
  current_page: number;
  data: WhatsAppConversation[];
}

export interface MessageTotals {
  total_sent: number;
  total_delivered: number;
  total_read: number;
  today_total_sent: number;
  today_total_delivered: number;
  today_total_read: number;
}

export interface Department {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  is_active: number;
  created_at: string;
  updated_at: string;
  icon: string | null;
  timezone: string;
  working_hours: { [key: string]: { start: string; end: string }[] };
  closures: any;
  is_default: number;
  department_heads: any[];
  is_dummy: number;
  conversations_count: number;
}

export interface Agent {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  presence: string;
  capacity_limit: number;
  is_supervisor: number;
  last_seen_at: string | null;
  last_assigned_at: string;
  created_at: string;
  updated_at: string;
  department_id: number | null;
  is_admin: number;
  is_super_admin: number;
  mode: string;
  open_cnt: number;
  conversations: any[];
}

export interface CustomerAddress {
  address_id: number;
  title: string;
  lat: string;
  lng: string;
  address: string;
}

export interface CustomerOrder {
  order_id: number;
  date_added: string;
  delivery_date: string;
  total: string;
  order_status_id: number;
  order_status_name: string;
}

export interface CustomerCRMData {
  customer_id: number;
  firstname: string;
  lastname: string;
  telephone: string;
  registered_date: string;
  email: string;
  addresses: CustomerAddress[];
  orders: CustomerOrder[];
  order_count: number;
  order_total: number;
  order_completed_count: number;
  order_completed_total: number;
}

export interface Customer {
  id: number;
  name: string;
  mobile: string;
  profile_pic: string | null;
  last_seen: string | null;
  conversations_count: number;
  last_message: string | null;
  crm_data: CustomerCRMData | null;
}

export interface CustomersResponse {
  current_page: number;
  data: Customer[];
  first_page_url: string;
  last_page: number;
  last_page_url: string;
  links: any[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface AbandonedCartItem {
  cart_id?: number;
  api_id?: number;
  customer_id?: number;
  session_id?: string;
  product_id: number;
  recurring_id?: number;
  option?: string;
  quantity: number;
  base_price: string;
  discount_percent: string;
  final_price: string;
  date_added?: string;
  firstname?: string;
  lastname?: string;
  email?: string;
  telephone?: string;
  id?: number;
  guest_token?: string;
  created_at?: string;
  updated_at?: string;
  name?: string;
  mobile?: string;
  country_code?: string;
}

export interface AbandonedCartCustomer {
  customer_id: number;
  firstname: string;
  lastname: string;
  email: string;
  telephone: string;
}

export interface AbandonedCartGuest {
  name: string;
  mobile: string;
  email: string;
  country_code: string;
}

export interface AbandonedCart {
  type: 'registered' | 'guest';
  customer?: AbandonedCartCustomer;
  items: AbandonedCartItem[];
  guest_token?: string;
  guest?: AbandonedCartGuest;
}

export interface AbandonedCartsResponse {
  success: boolean;
  data: AbandonedCart[];
}

export interface AbandonedCartsState {
  carts: AbandonedCart[];
  loading: boolean;
  error: string | null;
}

export interface BannerImage {
  banner_image_id: number;
  banner_id: number;
  language_id: number;
  title: string;
  link: string;
  image: string;
  mobile_image: string;
  sort_order: number;
  meta: string | null;
}

export interface Banner {
  banner_id: number;
  name: string;
  banner_type: string;
  object_id: number;
  expiry_date: string;
  status: number;
  description: string | null;
  description_image: string | null;
  images: BannerImage[];
  is_expired: boolean;
}

export interface BannersResponse {
  success: boolean;
  data: Banner[];
}

export interface BannersState {
  banners: Banner[];
  loading: boolean;
  error: string | null;
}

export interface Promotion {
  id: number;
  promotion_code: string;
  item_code: string;
  start_date: string;
  end_date: string;
  promotion_type: string;
  promotion_value: string;
  promotion_details: string;
  product_name: string;
  in_stock: number;
  available_stock: number;
  manufacturer_name: string;
}

export interface PromotionsResponse {
  success: boolean;
  data: Promotion[];
  pagination: {
    page: number;
    limit: number;
    offset: number;
  };
}

export interface PromotionDiscountDetail {
  count: number;
  end_date: string;
}

export interface PromotionTypeData {
  [discount: string]: PromotionDiscountDetail;
}

export interface PromotionSummaryData {
  active_promotions: number;
  avg_discount_rate: number;
  total_products_on_promotion: number;
  promotions_by_type: {
    [type: string]: PromotionTypeData;
  };
}

export interface PromotionSummaryResponse {
  success: boolean;
  data: PromotionSummaryData;
}

export interface PromotionsState {
  promotions: Promotion[];
  allPromotions: Promotion[];
  manufacturers: string[];
  loading: boolean;
  error: string | null;
  summary: PromotionSummaryData | null;
  loadingSummary: boolean;
  errorSummary: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number | null;
    totalPages: number | null;
    hasNext: boolean;
    hasPrev: boolean;
  } | null;
  uploading: boolean;
  uploadError: string | null;
  uploadResult: any | null;
  syncing: boolean;
  syncError: string | null;
  syncResult: any | null;
}

export interface ReferenceDataItem {
  id: number;
  name: string;
  [key: string]: any;
}

export interface ProductManufacturer {
  id?: number;
  manufacturer_id?: number;
  name: string;
}

export interface ProductCategory {
  category_id: number;
  name: string;
}

export interface ProductVisibility {
  web: boolean;
  mobile: boolean;
}

export interface ProductImage {
  image: string;
  url: string;
}

export interface ProductSubImage {
  image_id: number;
  image: string;
  url: string;
  sort_order: number;
}

export interface Product {
  product_id: number;
  dynamic_code: string;
  product_name?: string;
  name?: string; // Alternative field name from API
  price: number;
  price_without_vat: number;
  stock_status: string;
  available_stock: number;
  manufacturer: ProductManufacturer;
  categories?: ProductCategory[];
  visibility: ProductVisibility;
  status: string | boolean; // Can be string or boolean
  main_image?: ProductImage;
  sub_images?: ProductSubImage[];
  sku?: string;
  upc?: string;
  ean?: string;
  description?: string;
  details?: string;
  how_it_work?: string;
  ingredients?: string;
  warnings?: string;
  meta_title?: string;
  meta_description?: string;
  meta_keyword?: string;
  prescription_required: boolean;
  pharmacy_only: boolean;
  unlisted_product: boolean;
}

export interface ProductFormData {
  product_name: string;
  price?: string; // For editing existing products
  price_without_vat?: string; // For creating new products
  vat?: string;
  dynamic_code?: string;
  upc: string;
  ean: string;
  manufacturer_id: string;
  category_ids: number[];
  description: string;
  details: string;
  how_it_work: string;
  ingredients: string;
  warnings: string;
  meta_title: string;
  meta_description: string;
  meta_keyword: string;
  web: boolean;
  mobile: boolean;
  status: boolean;
  generateSku?: boolean; // For editing existing products
  sub_images: {image: string, sort_order: number, preview?: string, fileIndex?: number}[];
}

export interface ProductsResponse {
  success: boolean;
  data: Product[];
}

export interface ProductsState {
  products: Product[];
  allProducts: Product[];
  manufacturers: ProductManufacturer[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number | null;
    totalPages: number | null;
    hasNext: boolean;
    hasPrev: boolean;
  } | null;
}

export interface ReferenceDataState {
  manufacturers: ReferenceDataItem[];
  categories: ReferenceDataItem[];
  products: ReferenceDataItem[];
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
}

export interface Manufacturer {
  manufacturer_id: number;
  name: string;
  image: string | null;
  sort_order: number;
  show_in_home: number;
  status: number;
}

export interface ManufacturersResponse {
  success: boolean;
  data: Manufacturer[];
}

export interface ManufacturersState {
  manufacturers: Manufacturer[];
  loading: boolean;
  error: string | null;
  creating: boolean;
  creatingError: string | null;
  updating: boolean;
  updatingError: string | null;
}

export interface Category {
  category_id: number;
  name: string;
  image: string | null;
  category_banner: string | null;
  parent_id: number;
  top: number;
  column: number;
  sort_order: number;
  status: number;
  display_sub_categories: number;
  is_menu: number;
  seo_url: string | null;
  list_in_api: number;
  description: string | null;
  meta_title: string | null;
  meta_description: string | null;
  meta_keyword: string | null;
  // Additional fields from API
  path?: string;
  parent_name?: string;
  parent_parent_id?: number;
  parent_parent_name?: string;
  main_parent_id?: number;
  main_parent_name?: string;
}

export interface CategoriesResponse {
  success: boolean;
  data: Category[];
}

export interface CategoriesState {
  categories: Category[];
  loading: boolean;
  error: string | null;
  creating: boolean;
  creatingError: string | null;
  updating: boolean;
  updatingError: string | null;
}