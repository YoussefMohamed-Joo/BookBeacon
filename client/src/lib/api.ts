import axios from 'axios';
import { redirectToLogin } from './navigate';

// Axios instance — baseURL proxies through Vite dev server (/api -> server)
const API = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token from localStorage to every request
API.interceptors.request.use((config) => {
  const user = localStorage.getItem('user');
  if (user) {
    try {
      const parsed = JSON.parse(user);
      if (parsed.token) {
        config.headers.Authorization = `Bearer ${parsed.token}`;
      }
    } catch { /* ignore corrupted state */ }
  }
  return config;
});

// On 401 response -> clear stored user + redirect to login
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      redirectToLogin();
    }
    return Promise.reject(error);
  }
);

export default API;

// ===== API endpoint wrappers =====

export const authAPI = {
  register: (data: { name: string; email: string; phone: string; password: string }) =>
    API.post('/auth/register', data),
  login: (data: { email: string; password: string }) => API.post('/auth/login', data),
  verifyOTP: (data: { email: string; otp: string; type: string }) =>
    API.post('/auth/verify-otp', data),
  resendOTP: (data: { email: string; type: string }) => API.post('/auth/resend-otp', data),
  getProfile: () => API.get('/auth/profile'),
  updateProfile: (data: { email?: string; currentPassword?: string; newPassword?: string }) =>
    API.put('/auth/profile', data),
};

export const booksAPI = {
  getAll: (params?: any) => API.get('/books', { params }),
  getBySlug: (slug: string) => API.get(`/books/slug/${slug}`),
  getById: (id: string) => API.get(`/books/${id}`),
  getByGrade: (grade: string) => API.get(`/books/grade/${encodeURIComponent(grade)}`),
  create: (data: any) =>
    API.post('/books', data),
  update: (id: string, data: any) =>
    API.put(`/books/${id}`, data),
  delete: (id: string) => API.delete(`/books/${id}`),
  lookupBarcode: (barcode: string) => API.get(`/books/barcode/${barcode}`),
  generateBarcodes: () => API.post('/books/generate-barcodes'),
};

export const ordersAPI = {
  create: (data: any) => API.post('/orders', data),
  createInstantSale: (data: any) => API.post('/orders/instant-sale', data),
  getMyOrders: () => API.get('/orders/my-orders'),
  getAll: (params?: any) => API.get('/orders', { params }),
  updateStatus: (id: string, data: any) => API.patch(`/orders/${id}/status`, data),
  uploadPayment: (id: string, data: any) =>
    API.post(`/orders/${id}/payment`, data),
  verifyPayment: (id: string) => API.post(`/orders/${id}/verify-payment`),
  confirmDelivery: (id: string, data?: any) => API.post(`/orders/${id}/confirm-delivery`, data || {}),
  instantDelivery: (id: string) => API.post(`/orders/${id}/instant-delivery`),
  refundOrder: (data: { orderId: string; items: { bookId: string; quantity: number }[]; reason: string }) =>
    API.post('/orders/refund', data),
  adminAction: (id: string, data: { action: 'approve' | 'reject'; note?: string }) =>
    API.post(`/orders/${id}/admin-action`, data),
  getGovernorates: () => API.get('/orders/governorates/prices'),
};

export const activityAPI = {
  getAll: (params?: any) => API.get('/activity', { params }),
};

export const inventoryAPI = {
  getLogs: (params?: any) => API.get('/inventory/logs', { params }),
  addStock: (id: string, data: any) => API.put(`/inventory/${id}/stock`, data),
  adjustStock: (id: string, data: any) => API.put(`/inventory/${id}/adjust`, data),
};

export const usersAPI = {
  getAll: (params?: any) => API.get('/users', { params }),
  toggleBlock: (id: string) => API.patch(`/users/${id}/block`),
  getOrders: (id: string) => API.get(`/users/${id}/orders`),
  deleteAll: () => API.delete('/users/delete-all'),
  getCashiers: () => API.get('/users/cashiers'),
  createCashier: (data: { name: string; email: string; phone: string; password: string }) =>
    API.post('/users/cashiers', data),
  deleteCashier: (id: string) => API.delete(`/users/cashiers/${id}`),
};

export const deliveryAPI = {
  getAll: () => API.get('/delivery'),
  setPrice: (data: { governorate: string; price: number }) => API.post('/delivery', data),
  delete: (id: string) => API.delete(`/delivery/${id}`),
  getPickups: () => API.get('/delivery/pickups'),
  getMyPickups: () => API.get('/delivery/pickups/my'),
  updatePickupStatus: (id: string, deliveryStatus: string) => API.put(`/delivery/pickups/${id}/status`, { deliveryStatus }),
};

export const accountingAPI = {
  getOverview: () => API.get('/accounting/overview'),
  getTransactions: (params?: any) => API.get('/accounting/transactions', { params }),
  createTransaction: (data: any) => API.post('/accounting/transactions', data),
  getProfitPerOrder: () => API.get('/accounting/profit-per-order'),
};

export const aiAPI = {
  chat: (message: string) => API.post('/ai/chat', { message }),
  analyze: () => API.post('/ai/analyze'),
  adminQuery: (question: string) => API.post('/ai/admin-query', { question }),
  getRecommendations: (params?: any) => API.get('/ai/recommendations', { params }),
  getSalesInsights: () => API.get('/ai/sales-insights'),
  getAccountingInsights: () => API.get('/ai/accounting-insights'),
  detectFraud: () => API.get('/ai/detect-fraud'),
};

export const notificationsAPI = {
  getAll: (params?: any) => API.get('/notifications', { params }),
  getUnreadCount: () => API.get('/notifications/unread-count'),
  markAsRead: (id: string) => API.patch(`/notifications/${id}/read`),
  markAllAsRead: () => API.patch('/notifications/read-all'),
  delete: (id: string) => API.delete(`/notifications/${id}`),
  clearAll: () => API.delete('/notifications'),
};

export const blogAPI = {
  getAll: (params?: any) => API.get('/blogs', { params }),
  getBySlug: (slug: string) => API.get(`/blogs/slug/${slug}`),
  getAdmin: () => API.get('/blogs/admin'),
  create: (data: FormData) =>
    API.post('/blogs', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id: string, data: FormData) =>
    API.put(`/blogs/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id: string) => API.delete(`/blogs/${id}`),
};

export const reviewsAPI = {
  create: (data: { bookId: string; rating: number; comment?: string }) =>
    API.post('/reviews', data),
  getByBook: (bookId: string) => API.get(`/reviews/book/${bookId}`),
  getAll: () => API.get('/reviews'),
  approve: (id: string) => API.patch(`/reviews/${id}/approve`),
};

export const dashboardAPI = {
  getStats: () => API.get('/dashboard'),
  resetData: () => API.post('/dashboard/reset'),
};
