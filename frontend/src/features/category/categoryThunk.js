import { createAsyncThunk } from "@reduxjs/toolkit";
import { getCategory } from "../../middleware/productApi";

export const fetchCategories = createAsyncThunk(
  "category/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getCategory();
      return data.filter((p) => p.status);
    } catch (error) {
      return rejectWithValue("Failed to fetch categories");
    }
  },
);
