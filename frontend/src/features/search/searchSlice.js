import { createSlice } from "@reduxjs/toolkit";
import { SearchProductAPI } from "./searchThunk";

const initialState = {
  loading: false,
  error: null,
  product: [],
  searchProductCount: 0,
};

const searchProductSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    clearSearch: (state) => {
      state.product = [];
      state.searchProductCount = 0;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(SearchProductAPI.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(SearchProductAPI.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload?.results;
        state.searchProductCount = action.payload?.count;
      })
      .addCase(SearchProductAPI.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export default searchProductSlice.reducer;
export const { clearSearch } = searchProductSlice.actions;
