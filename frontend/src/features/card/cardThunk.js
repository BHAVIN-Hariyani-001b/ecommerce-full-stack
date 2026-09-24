import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  addCart,
  fetchCart,
  incrementCartProduct,
  decrementCartProduct,
  ClearCart,
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
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to load cart",
      );
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
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to add item to cart",
      );
    }
  },
);

export const ClearCartAPI = createAsyncThunk(
  "cart/ClearCartAPI",
  async (user_id, { rejectWithValue }) => {
    try {
      const response = await ClearCart(user_id);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to clear cart",
      );
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
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to increase cart item",
      );
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
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to decrease cart item",
      );
    }
  },
);
