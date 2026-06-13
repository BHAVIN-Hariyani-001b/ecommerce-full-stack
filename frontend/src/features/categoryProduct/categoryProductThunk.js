import { createAsyncThunk } from "@reduxjs/toolkit";
import { getCategoryProduct } from "../../middleware/category";

export const fetchCategoryProduct = createAsyncThunk(
  "categoryProduct/fetchCategoryProduct",
  async (category, { rejectWithValue }) => {
    try {
      const response = getCategoryProduct(category);
      return response;
    } catch {
      return rejectWithValue("Faild to Fetch Product");
    }
  },
);
