import api from "./index.js";

export const loginApi = async ({ email, password }) => {
  const response = await api.post("/login", { email, password });
  return response?.data;
};

export const registerApi = async ({ username, email, password }) => {
  const response = await api.post("/register", { username, email, password });
  return response?.data;
};

