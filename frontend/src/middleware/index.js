import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:5000/api/",
  timeout: 5000,
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
    }
  );
};

export default api;
