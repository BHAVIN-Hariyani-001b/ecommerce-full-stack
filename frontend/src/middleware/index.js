import axios from "axios";
import { toast } from "react-toastify";

const api = axios.create({
  baseURL: "http://127.0.0.1:5000/api/",
  withCredentials: true,
  timeout: 10000,
});

// Function to set up interceptor after store is created
export const setupInterceptors = (store) => {
  api.interceptors.request.use(
    (config) => {
      const state = store.getState();
      const token = state.auth?.token;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );
};

api.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response?.status === 401) {
      const message = error.response.data?.message;

      if (message === "Token has expired") {
        localStorage.clear();
        toast.error("Session expired. Please login again.");

        setTimeout(() => {
          window.location.href = "/";
        }, 1500);
      }
    }
    return Promise.reject(error);
  },
);

export default api;
