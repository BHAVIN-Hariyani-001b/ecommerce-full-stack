import { createAsyncThunk } from "@reduxjs/toolkit";
import { loginApi, registerApi, getProfileApi } from "../../middleware/authApi";

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
  "auth/loginUser",
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
  "auth/registerUser",
  async ({ username, email, password }, { rejectWithValue }) => {
    try {
      const data = await registerApi({ username, email, password });
      return data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const getUserProfile = createAsyncThunk(
  "auth/getUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getProfileApi();
      return data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);



