const BASE_URL = import.meta.env.DEV ? '/api/api_panel/1.0' : 'https://dashboard.800pharmacy.ae/api_panel/1.0';
const PARTNER_ID = import.meta.env.VITE_PARTNER_ID;
const REF_ID = import.meta.env.VITE_REF_ID;

export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<any> => {
  const url = `${BASE_URL}${endpoint}`;

const defaultHeaders: Record<string, string> = {
    'X-Partner-Id': localStorage.getItem('partner_id') || PARTNER_ID,
    'X-Ref-Id': localStorage.getItem('partner_ref_id') || REF_ID,
  };

  // Add session token if available
  const sessionToken = localStorage.getItem('session_token');
  if (sessionToken) {
    defaultHeaders['X-Session'] = sessionToken;
  }

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

const response = await fetch(url, config);
const data = await response.json();

if (!response.ok) {
  if (response.status === 401) {
    // Unauthorized - clear auth and logout
    localStorage.removeItem('session_token');
    localStorage.removeItem('user');
    // Dispatch logout if store is available, but since this is API layer, redirect to login
    window.location.href = '/auth';
  }
  throw new Error(data.message || 'API request failed');
}

return data;
};