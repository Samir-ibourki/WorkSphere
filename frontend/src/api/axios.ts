import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";

const apiURL: string = 'http://localhost:3030/api';

const api = axios.create({
  baseURL: apiURL,
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {

    const token = useAuthStore.getState().token;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    return response.data; 
  },
  (error) => {
   
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;
