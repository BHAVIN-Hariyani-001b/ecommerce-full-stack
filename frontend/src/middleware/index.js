import axios from "axios";
import toast from "react-hot-toast";
import { logout } from "../features/auth/authSlice";

const api = axios.create({
  baseURL: "http://localhost:5000/api/",
  withCredentials: true,
  timeout: 10000,
});

let store;

export const setupInterceptors = (_store) => {
  store = _store;
};

const refreshToken = async () => {
  await api.post("/auth/refresh");
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (
        originalRequest.url?.includes("/auth/login") ||
        originalRequest.url?.includes("/auth/refresh")
      ) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        await refreshToken();
        return api(originalRequest);
      } catch (refreshError) {
        toast.error("Session expired. Please login again.");
        if (store) {
          store.dispatch(logout());
        }
        setTimeout(() => {
          window.location.href = "/";
        }, 1500);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
