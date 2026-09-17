import { createSlice } from "@reduxjs/toolkit";
import {
  changeOrderStatusAPI,
  createOrderAPI,
  generateInvoiceAPI,
  getOrderAPI,
  getOrderOneAPI,
  getOrderSummaryAPI
} from "./orderThunk";

const initialState = {
  loading: false,
  error: null,
  order: [],
  orderSummary: [],
  invoice_link: "",
  orderOne: null,
};

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // get one order
      .addCase(getOrderOneAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderOneAPI.fulfilled, (state, action) => {
        state.loading = false;
        state.orderOne = action.payload?.data ?? null;
      })
      .addCase(getOrderOneAPI.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      // get all order data
      .addCase(getOrderAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderAPI.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload?.data ?? [];
      })
      .addCase(getOrderAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.order = [];
      })

      // create order
      .addCase(createOrderAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrderAPI.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.data) {
          state.order.push(action.payload.data);
        }
      })
      .addCase(createOrderAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // status change
      .addCase(changeOrderStatusAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changeOrderStatusAPI.fulfilled, (state, action) => {
        state.loading = false;
        const orderData = action.payload?.data;
        const index = state.order.findIndex((or) => or.id == orderData?.id);

        if (index !== -1) {
          state.order[index] = orderData;
        }
        if (state.orderOne?.id == orderData?.id) {
          state.orderOne = orderData;
        }
      })
      .addCase(changeOrderStatusAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // get summary
      .addCase(getOrderSummaryAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderSummaryAPI.fulfilled, (state, action) => {
        state.loading = false;
        state.orderSummary = action.payload?.data ?? [];
      })
      .addCase(getOrderSummaryAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // file access
      .addCase(generateInvoiceAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateInvoiceAPI.fulfilled, (state, action) => {
        state.loading = false;
        state.invoice_link = action.payload?.data;
      })
      .addCase(generateInvoiceAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});

export default orderSlice.reducer;
