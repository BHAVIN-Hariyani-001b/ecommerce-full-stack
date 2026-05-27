import { createSlice } from "@reduxjs/toolkit";
import { addProduct } from "./productAddThunk";

const initialState = {
  loading: false,
  error: null,
  success: false,
};

const productAddSlice = createSlice({
  name: "productAdd",
  initialState,
  reducers: {
    resetProductAdd: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProduct.fulfilled, (state) => {
        state.success = true;
        state.loading = false;
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export const { resetProductAdd } = productAddSlice.actions;
export default productAddSlice.reducer;
