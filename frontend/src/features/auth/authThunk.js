import { createAsyncThunk, ReducerType } from "@reduxjs/toolkit";
import {
  loginApi,
  registerApi,
  getProfileApi,
  checkAdmin,
  logoutApi,
  profileEdit,
} from "../../middleware/authApi";
import { addToCart, fetchCartItem } from "../card/cardThunk";
import { clearCart } from "../card/cardSlice";

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue, dispatch, getState }) => {
    try {
      const data = await loginApi({ email, password });
      const guestItems = getState().cart.items;
      // console.log(data);
      if (guestItems.length > 0 && data.role !== "admin") {
        for (const item of guestItems) {
          await dispatch(
            addToCart({
              user_id: data.user?.id,
              product_id: item?.id || item?.product_id,
              qty: item?.qty || 1,
            }),
          );
        }
        dispatch(clearCart());
      }

      dispatch(fetchCartItem(data.user?.id));
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "please try again");
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
      return rejectWithValue(error.response?.data?.error || "please try again");
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
      return rejectWithValue(error.response?.data?.error || "please try again");
    }
  },
);

export const fetchAdminStatus = createAsyncThunk(
  "auth/isAdmin",
  async (_, { rejectWithValue }) => {
    try {
      const data = await checkAdmin();
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "failed to fetch admin status",
      );
    }
  },
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await logoutApi();
      return response;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || "Logout failed");
    }
  },
);

export const editProfile = createAsyncThunk(
  "auth/editProfile",
  async ({ id, username, phone }, { rejectWithValue }) => {
    try {
      const response = await profileEdit({ id, username, phone });
      return response;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response?.data?.message);
    }
  },
);
