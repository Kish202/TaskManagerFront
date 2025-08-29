import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL);
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.error || 'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

export const authAPI = {
  register: (userData) => api.post('/api/auth/register', userData),
  login: (credentials) => api.post('/api/auth/login', credentials),
  logout: () => api.post('/api/auth/logout'),
  getProfile: () => api.get('/api/auth/me'),
};

export const tasksAPI = {
  getTasks: (params = {}) => api.get('/api/tasks', { params }),
  getTask: (id) => api.get(`/api/tasks/${id}`),
  createTask: (taskData) => api.post('/api/tasks', taskData),
  updateTask: (id, taskData) => api.put(`/api/tasks/${id}`, taskData),
  deleteTask: (id) => api.delete(`/api/tasks/${id}`),
};

export const usersAPI = {
  getUsers: (params = {}) => api.get('/api/users', { params }),
  updateUserRole: (id, role) => api.patch(`/api/users/${id}/role`, { role }),
};

export const statsAPI = {
  getOverviewStats: () => api.get('/api/stats/overview'),
};

export default api;