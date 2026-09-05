import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  wishListAdd,
  wishListRemove,
  wishProductFetch,
} from "../../middleware/wishlist";

export const wishListFetchAPI = createAsyncThunk(
  "wishlist/wishListFetchAPI",
  async (id, { rejectWithValue }) => {
    try {
      const response = await wishProductFetch(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data.messagee);
    }
  },
);

export const wishListAddAPI = createAsyncThunk(
  "wishlist/wishListAddAPI",
  async ({ user_id, product_id }, { rejectWithValue }) => {
    try {
      const response = await wishListAdd({ user_id, product_id });
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data.messagee);
    }
  },
);

export const wishListRemoveAPI = createAsyncThunk(
  "wishlist/wishListRemoveAPI",
  async (id, { rejectWithValue }) => {
    try {
      const response = await wishListRemove(id);
      return response;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response?.data?.messagee);
    }
  },
);
