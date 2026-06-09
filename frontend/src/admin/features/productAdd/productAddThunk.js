import { createAsyncThunk } from "@reduxjs/toolkit";
import { productAdd, updateProduct } from "../../middleware/productApi";
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

export const UpdateProductAPI = createAsyncThunk(
  "productAdd/UpdateProduct",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await updateProduct(id,formData);
      return response;
    } catch {
      rejectWithValue("Failed to update Product")
    }
  },
);
