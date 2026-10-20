// Use API_BASE_URL from env - defaults to live API
// Dev: Uses proxy -> /api/api_panel/2.0
// Prod: Uses VITE_API_BASE_URL directly
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://panel.800pharmacy.ae/api_panel/v2';
const BASE_URL = import.meta.env.DEV ? '/api/api_panel/v2' : API_BASE_URL;
const PARTNER_ID = import.meta.env.VITE_PARTNER_ID;
const REF_ID = import.meta.env.VITE_REF_ID;
const SECURITY_CODE = import.meta.env.VITE_SECURITY_CODE;

const DEFAULT_API_ERROR = "We couldn't complete your request. Please try again.";

const HTTP_ERROR_MESSAGES: Record<number, string> = {
  400: "The request could not be processed. Please check the entered information.",
  401: "Your sign-in details or session could not be verified.",
  403: "You do not have permission to perform this action.",
  404: "The requested information could not be found.",
  413: "The selected file is too large to upload.",
  422: "Some information is invalid. Please review it and try again.",
  429: "Too many requests were made. Please wait and try again.",
  500: "The service is temporarily unavailable. Please try again later.",
  502: "The service is temporarily unavailable. Please try again later.",
  503: "The service is temporarily unavailable. Please try again later.",
  504: "The service took too long to respond. Please try again.",
};

const INTERNAL_ERROR_PATTERN =
  /<\/?(?:html|head|body|script|style|pre|br|b)\b|<!doctype|fatal error|parse error|stack trace|sqlstate|pdoexception|uncaught exception|undefined (?:index|variable)|\bnginx\b|\bapache\b|\bin \/[^\s]+\.php\b|\bon line \d+\b/i;

const getSafeApiMessage = (value: unknown, fallback = DEFAULT_API_ERROR) => {
  if (typeof value !== "string") return fallback;

  const message = value.replace(/\s+/g, " ").trim();
  if (!message || message.length > 240 || INTERNAL_ERROR_PATTERN.test(message)) {
    return fallback;
  }

  return message;
};

const sanitizeFailureResponse = (data: any) => {
  if (!data || typeof data !== "object" || Array.isArray(data)) return data;

  const isFailure =
    data.success === 0 ||
    data.success === "0" ||
    data.success === false ||
    data.status === "error";

  if (!isFailure) return data;

  const safeMessage = getSafeApiMessage(data.message ?? data.error);
  return {
    ...data,
    message: safeMessage,
    error: safeMessage,
  };
};

const getHttpErrorMessage = (status: number) =>
  HTTP_ERROR_MESSAGES[status] ||
  (status >= 500
    ? "The service is temporarily unavailable. Please try again later."
    : DEFAULT_API_ERROR);

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

  let response: Response;
  try {
    response = await fetch(url, config);
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error("API connection failed", error);
    }
    throw new Error("Unable to connect to the service. Please check your connection and try again.");
  }
  
  // Check if response is OK
  if (!response.ok) {
    if (import.meta.env.DEV) {
      console.error(`API request failed with HTTP ${response.status}`);
    }

    if (response.status === 401) {
      localStorage.removeItem('session_token');
      localStorage.removeItem('user');
      window.location.hash = '/auth';
    }

    throw new Error(getHttpErrorMessage(response.status));
  }

  // Try to parse JSON
  const text = await response.text();
  if (!text) {
    return {
      success: 0,
      error: "The service returned an empty response. Please try again.",
      message: "The service returned an empty response. Please try again.",
    };
  }
  
  try {
    const data = JSON.parse(text);
    return sanitizeFailureResponse(data);
  } catch {
    if (import.meta.env.DEV) {
      console.error("API returned a response in an unexpected format");
    }
    throw new Error("The service returned an unexpected response. Please try again later.");
  }
};
