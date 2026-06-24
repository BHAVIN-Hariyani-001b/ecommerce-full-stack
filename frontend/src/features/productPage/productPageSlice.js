import { createSlice } from "@reduxjs/toolkit";
import { productPageAPI } from "./ProductPageThunk";

const initialState = {
  loading: false,
  error: null,
  product: [],
};

const productReducer = createSlice({
  name: "productPage",
  initialState,
  reducers: {
    clearProduct: (state) => {
      state.error = null;
      state.loading = false;
      state.product = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(productPageAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(productPageAPI.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload?.product;
      })
      .addCase(productPageAPI.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export default productReducer.reducer;
export const { clearProduct } = productReducer.actions;
