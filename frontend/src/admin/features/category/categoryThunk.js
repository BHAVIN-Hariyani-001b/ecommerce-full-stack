import { createAsyncThunk } from "@reduxjs/toolkit";
import { addCategoryAPI, deleteCategoryAPI, updateCategoryAPI } from "../../middleware/category";

export const NewaddCategory = createAsyncThunk(
  "category/addCategory",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await addCategoryAPI(formData)
      return response.data;
    } catch (error) {
      console.error("Add Category Error:", error);
      return rejectWithValue(
        error?.response?.data?.message || "Failed to add category"
      );
    }
  },
);

export const updateCategory = createAsyncThunk(
  "category/updateCategory",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await updateCategoryAPI(id,formData)
      return response.data;
    } catch (error) {
      console.error("Update Category Error:", error);
      return rejectWithValue(
        error?.response?.data?.message || "Failed to update category"
      );
    }
  },
);

export const deleteCategory = createAsyncThunk(
  "category/deleteCategory",
  async (id, { rejectWithValue }) => {
    try {
      await deleteCategoryAPI(id) 
      return id;
    } catch (error) {
      console.error("Delete Category Error:", error);
      return rejectWithValue(
        error?.response?.data?.message || "Failed to delete category"
      );
    }
  },
);

