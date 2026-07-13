import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  addBrandAPI,
  deleteBrandAPI,
  getBrandAPI,
  updateBrandAPI,
} from "../../middleware/brand";

export const fetchBrand = createAsyncThunk(
  "brand/FetchBrand",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getBrandAPI();
      return response;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to Fetch Data",
      );
    }
  },
);

export const addNewBrand = createAsyncThunk(
  "brand/AddNewBrand",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await addBrandAPI(formData);
      return response;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to Add Brand",
      );
    }
  },
);

export const updateBrand = createAsyncThunk(
  "brand/updateBrand",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      console.log(id);
      const response = await updateBrandAPI(id, formData);
      return response;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to Update Data",
      );
    }
  },
);

export const deleteBrand = createAsyncThunk(
  "brand/deleteBrand",
  async (id, { rejectWithValue }) => {
    try {
      await deleteBrandAPI(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to Delete Data",
      );
    }
  },
);
