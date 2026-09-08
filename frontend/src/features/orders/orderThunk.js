import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  changeOrderStatus,
  createOrder,
  getOneOrder,
  getOrder,
} from "../../middleware/order";

export const getOrderOneAPI = createAsyncThunk(
  "orders/getOrderOneAPI",
  async ({ user_id }, { rejectWithValue }) => {
    try {
      const response = await getOneOrder({ user_id });
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data.message);
    }
  },
);

export const getOrderAPI = createAsyncThunk(
  "orders/getOrderAPI",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getOrder();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data.message);
    }
  },
);

export const createOrderAPI = createAsyncThunk(
  "orders/createOrderAPI",
  async (
    {
      user_id,
      product_id,
      attribute_id,
      address_id,
      qty,
      total_amount,
      PPrice,
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await createOrder({
        user_id,
        product_id,
        attribute_id,
        address_id,
        qty,
        total_amount,
        PPrice,
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data.message);
    }
  },
);

export const changeOrderStatusAPI = createAsyncThunk(
  "orders/changeOrderStatusAPI",
  async ({ status }, { rejectWithValue }) => {
    try {
      const response = await changeOrderStatus({ status });
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data.message);
    }
  },
);
