import { createAsyncThunk } from "@reduxjs/toolkit";
import { productAdd } from "../../middleware/productApi";
import { getProduct } from "../../middleware/productApi";

export const addProduct = createAsyncThunk(
  "productAdd/addProduct",
  async (formData, { rejectWithValue }) => {
    try {
      const data = await productAdd(formData);
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

export const ProductGet = createAsyncThunk(
  "productAdd/getProduct",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getProduct();
      return res;
    } catch {
      return rejectWithValue("product not get, somthing went wrong");
    }
  },
);
