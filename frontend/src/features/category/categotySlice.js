import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getCategory } from "../../middleware/productCategory";

export const fetchCategories = createAsyncThunk(
  "category/fetchCategories",
  async () => {
    return await getCategory();
  }
);

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
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.category = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default categorySlice.reducer;
export const { setCategory } = categorySlice.actions;
