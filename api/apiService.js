// C:\Users\USER\Documents\bondyt-merchant-app\api\apiService.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { refreshToken} from './auth';

const BASE_API_URL = process.env.BASE_API_URL || 'https://merchant-api.bondyt.com/api/v1';

const api = axios.create({
  baseURL: BASE_API_URL,
  timeout: 10000, // 10-second timeout
});

// Request interceptor
// Request interceptor
api.interceptors.request.use(
  async (config) => {
    try {
      console.log('[API_INTERCEPTOR] Processing request:', config.url);

      const token = await AsyncStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      console.log('[API_INTERCEPTOR] Request configured with authentication');
      return config;
    } catch (error) {
      console.error('[API_INTERCEPTOR] Request configuration error:', error);
      return Promise.reject(error);
    }
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    
    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const { accessToken } = await refreshToken();
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // await clearAuthData();
        // Emit an event that auth has failed
        EventEmitter.emit('AUTH_EXPIRED');
        throw new Error('Authentication expired');
      }
    }
    
    throw error;
  }
);

export default api;
