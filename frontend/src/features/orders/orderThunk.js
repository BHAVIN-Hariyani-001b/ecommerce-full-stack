import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  changeOrderStatus,
  createOrder,
  getOneOrder,
  getOrder,
  getSummary,
} from "../../middleware/order";

export const getOrderOneAPI = createAsyncThunk(
  "orders/getOrderOneAPI",
  async ({ order_id }, { rejectWithValue }) => {
    try {
      const response = await getOneOrder({ order_id });
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch order",
      );
    }
  },
);

export const getOrderAPI = createAsyncThunk(
  "orders/getOrderAPI",
  async (arg, { getState, rejectWithValue }) => {
    try {
      const user_id =
        (typeof arg === "object" && arg?.user_id) || getState().auth?.user?.id;

      if (!user_id) {
        return rejectWithValue("User not logged in");
      }

      const response = await getOrder({ user_id });
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch orders",
      );
    }
  },
);

export const createOrderAPI = createAsyncThunk(
  "orders/createOrderAPI",
  async ({ user_id, address_id, payment_method }, { rejectWithValue }) => {
    try {
      const response = await createOrder({
        user_id,
        address_id,
        payment_method,
      });
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          "Failed to create order",
      );
    }
  },
);

export const changeOrderStatusAPI = createAsyncThunk(
  "orders/changeOrderStatusAPI",
  async ({ order_id, status }, { rejectWithValue }) => {
    try {
      const response = await changeOrderStatus({ order_id, status });
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update order status",
      );
    }
  },
);

export const getOrderSummaryAPI = createAsyncThunk(
  "orders/getOrderSummaryAPI",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getSummary();
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update order status",
      );
    }
  },
);
