import axios from "axios";
import { store } from "../features/store";
import { logout } from "../features/authSlice";
import { APP_LINKS } from "../constants";

const API_URL = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

const axiosPrivate = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request interceptor - Add token to requests
axiosPrivate.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle token expiration
axiosPrivate.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If token is expired or unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Logout user and redirect to login
      store.dispatch(logout());

      // Optionally redirect to login
      window.location.href = APP_LINKS.LOGIN;
    }

    return Promise.reject(error);
  }
);
export { axiosInstance, axiosPrivate, API_URL };
