import { createAsyncThunk } from "@reduxjs/toolkit";
import { addCategory } from "../../middleware/category";

export const NewaddCategory = createAsyncThunk(
  "category/addCategory",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await addCategory(formData);
      console.log(response);
      return response;
    } catch (error) {
      return rejectWithValue("Failed to add category");
    }
  },
);
