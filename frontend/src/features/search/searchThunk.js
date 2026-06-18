import { createAsyncThunk } from "@reduxjs/toolkit";
import { searchProduct } from "../../middleware/search";

export const SearchProductAPI = createAsyncThunk(
  "search/SearchProductAPI",
  async (query, { rejectWithValue }) => {
    try {
      console.log(query);
      const response = await searchProduct(query);
      return response;
    } catch {
      return rejectWithValue("Faild To Search");
    }
  },
);
