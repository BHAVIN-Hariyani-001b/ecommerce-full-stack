import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  paymentDataGet,
  paymentReportDataGet,
  paymentStatusChange,
} from "../../middleware/payment";

export const paymentDataFetchAPI = createAsyncThunk(
  "payment/getPaymentData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await paymentDataGet();
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch payments",
      );
    }
  },
);

export const paymentReportDataGetAPI = createAsyncThunk(
  "payment/paymentReportDataGetAPI",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await paymentReportDataGet(filters);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch payment report",
      );
    }
  },
);

export const paymentStatusChangeAPI = createAsyncThunk(
  "payment/paymentStatusChangeAPI",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await paymentStatusChange({ id, status });
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update payment status",
      );
    }
  },
);

export const paymentStautsChangeAPI = paymentStatusChangeAPI;
