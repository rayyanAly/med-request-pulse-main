import { Template, TemplateUsage, WhatsAppConversationsResponse, WhatsAppConversation, CustomersResponse, Customer, AbandonedCartsResponse, BannersResponse, PromotionSummaryResponse } from './types';

const API_BASE_URL = '/api/external';

const API_HEADERS = {
  'X-API-Key': 'your_api_key_here', // Replace with actual API key
  'Content-Type': 'application/json',
};

export const fetchTemplatesAPI = async (): Promise<Template[]> => {
  const response = await fetch(`${API_BASE_URL}/templates`, {
    headers: API_HEADERS,
  });
  if (!response.ok) {
    throw new Error('Failed to fetch templates');
  }
  return response.json();
};

export const fetchTemplateUsageAPI = async (): Promise<TemplateUsage[]> => {
  const response = await fetch(`${API_BASE_URL}/template-usage`, {
    headers: API_HEADERS,
  });
  if (!response.ok) {
    throw new Error('Failed to fetch template usage');
  }
  return response.json();
};

export const sendTemplateAPI = async (templateId: string, customerId: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/send-template`, {
    method: 'POST',
    headers: API_HEADERS,
    body: JSON.stringify({ templateId, customerId }),
  });
  if (!response.ok) {
    throw new Error('Failed to send template');
  }
};

export const sendTemplateToNumberAPI = async (templateName: string, language: string, phoneNumber: string, params: string[], buttonParams?: any): Promise<void> => {
  const body: any = {
    to: phoneNumber, // phoneNumber already includes country code
    name: templateName,
    language: language,
    params: params
  };
  if (buttonParams) {
    body.button_params = buttonParams;
  }
  const response = await fetch(`${API_BASE_URL}/send-template`, {
    method: 'POST',
    headers: API_HEADERS,
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error('Failed to send template to number');
  }
};

export const fetchConversationsAPI = async (): Promise<WhatsAppConversation[]> => {
  let allData: WhatsAppConversation[] = [];
  let page = 1;
  while (true) {
    const response = await fetch(`${API_BASE_URL}/conversations?page=${page}`, {
      headers: API_HEADERS,
    });
    if (!response.ok) {
      throw new Error('Failed to fetch conversations');
    }
    const data: WhatsAppConversationsResponse = await response.json();
    allData = [...allData, ...data.data];
    if (data.data.length === 0) break;
    page++;
  }
  return allData;
};

export const fetchPromotionSummaryAPI = async (): Promise<PromotionSummaryResponse> => {
  const response = await fetch('/api/products/promotions/summary');
  if (!response.ok) {
    throw new Error('Failed to fetch promotion summary');
  }
  return response.json();
};

export const fetchMessageTotalsAPI = async (): Promise<{
  total_sent: number;
  total_delivered: number;
  total_read: number;
  today_total_sent: number;
  today_total_delivered: number;
  today_total_read: number;
}> => {
  const response = await fetch(`${API_BASE_URL}/message-totals`, {
    headers: API_HEADERS,
  });
  if (!response.ok) {
    throw new Error('Failed to fetch message totals');
  }
  return response.json();
};

export const fetchDepartmentsAPI = async (): Promise<{ data: any[] }> => {
  const response = await fetch(`${API_BASE_URL}/departments`, {
    headers: API_HEADERS,
  });
  if (!response.ok) {
    throw new Error('Failed to fetch departments');
  }
  return response.json();
};

export const fetchAgentsAPI = async (): Promise<{ data: any[] }> => {
  const response = await fetch(`${API_BASE_URL}/agents`, {
    headers: API_HEADERS,
  });
  if (!response.ok) {
    throw new Error('Failed to fetch agents');
  }
  return response.json();
};

export const fetchCustomersAPI = async (page: number = 1, search: string = '', filter: 'all' | 'crm' = 'all'): Promise<CustomersResponse> => {
  if (filter === 'crm') {
    // Fetch all pages and filter
    let allData: any[] = [];
    let currentPage = 1;
    while (true) {
      const params = new URLSearchParams({
        per_page: '50',
        page: currentPage.toString(),
      });
      if (search) {
        params.append('search', search);
      }
      const response = await fetch(`${API_BASE_URL}/search-customers?${params}`, {
        headers: API_HEADERS,
      });
      if (!response.ok) {
        throw new Error('Failed to fetch customers');
      }
      const data = await response.json();
      const crmData = data.data.filter((c: any) => c.crm_data);
      allData = [...allData, ...crmData];
      if (data.data.length === 0 || currentPage >= data.last_page) break;
      currentPage++;
    }
    return {
      current_page: 1,
      data: allData.slice((page - 1) * 50, page * 50),
      first_page_url: '',
      last_page: Math.ceil(allData.length / 50),
      last_page_url: '',
      links: [],
      next_page_url: page < Math.ceil(allData.length / 50) ? '' : null,
      path: '',
      per_page: 50,
      prev_page_url: page > 1 ? '' : null,
      to: Math.min(page * 50, allData.length),
      total: allData.length,
    };
  } else {
    const params = new URLSearchParams({
      per_page: '50',
      page: page.toString(),
    });
    if (search) {
      params.append('search', search);
    }
    const response = await fetch(`${API_BASE_URL}/search-customers?${params}`, {
      headers: API_HEADERS,
    });
    if (!response.ok) {
      throw new Error('Failed to fetch customers');
    }
    return response.json();
  }
};

export const fetchAbandonedCartsAPI = async (): Promise<AbandonedCartsResponse> => {
  const response = await fetch('/api/carts/abandoned', {
    headers: API_HEADERS,
  });
  if (!response.ok) {
    throw new Error('Failed to fetch abandoned carts');
  }
  return response.json();
};

export const fetchBannersAPI = async (): Promise<BannersResponse> => {
  const response = await fetch('/api/banners');
  if (!response.ok) {
    throw new Error('Failed to fetch banners');
  }
  return response.json();
};

export const fetchManufacturersAPI = async (): Promise<{ data: any[] }> => {
  const response = await fetch('/api/manufacturers');
  if (!response.ok) {
    throw new Error('Failed to fetch manufacturers');
  }
  return response.json();
};

export const fetchCategoriesAPI = async (): Promise<{ data: any[] }> => {
  const response = await fetch('/api/categories');
  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }
  return response.json();
};

export const createManufacturerAPI = async (formData: FormData): Promise<any> => {
  const response = await fetch('/api/manufacturers', {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create manufacturer');
  }
  return response.json();
};

export const updateManufacturerAPI = async (id: number, formData: FormData): Promise<any> => {
  const response = await fetch(`/api/manufacturers/${id}`, {
    method: 'PUT',
    body: formData,
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update manufacturer');
  }
  return response.json();
};

export const createCategoryAPI = async (formData: FormData): Promise<any> => {
  const response = await fetch('/api/categories', {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create category');
  }
  return response.json();
};

export const updateCategoryAPI = async (id: number, formData: FormData): Promise<any> => {
  const response = await fetch(`/api/categories/${id}`, {
    method: 'PUT',
    body: formData,
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update category');
  }
  return response.json();
};

export const fetchProductsAPI = async (): Promise<{ data: any[] }> => {
  const response = await fetch('/api/products');
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  return response.json();
};

export const fetchPromotionsAPI = async (page: number = 1, limit: number = 50, manufacturer?: string): Promise<any> => {
  // Use the all endpoint to get all promotions at once for better performance
  let url = `/api/products/promotions/all?limit=all`;
  if (manufacturer && manufacturer !== 'all') {
    url += `&manufacturer=${encodeURIComponent(manufacturer)}`;
  }
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch promotions');
  }
  const data = await response.json();

  // If we have all data, simulate pagination for the UI
  if (data.data && Array.isArray(data.data)) {
    const allData = data.data;
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedData = allData.slice(start, end);

    return {
      ...data,
      data: paginatedData,
      allData: allData,
      pagination: {
        page,
        limit,
        total: allData.length,
        totalPages: Math.ceil(allData.length / limit),
      }
    };
  }

  return data;
};

export const uploadPromotionsAPI = async (file: File): Promise<any> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/promotions/apply', {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) {
    throw new Error('Failed to upload promotions');
  }
  return response.json();
};

export const syncPromotionsAPI = async (): Promise<any> => {
  const response = await fetch('/api/promotions/sync', {
    method: 'POST',
  });
  if (!response.ok) {
    throw new Error('Failed to sync promotions');
  }
  return response.json();
};

export const createBannerAPI = async (bannerData: any, imageFiles: File[], mobileImageFiles: File[]): Promise<any> => {
  const formData = new FormData();

  // Add text fields
  Object.keys(bannerData).forEach(key => {
    if (key !== 'images') {
      formData.append(key, bannerData[key]);
    }
  });

  // Add images metadata as JSON string
  formData.append('images', JSON.stringify(bannerData.images));

  // Add image files
  imageFiles.forEach(file => {
    formData.append('images[]', file);
  });

  mobileImageFiles.forEach(file => {
    formData.append('mobile_images[]', file);
  });

  const response = await fetch('/api/banners', {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) {
    throw new Error('Failed to create banner');
  }
  return response.json();
};

export const updateBannerAPI = async (bannerId: number, bannerData: any, imageFiles: File[], mobileImageFiles: File[]): Promise<any> => {
  const formData = new FormData();

  // Add text fields
  Object.keys(bannerData).forEach(key => {
    if (key !== 'images') {
      formData.append(key, bannerData[key]);
    }
  });

  // Add images metadata as JSON string
  formData.append('images', JSON.stringify(bannerData.images));

  // Add image files
  imageFiles.forEach(file => {
    formData.append('images[]', file);
  });

  mobileImageFiles.forEach(file => {
    formData.append('mobile_images[]', file);
  });

  const response = await fetch(`/api/banners/${bannerId}`, {
    method: 'PUT',
    body: formData,
  });
  if (!response.ok) {
    throw new Error('Failed to update banner');
  }
  return response.json();
};

export const fetchCatalogProductsAPI = async (): Promise<{ data: any[] }> => {
  const response = await fetch('/api/products/all');
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  return response.json();
};

export const updateProductStatusAPI = async (productId: number, status: number): Promise<any> => {
  const response = await fetch(`/api/products/${productId}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      status: status
    })
  });

  if (!response.ok) {
    throw new Error('Failed to update product status');
  }
  return response.json();
};

