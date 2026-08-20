import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  AddAddress,
  AddressGet,
  DeleteAddress,
  UpdateAddress,
} from "../../middleware/userAddress.js";

export const GetUserAddress = createAsyncThunk(
  "Address/GetUserAddress",
  async (id, { rejectWithValue }) => {
    try {
      const response = await AddressGet(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "please try again");
    }
  },
);

export const AddUserAddress = createAsyncThunk(
  "Address/AddUserAddress",
  async ({ AddressData }, { rejectWithValue, getState }) => {
    try {
      const user_id = getState().auth.user?.id;
      const response = await AddAddress({ user_id, AddressData });
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error);
    }
  },
);

export const UpdateUserAddress = createAsyncThunk(
  "Address/UpdateUserAddress",
  async ({ id, AddressData }, { rejectWithValue }) => {
    try {
      const response = await UpdateAddress({ id, AddressData });
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error);
    }
  },
);

export const DeleteUserAddress = createAsyncThunk(
  "Address/DeleteUserAddress",
  async (id, { rejectWithValue }) => {
    try {
      const response = await DeleteAddress(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error);
    }
  },
);
