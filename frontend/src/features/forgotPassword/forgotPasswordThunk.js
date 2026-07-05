import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  forgotPasswordAPI,
  resetPasswordAPI,
  verifyOtpAPI,
} from "../../middleware/forgot_password";

export const forgotPasswordRequest = createAsyncThunk(
  "forgotPassword/forgotPasswordRequest",
  async ({ email }, { rejectWithValue }) => {
    try {
      const response = await forgotPasswordAPI({ email });
      return response;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.error);
    }
  },
);

export const verifyOtpRequest = createAsyncThunk(
  "forgotPassword/verifyOtpRequest",
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const response = await verifyOtpAPI({ email, otp });
      return response;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.error);
    }
  },
);

export const resetPasswordRequest = createAsyncThunk(
  "forgotPassword/resetPasswordRequest",
  async ({ email, newPassword }, { rejectWithValue }) => {
    try {
      const response = await resetPasswordAPI({ email, newPassword });
      return response;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.error);
    }
  },
);
