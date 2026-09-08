import { createSlice } from "@reduxjs/toolkit";
import {
  changeOrderStatusAPI,
  createOrderAPI,
  getOrderAPI,
  getOrderOneAPI,
} from "./orderThunk";

const initialState = {
  loading: false,
  error: null,
  order: [],
  orderOne: [],
};

createSlice({
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
        state.orderOne = action.payload?.data;
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
        state.order = action.payload.data;
      })
      .addCase(getOrderAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // create order

      .addCase(createOrderAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrderAPI.fulfilled, (state, action) => {
        state.loading = false;
        state.order.push(action.payload?.data);
      })
      .addCase(createOrderAPI.pending, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //   status chane

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
      })
      .addCase(changeOrderStatusAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