export const updateProductVisibilityAPI = async (productId: number, web: boolean, mobile: boolean): Promise<any> => {
  const response = await fetch(`/api/products/${productId}/visibility`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      web: web,
      mobile: mobile
    })
  });

  if (!response.ok) {
    throw new Error('Failed to update product visibility');
  }
  return response.json();
};

export const bulkUpdateProductVisibilityAPI = async (codesString: string, web: number, mobile: number): Promise<any> => {
  const response = await fetch('/api/products/bulk/visibility', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      codes: codesString,
      web: web,
      mobile: mobile
    })
  });

  if (!response.ok) {
    throw new Error('Failed to update product visibility');
  }
  return response.json();
};

export const createProductAPI = async (productData: any, mainImageFile: File | null, subImageFiles: File[]): Promise<any> => {
  const formData = new FormData();

  // Required fields
  formData.append('price_without_vat', productData.price_without_vat);
  if (productData.vat) {
    formData.append('vat', productData.vat);
  }
  formData.append('manufacturer_id', productData.manufacturer_id);
  formData.append('product_name', productData.product_name);
  formData.append('web', productData.web ? 'true' : 'false');
  formData.append('mobile', productData.mobile ? 'true' : 'false');
  formData.append('status', productData.status ? 'true' : 'false');

  // Optional fields
  if (productData.dynamic_code) {
    formData.append('dynamic_code', productData.dynamic_code);
  }
  if (productData.description) {
    formData.append('description', productData.description);
  }
  if (productData.upc) {
    formData.append('upc', productData.upc);
  }
  if (productData.ean) {
    formData.append('ean', productData.ean);
  }
  if (productData.meta_title) {
    formData.append('meta_title', productData.meta_title);
  }
  if (productData.meta_description) {
    formData.append('meta_description', productData.meta_description);
  }
  if (productData.meta_keyword) {
    formData.append('meta_keyword', productData.meta_keyword);
  }
  if (productData.details) {
    formData.append('details', productData.details);
  }
  if (productData.how_it_work) {
    formData.append('how_it_work', productData.how_it_work);
  }
  if (productData.ingredients) {
    formData.append('ingredients', productData.ingredients);
  }
  if (productData.warnings) {
    formData.append('warnings', productData.warnings);
  }

  // Category IDs as JSON array
  if (productData.category_ids && Array.isArray(productData.category_ids)) {
    formData.append('category_ids', JSON.stringify(productData.category_ids));
  }

  // Sub images as JSON array
  if (productData.sub_images) {
    formData.append('sub_images', JSON.stringify(productData.sub_images));
  }

  // Main image file
  if (mainImageFile) {
    formData.append('main_image', mainImageFile);
  }

  // Sub image files
  subImageFiles.forEach(file => {
    formData.append('sub_images[]', file);
  });

  const response = await fetch('/api/products', {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) {
    throw new Error('Failed to create product');
  }
  return response.json();
};

export const updateProductAPI = async (productId: number, productData: any, mainImageFile: File | null, subImageFiles: File[], dynamicCode?: string): Promise<any> => {
  const formData = new FormData();

  // Add editable fields
  formData.append('price', productData.price);
  formData.append('product_name', productData.product_name);
  formData.append('manufacturer_id', productData.manufacturer_id);
  formData.append('web', productData.web ? '1' : '0');
  formData.append('mobile', productData.mobile ? '1' : '0');
  formData.append('status', productData.status ? '1' : '0');
  formData.append('upc', productData.upc || '');
  formData.append('ean', productData.ean || '');
  if (productData.generateSku && dynamicCode) {
    formData.append('sku', `444${dynamicCode}`);
  }
  formData.append('generateSku', productData.generateSku ? '1' : '0');
  formData.append('description', productData.description || '');
  formData.append('details', productData.details || '');
  formData.append('how_it_work', productData.how_it_work || '');
  formData.append('ingredients', productData.ingredients || '');
  formData.append('warnings', productData.warnings || '');
  formData.append('meta_title', productData.meta_title || '');
  formData.append('meta_description', productData.meta_description || '');
  formData.append('meta_keyword', productData.meta_keyword || '');

  // Add category_ids as array
  if (productData.category_ids && Array.isArray(productData.category_ids)) {
    productData.category_ids.forEach((id: number) => {
      formData.append('category_ids[]', id.toString());
    });
  }

  // Add sub images metadata as JSON string
  if (productData.sub_images) {
    formData.append('sub_images', JSON.stringify(productData.sub_images));
  }

  // Add main image file
  if (mainImageFile) {
    formData.append('main_image', mainImageFile);
  }

  // Add sub image files
  subImageFiles.forEach(file => {
    formData.append('sub_images[]', file);
  });

  const response = await fetch(`/api/products/${productId}`, {
    method: 'PUT',
    body: formData,
  });
  if (!response.ok) {
    throw new Error('Failed to update product');
  }
  return response.json();
};