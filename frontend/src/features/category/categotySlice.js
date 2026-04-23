import { createSlice } from "@reduxjs/toolkit";
import { fetchCategories } from "./categoryThunk";

const initialState = {
  active: "All",
  category: [],
  loading: false,
  error: null,
};

const categorySlice = createSlice({
  name: "category",
  initialState: initialState,
  reducers: {
    setCategory: (state, action) => {
      state.active = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.category = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        console.log(action.payload);
        // state.error = action.payload;
      });
  },
});

export default categorySlice.reducer;
export const { setCategory } = categorySlice.actions;
