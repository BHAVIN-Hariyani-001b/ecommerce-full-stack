import { createSlice } from "@reduxjs/toolkit";
import { fetchCategoryProduct } from "./categoryProductThunk";

const initialState = {
  products: [],
  loading: false,
  error: null,
};

const categoryProductSlice = createSlice({
  name: "categoryProduct",
  initialState,
  reducers: {
    clearCategory: (state) => {
      state.products = [];
      state.currentCategoryId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategoryProduct.pending, (state) => {
        state.loading = true;
        state.loading = null;
      })
      .addCase(fetchCategoryProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
      })
      .addCase(fetchCategoryProduct.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });

      
  },
});

export default categoryProductSlice.reducer;
export const { clearCategory } = categoryProductSlice.actions;
