// Use API_BASE_URL from env - defaults to live API
// Dev: Uses proxy -> /api/api_panel/2.0
// Prod: Uses VITE_API_BASE_URL directly
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://800pharmacy.ae/api_panel/v2';
const BASE_URL = import.meta.env.DEV ? '/api/api_panel/v2' : API_BASE_URL;
const PARTNER_ID = import.meta.env.VITE_PARTNER_ID;
const REF_ID = import.meta.env.VITE_REF_ID;
const SECURITY_CODE = import.meta.env.VITE_SECURITY_CODE;

export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<any> => {
  const url = `${BASE_URL}${endpoint}`;

  const defaultHeaders: Record<string, string> = {
    'X-Partner-Id': localStorage.getItem('partner_id') || PARTNER_ID,
    'X-Ref-Id': localStorage.getItem('partner_ref_id') || REF_ID,
    'X-Security-Code': localStorage.getItem('security_code') || SECURITY_CODE,
  };

  // Add session token if available
  const sessionToken = localStorage.getItem('session_token');
  if (sessionToken) {
    defaultHeaders['X-Session'] = sessionToken;
  }

  // IMPORTANT: Don't set Content-Type for FormData requests
  // Let the browser set it automatically with the correct boundary
  const isFormData = options.body instanceof FormData;

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...(isFormData ? {} : options.headers), // Skip custom headers for FormData
    },
  };

  const response = await fetch(url, config);
  
  // Check if response is OK
  if (!response.ok) {
    // For 500 errors, try to get error text
    let errorMessage = `HTTP ${response.status}`;
    try {
      const errorText = await response.text();
      if (errorText) {
        errorMessage = errorText;
      }
    } catch {
      // Ignore parsing errors
    }
    
    if (response.status === 401) {
      localStorage.removeItem('session_token');
      localStorage.removeItem('user');
      window.location.hash = '/auth';
    }
    throw new Error(errorMessage);
  }

  // Try to parse JSON
  const text = await response.text();
  if (!text) {
    return { success: 0, error: 'Empty response from server' };
  }
  
  try {
    const data = JSON.parse(text);
    return data;
  } catch {
    throw new Error(`Invalid JSON response: ${text.substring(0, 100)}`);
  }
};
