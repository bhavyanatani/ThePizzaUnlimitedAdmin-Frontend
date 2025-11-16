const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const getAuthToken = (): string | null => {
  return localStorage.getItem('token');
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem('token', token);
};

export const clearAuthToken = (): void => {
  localStorage.removeItem('token');
};

export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<any> => {
  const token = getAuthToken();

  const headers: HeadersInit = {
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      clearAuthToken();
      window.location.href = '/api/admin/login';
      throw new Error('Unauthorized');
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }

    return data;
  } catch (error: any) {
    throw new Error(error.message || 'Network error occurred');
  }
};

const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const api = {
  login: async (email: string, password: string) => {
    return apiRequest('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  getOverview: async () => {
    const response = await apiRequest('/api/admin/analytics/overview');
    return response.data || response;
  },

  getCategories: async () => {
    return apiRequest('/api/admin/menu/categories');
  },

  createCategory: async (data: any) => {
    return apiRequest('/api/admin/menu/category', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateCategory: async (id: string, data: any) => {
    return apiRequest(`/api/admin/menu/category/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  deleteCategory: async (id: string) => {
    return apiRequest(`/api/admin/menu/category/${id}`, { method: 'DELETE' });
  },

  getCategoryItems: async (categoryId: string, page = 1, limit = 10) => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    return apiRequest(`/api/admin/menu/categories/${categoryId}/items?${params}`);
  },

  createItem: async (categoryId: string, formData: FormData) => {
    return apiRequest(`/api/admin/menu/categories/${categoryId}/items`, {
      method: 'POST',
      body: formData,
    });
  },

  updateItem: async (id: string, formData: FormData) => {
    return apiRequest(`/api/admin/menu/items/${id}`, {
      method: 'PUT',
      body: formData,
    });
  },

  deleteItem: async (id: string) => {
    return apiRequest(`/api/admin/menu/items/${id}`, { method: 'DELETE' });
  },

  getOrders: async (page = 1, limit = 20, status?: string) => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (status && status !== 'all') params.append('status', capitalize(status));
    return apiRequest(`/api/admin/orders?${params}`);
  },

  getOrder: async (id: string) => {
    return apiRequest(`/api/admin/orders/${id}`);
  },

  updateOrderStatus: async (id: string, status: string) => {
    return apiRequest(`/api/admin/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status: capitalize(status) }),
    });
  },

  getReservations: async (page = 1, limit = 20) => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    return apiRequest(`/api/admin/reservations?${params}`);
  },

  getReservation: async (id: string) => {
    return apiRequest(`/api/admin/reservation/${id}`);
  },

  updateReservationStatus: async (id: string, status: string) => {
    return apiRequest(`/api/admin/reservation/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status: capitalize(status) }),
    });
  },

  getReviews: async (page = 1, limit = 20) => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    return apiRequest(`/api/admin/reviews?${params}`);
  },

  deleteReview: async (id: string) => {
    return apiRequest(`/api/admin/reviews/${id}`, { method: 'DELETE' });
  },
};
