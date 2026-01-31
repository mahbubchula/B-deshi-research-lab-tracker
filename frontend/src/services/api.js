import axios from 'axios';
import useAuthStore from '../store/authStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// API methods
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (data) => api.post('/auth/register', data),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
};

export const goalAPI = {
  getAll: (params) => api.get('/goals', { params }),
  getOne: (id) => api.get(`/goals/${id}`),
  create: (data) => api.post('/goals', data),
  update: (id, data) => api.put(`/goals/${id}`, data),
  delete: (id) => api.delete(`/goals/${id}`),
  getStats: () => api.get('/goals/stats'),
};

export const paperAPI = {
  getAll: (params) => api.get('/papers', { params }),
  getOne: (id) => api.get(`/papers/${id}`),
  create: (data) => api.post('/papers', data),
  update: (id, data) => api.put(`/papers/${id}`, data),
  delete: (id) => api.delete(`/papers/${id}`),
};

export const taskAPI = {
  getAll: (params) => api.get('/tasks', { params }),
  getOne: (id) => api.get(`/tasks/${id}`),
  create: (data) => api.post('/tasks', data),
  update: (id, data) => api.put(`/tasks/${id}`, data),
  delete: (id) => api.delete(`/tasks/${id}`),
};

export const activityAPI = {
  getAll: (params) => api.get('/activities', { params }),
  delete: (id) => api.delete(`/activities/${id}`),
};

export const notificationAPI = {
  getAll: () => api.get('/notifications'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
};

// Supervisor/User management API
export const userAPI = {
  getAll: (params) => api.get('/users', { params }),
  getOne: (id) => api.get(`/users/${id}`),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
  assignSupervisor: (id, supervisorId) => api.put(`/users/${id}/assign-supervisor`, { supervisorId }),
  getUserGoals: (id) => api.get(`/users/${id}/goals`),
  getUserPapers: (id) => api.get(`/users/${id}/papers`),
  getUserTasks: (id) => api.get(`/users/${id}/tasks`),
};

// Dashboard API
export const dashboardAPI = {
  getShared: () => api.get('/dashboard'),  // Collaborative dashboard - ALL users' data
  getPersonal: () => api.get('/dashboard/personal'),  // Personal dashboard - own data only
};

// Supervisor dashboard API
export const supervisorAPI = {
  getDashboard: () => api.get('/users/supervisor/dashboard'),
  getAllActivities: (params) => api.get('/users/supervisor/activities', { params }),
};

// Personal To-Do API (Supervisor only)
export const personalTodoAPI = {
  getAll: (params) => api.get('/personal-todos', { params }),
  getOne: (id) => api.get(`/personal-todos/${id}`),
  create: (data) => api.post('/personal-todos', data),
  update: (id, data) => api.put(`/personal-todos/${id}`, data),
  delete: (id) => api.delete(`/personal-todos/${id}`),
  getStats: () => api.get('/personal-todos/stats'),
};
