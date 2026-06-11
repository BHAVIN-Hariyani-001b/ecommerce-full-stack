import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  addProductRequest,
  deleteProductRequest,
  getProductRequest,
  updateProductRequest,
} from "../../middleware/productApi";

export const addProduct = createAsyncThunk(
  "productAdd/addProduct",
  async (formData, { rejectWithValue }) => {
    try {
      const data = await addProductRequest(formData);
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
      const res = await getProductRequest();
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
      const response = await updateProductRequest(id, formData);
      return response;
    } catch {
      return rejectWithValue("Failed to update Product");
    }
  },
);

export const deleteProductAPI = createAsyncThunk(
  "productAdd/deleteProduct",
  async (id, { rejectWithValue }) => {
    try {
      const response = await deleteProductRequest(id);
      return response.data;
    } catch {
      return rejectWithValue("Failed to delete product");
    }
  },
);
