import { createAsyncThunk } from "@reduxjs/toolkit";
import { productPage } from "../../middleware/productPage";

export const productPageAPI = createAsyncThunk(
  "productPage/productPageAPI",
  async (ProductId, { rejectWithValue }) => {
    try {
      const response = productPage(ProductId);
      return response;
    } catch {
      return rejectWithValue("Product Not Found, Please Try again");
    }
  },
);
