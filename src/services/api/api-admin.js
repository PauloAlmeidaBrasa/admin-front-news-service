

import axios from 'axios';
import { getApiUrl } from '../Utils/env';


const api = axios.create({
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true
});

// a promise queue to prevent multiple refreshes at once
let isRefreshing = false;
let refreshSubscribers = [];

function onRefreshed(newToken) {
  refreshSubscribers.forEach(cb => cb(newToken));
  refreshSubscribers = [];
}


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


api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // only handle 401 once per request
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // If a refresh is already happening, queue this request
      if (isRefreshing) {
        return new Promise((resolve) => {
          refreshSubscribers.push((token) => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            resolve(api(originalRequest));
          });
        });
      }

      isRefreshing = true;
      try {

        const res = await axios.get(getApiUrl('refresh'));
        const newAccessToken = res.data.access_token;

        localStorage.setItem('auth', newAccessToken);
        api.defaults.headers['Authorization'] = `Bearer ${newAccessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;


        // notify queued requests
        onRefreshed(newAccessToken);
        isRefreshing = false;

        // retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        console.error('Token refresh failed:', refreshError);

       // optionally redirect to login
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const newsAPIAuth = {
  getLogin: async (credentials) => {
    return await api.post(getApiUrl('login'),credentials,{withCredentials:true})
  },
};


export const newsAPI = {
  // getLogin: () => api.post(getApiUrl('login')),
  getLogin: (credentials) => {
    api.create({withCredentials: true})
    api.post(getApiUrl('login'),credentials)
  },
  // getById: (id) => api.get(`/api/news/${id}`),
  // create: (data) => api.post('/api/news', data),
  // update: (id, data) => api.patch(`/api/news/${id}`, data),
  // delete: (id) => api.delete(`/api/news/${id}`),
};


export const newsAPINews = {
  getAll: async () => {
    return api.get(getApiUrl('news/get-news')) 
  },
  // getById: (id) => api.get(`/api/news/${id}`),
  // create: (data) => api.post('/api/news', data),
  // update: (id, data) => api.patch(`/api/news/${id}`, data),
  // delete: (id) => api.delete(`/api/news/${id}`),
};

export default api;