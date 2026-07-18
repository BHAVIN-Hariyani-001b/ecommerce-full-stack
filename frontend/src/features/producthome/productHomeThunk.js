import { createAsyncThunk } from "@reduxjs/toolkit";
import { getHomePageProduct } from "../../middleware/homePage";

export const fetchHomePageProduct = createAsyncThunk(
  "producthome/fetchHomePageProduct",
  async (limit, { rejectWithValue }) => {
    try {
      const response = await getHomePageProduct((limit = 10));
      // console.log(response)
      return response;
    } catch(error){
      if (error.response) {
        return rejectWithValue(
          error.response.data?.message || "Server error occurred.",
        );
      }

      if (error.request) {
        return rejectWithValue(
          "Unable to reach the server. Please check your internet connection.",
        );
      }

      return rejectWithValue(error.message || "Something went wrong.");
    }
  },
);
