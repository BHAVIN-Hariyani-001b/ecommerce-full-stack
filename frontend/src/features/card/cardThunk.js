import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  addCart,
  fetchCart,
  incrementCartProduct,
  decrementCartProduct,
} from "../../middleware/cart";

export const fetchCartItem = createAsyncThunk(
  "cart/fetchCartItem",
  async (user_id, { rejectWithValue }) => {
    try {
      const response = await fetchCart({ user_id });
      return response;
    } catch (error) {
      if (error.response?.status === 404) {
        return { cart: [] };
      }
      return rejectWithValue("faild to fetch cart item");
    }
  },
);

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (
    { user_id, product_id, attributes_value_ids, qty = 1 },
    { rejectWithValue },
  ) => {
    try {
      const response = await addCart({
        user_id,
        product_id,
        attributes_value_ids,
        qty,
      });
      return response;
    } catch {
      return rejectWithValue("faild to add cart item");
    }
  },
);

export const incrementCartItem = createAsyncThunk(
  "cart/incrementCartItem",
  async ({ cart_id, user }, { rejectWithValue }) => {
    try {
      if (!user) return { local: true, cart_id };
      const response = await incrementCartProduct({ cart_id });
      return response;
    } catch {
      return rejectWithValue("failed to increment");
    }
  },
);

export const decrementCartItem = createAsyncThunk(
  "cart/decrementCartItem",
  async ({ cart_id, user }, { rejectWithValue }) => {
    try {
      if (!user) return { local: true, cart_id };
      const response = await decrementCartProduct({ cart_id });
      return { ...response, cart_id };
    } catch {
      return rejectWithValue("failed to decrement");
    }
  },
);
