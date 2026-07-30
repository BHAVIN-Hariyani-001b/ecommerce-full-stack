import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  createUser,
  deleteUser,
  fetchUser,
  updateUser,
} from "../../middleware/user";

export const fetchUserAPI = createAsyncThunk(
  "user/fetchUserAPI",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchUser();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "please try again");
    }
  },
);

export const createUserAPI = createAsyncThunk(
  "user/createUserAPI",
  async (userData, { rejectWithValue }) => {
    const { UName, UPassword, Status, UEmail } = userData;
    try {
      const response = await createUser({
        username: UName,
        password: UPassword,
        role: Status,
        email: UEmail,
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "please try again");
    }
  },
);

export const updateUserAPI = createAsyncThunk(
  "user/updateUser",
  async ({ id, userData }, { rejectWithValue }) => {
    const { UName, Status, UEmail } = userData;

    try {
      const response = await updateUser({
        id,
        username: UName,
        role: Status,
        email: UEmail,
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "please try again");
    }
  },
);

export const deleteUserAPI = createAsyncThunk(
  "user/deleteUserAPI",
  async (id, { rejectWithValue }) => {
    try {
      const response = await deleteUser(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "please try again");
    }
  },
);
