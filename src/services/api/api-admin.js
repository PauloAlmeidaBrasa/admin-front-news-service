// export const newsAPI = {
//   getAll: () => alert('kjsdnf'),
//   getById: (id) => api.get(`/news/${id}`),
//   create: (data) => api.post('/news', data),
//   update: (id, data) => api.put(`/news/${id}`, data),
//   delete: (id) => api.delete(`/news/${id}`),
// };

import axios from 'axios';
import { getApiUrl } from '../Utils/env';


const api = axios.create({
  // baseURL: getApiUrl,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  // withCredentials: true
});


// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    // console.log(localStorage.getItem('auth_token'))
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Auto logout if 401 response
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post(getApiUrl('login'), credentials),
  logout: () => api.post('/api/logout'),
  // getUser: () => api.get('/api/user'),
};

export const newsAPI = {
  getAll: () => api.get('/api/news'),
  getById: (id) => api.get(`/api/news/${id}`),
  create: (data) => api.post('/api/news', data),
  update: (id, data) => api.patch(`/api/news/${id}`, data),
  delete: (id) => api.delete(`/api/news/${id}`),
};

export default api;