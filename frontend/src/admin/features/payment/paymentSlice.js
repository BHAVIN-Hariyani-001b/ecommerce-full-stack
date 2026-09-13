import { createSlice } from "@reduxjs/toolkit";
import {
  paymentDataFetchAPI,
  paymentReportDataGetAPI,
  paymentStatusChangeAPI,
} from "./paymentThunk";

const initialState = {
  loading: false,
  error: null,
  paymentData: [],
  paymentReport: null,
};

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(paymentDataFetchAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(paymentDataFetchAPI.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentData = action.payload?.data ?? [];
      })
      .addCase(paymentDataFetchAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.paymentData = [];
      })

      .addCase(paymentStatusChangeAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(paymentStatusChangeAPI.fulfilled, (state, action) => {
        state.loading = false;
        const updatedPayment = action.payload?.data;
        const index = state.paymentData.findIndex(
          (payment) => payment.id === updatedPayment?.id,
        );
        if (index !== -1) state.paymentData[index] = updatedPayment;
      })
      .addCase(paymentStatusChangeAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(paymentReportDataGetAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(paymentReportDataGetAPI.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentReport = action.payload ?? null;
      })
      .addCase(paymentReportDataGetAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default paymentSlice.reducer;
