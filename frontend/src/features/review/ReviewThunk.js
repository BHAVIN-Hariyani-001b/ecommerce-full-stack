import { createAsyncThunk } from "@reduxjs/toolkit";
import { addReview, getReviews, updateReview } from "../../middleware/review";

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
  async ({ rating, review }, { rejectWithValue }) => {
    try {
      const response = await addReview({ rating, review });
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
  async ({ productId, reviewData }, { rejectWithValue }) => {
    try {
      const response = await updateReview({ productId, reviewData });
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
  async (productId, { rejectWithValue }) => {
    try {
      const response = await updateReview(productId);
      return response;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to Add Review Data",
      );
    }
  },
);
