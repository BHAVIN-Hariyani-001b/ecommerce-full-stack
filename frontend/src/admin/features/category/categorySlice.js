import { createSlice } from "@reduxjs/toolkit";
import {
  NewaddCategory,
  updateCategory,
  deleteCategory,
} from "./categoryThunk";

const initialState = {
  active: "All",
  category: [],
  loading: false,
  error: null,
  successMessage: null,
  isUpdated: false,
};

const categorySlice = createSlice({
  name: "adminCategory",
  initialState: initialState,
  reducers: {
    setCategory: (state, action) => {
      state.active = action.payload;
    },

    setIsUpdated: (state, action) => {
      state.isUpdated = action.payload ?? true;
    },
  },
  extraReducers: (builder) => {
    builder
      // add category
      .addCase(NewaddCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(NewaddCategory.fulfilled, (state,action) => {
        state.loading = false;
        state.category.push(action.payload.category)
        state.isUpdated = true;
      })
      .addCase(NewaddCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // update category
      .addCase(updateCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.loading = false;
        const updatedCategory = action.payload?.category;

        console.log(updatedCategory);

        const index = state.category.findIndex(
          (cat) => cat.id === updatedCategory.id,
        );

        console.log(index)

        if (index !== -1) {
          state.category[index] = updatedCategory;
        }

        state.isUpdated = true;
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // delete category
      .addCase(deleteCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.category = state.category.filter(
          (cat) => cat.id !== action.payload,
        );
        state.isUpdated = true;
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default categorySlice.reducer;
export const { setCategory, setIsUpdated } = categorySlice.actions;
