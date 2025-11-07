// export const newsAPI = {
//   getAll: () => alert('kjsdnf'),
//   getById: (id) => api.get(`/news/${id}`),
//   create: (data) => api.post('/news', data),
//   update: (id, data) => api.put(`/news/${id}`, data),
//   delete: (id) => api.delete(`/news/${id}`),
// };

import axios from 'axios';
import { getAdminApiUrl, getApiUrl } from '../Utils/env';


const api = axios.create({
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true
});


// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    // console.log(localStorage.getItem('auth_token'))
    const token = localStorage.getItem('auth');
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
  async (error) => {

    const originalRequest = error.config;
    console.log(originalRequest)

    // If token expired and we haven’t retried yet
    if (error.response?.code === "token_expired") {
      originalRequest._retry = true;
          alert('kjnrljk')

      try {
        // Call the refresh endpoint (cookie is automatically sent)
        const res = await axios.post(
          'http://localhost:8000/api/refresh',
          {},
          { withCredentials: true }
        );

        const newAccessToken = res.data.access_token;
        sessionStorage.setItem('auth', newAccessToken);

        // Update Authorization header and retry original request
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error('Refresh failed', refreshError);
        // Optionally redirect to login if refresh fails
      }
    }

    // If refresh also fails → logout
    return Promise.reject(error);
  }
);

export const callPost = async (endpoint, payload) => {

  return api.post(`${getAdminApiUrl()}${endpoint}`,payload)

  // login: (credentials) => api.post(getApiUrl('login'), credentials),
  // logout: () => api.post('/api/logout'),
  // getUser: () => api.get('/api/user'),
};

export const newsAPI = {
  // getAll: () => api.get('/api/news'),
  // getById: (id) => api.get(`/api/news/${id}`),
  // create: (data) => api.post('/api/news', data),
  // update: (id, data) => api.patch(`/api/news/${id}`, data),
  // delete: (id) => api.delete(`/api/news/${id}`),
};

export const newsAPINews = {
  getAll: async () => api.get(getApiUrl('news/get-news')),
  // getById: (id) => api.get(`/api/news/${id}`),
  // create: (data) => api.post('/api/news', data),
  // update: (id, data) => api.patch(`/api/news/${id}`, data),
  // delete: (id) => api.delete(`/api/news/${id}`),
};

export default api;