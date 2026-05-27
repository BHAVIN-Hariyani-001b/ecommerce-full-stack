import { createAsyncThunk } from "@reduxjs/toolkit";
import { productAdd } from "../../middleware/productAddApi";

export const addProduct = createAsyncThunk(
  "productAdd/addProduct",
  async (formData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const data = await productAdd({ formData, token });
      console.log(data);
      return data;
    } catch (error) {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Something went wrong";
      return rejectWithValue(message);
    }
  },
);
