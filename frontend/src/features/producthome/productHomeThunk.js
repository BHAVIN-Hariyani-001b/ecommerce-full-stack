import { createAsyncThunk } from "@reduxjs/toolkit";
import { getHomePageProduct } from "../../middleware/homePage";

export const fetchHomePageProduct = createAsyncThunk(
  "producthome/fetchHomePageProduct",
  async (limit, { rejectWithValue }) => {
    try{
        const response = await getHomePageProduct(limit = 10);
        console.log(response)
        return response;
    } catch{
        return rejectWithValue("Faild to Fetch Home page Product")
    }
  },
);
