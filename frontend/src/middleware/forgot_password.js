import api from "./index.js";

export const forgotPasswordAPI = async ({ email }) => {
  const response = await api.post("/auth/forgot-password", { email });
  return response.data;
};

export const verifyOtpAPI = async ({ email, otp }) => {
  const response = await api.post("/auth/verify-otp", { email, otp });
  return response.data;
};

export const resetPasswordAPI = async ({ email, newPassword }) => {
  const response = await api.post("/auth/reset-password", { email, newPassword });
  return response.data;
};  
