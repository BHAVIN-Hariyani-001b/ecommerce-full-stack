import { createSlice } from "@reduxjs/toolkit";
import { fetchHomePageProduct } from "./productHomeThunk";

const initialState = {
  loading: false,
  error: null,
  HomePageProduct: [],
};

const productHomePage = createSlice({
  name: "productHomePage",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHomePageProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchHomePageProduct.fulfilled, (state, action) => {
        state.HomePageProduct = action.payload.categories;
        state.loading = false;
      })
      .addCase(fetchHomePageProduct.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export default productHomePage.reducer;
