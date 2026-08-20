import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  addReview,
  deleteReview,
  getReviews,
  updateReview,
} from "../../middleware/review";

export const fetchReviewsAPI = createAsyncThunk(
  "reviews/fetchReviews",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await getReviews(productId);
      return response;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to Fetch Data",
      );
    }
  },
);

export const addReviewAPI = createAsyncThunk(
  "reviews/addReviewAPI",
  async (
    { user_id, product_id, product_rating, comment },
    { rejectWithValue },
  ) => {
    try {
      const response = await addReview({
        user_id,
        product_id,
        product_rating,
        comment,
      });
      return response;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to Add Review Data",
      );
    }
  },
);

export const updateReviewAPI = createAsyncThunk(
  "reviews/updateReviewAPI",
  async ({ reviewId, reviewData }, { rejectWithValue }) => {
    try {
      console.log(reviewId, reviewData);
      const response = await updateReview({ reviewId, reviewData });
      return response;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to Add Review Data",
      );
    }
  },
);

export const deleteReviewAPI = createAsyncThunk(
  "reviews/deleteReviewAPI",
  async (reviewId, { rejectWithValue, getState }) => {
    try {
      const user_id = getState().auth.user?.id;
      console.log(user_id);
      const response = await deleteReview({ reviewId, user_id });
      return response;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to Add Review Data",
      );
    }
  },
);
