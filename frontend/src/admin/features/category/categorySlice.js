import { createSlice } from "@reduxjs/toolkit";
import { fetchCategories } from "../../../features/category/categoryThunk";
import { NewaddCategory } from "./categoryThunk";

const initialState = {
  active: "All",
  category: [],
  loading: false,
  error: null,
  successMessage: null,
};

const categorySlice = createSlice({
  name: "adminCategory",
  initialState: initialState,
  reducers: {
    setCategory: (state, action) => {
      state.active = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch categories
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.category = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // add category
      .addCase(NewaddCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(NewaddCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.category.push(action.payload);
        state.successMessage = "Category added successfully";
      })
      .addCase(NewaddCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

      // update category
  },
});

export default categorySlice.reducer;
export const { setCategory } = categorySlice.actions;
