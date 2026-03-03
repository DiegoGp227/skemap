/**
 * API Client with automatic 401 handling
 *
 * This client automatically logs out users when their token expires (401 Unauthorized)
 */

type FetchOptions = RequestInit & {
  headers?: Record<string, string>;
};

/**
 * Custom fetch wrapper that handles 401 responses automatically
 */
export async function apiFetch(url: string, options: FetchOptions = {}): Promise<Response> {
  // Build headers object
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Add any custom headers from options
  if (options.headers) {
    Object.assign(headers, options.headers);
  }

  // Add Authorization header if token exists
  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Make the request
  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Handle 401 Unauthorized - Token expired
  if (response.status === 401) {
    console.warn('🔐 Token expired or invalid. Logging out...');

    // Clear auth data
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Redirect to login
    window.location.href = '/';

    // Throw error to stop further processing
    throw new Error('Session expired. Please log in again.');
  }

  return response;
}

/**
 * Helper for GET requests
 */
export async function apiGet<T>(url: string): Promise<T> {
  const response = await apiFetch(url, { method: 'GET' });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Helper for POST requests
 */
export async function apiPost<T>(url: string, data: any): Promise<T> {
  const response = await apiFetch(url, {
    method: 'POST',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Helper for PATCH requests
 */
export async function apiPatch<T>(url: string, data: any): Promise<T> {
  const response = await apiFetch(url, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Helper for DELETE requests
 */
export async function apiDelete<T>(url: string): Promise<T> {
  const response = await apiFetch(url, { method: 'DELETE' });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
}
