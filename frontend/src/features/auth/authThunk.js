import { createAsyncThunk } from "@reduxjs/toolkit";
import { loginApi, registerApi } from "../../middleware/authApi";

const getErrorMessage = (error) => {
  const data = error?.response?.data;
  return (
    data?.message ||
    data?.error ||
    data?.detail ||
    (typeof data === "string" ? data : null) ||
    error?.message ||
    "Request failed"
  );
};

export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const data = await loginApi({ email, password });
      return data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async ({ username, email, password }, { rejectWithValue }) => {
    try {
      const data = await registerApi({ username, email, password });
      return data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

