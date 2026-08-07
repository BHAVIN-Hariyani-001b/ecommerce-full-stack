import { createSlice } from "@reduxjs/toolkit";
import {
  addReviewAPI,
  deleteReviewAPI,
  fetchReviewsAPI,
  updateReviewAPI,
} from "./ReviewThunk";

const initialState = {
  reviews: [],
  loading: false,
  error: null,
  review_summary: [],
  isUpdate: false,
};

const reviewSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {
    setUserReviewUpdate: (state, action) => {
      state.isUpdate = action.payload ?? true;
    },
    clearReview: (state) => {
      state.reviews = [];
      state.review_summary = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch review
      .addCase(fetchReviewsAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.reviews = [];
        state.review_summary = [];
      })
      .addCase(fetchReviewsAPI.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload?.data;
        state.review_summary = action.payload?.review;
      })
      .addCase(fetchReviewsAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.reviews = [];
        state.review_summary = [];
      })

      //   add review
      .addCase(addReviewAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addReviewAPI.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews.push(action.payload?.data);
        state.review_summary = action.payload?.review;
      })
      .addCase(addReviewAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //   update review

      .addCase(updateReviewAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateReviewAPI.fulfilled, (state, action) => {
        state.loading = false;
        const UpdataUserReview = action.payload?.data;
        console.log(UpdataUserReview);
        const index = state.reviews.findIndex(
          (reviewItem) => reviewItem.id == UpdataUserReview?.id,
        );

        if (index !== -1) {
          console.log(UpdataUserReview, index);
          state.reviews[index] = UpdataUserReview;
        }
        state.review_summary = action.payload?.review;
      })
      .addCase(updateReviewAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //   delete review

      .addCase(deleteReviewAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteReviewAPI.fulfilled, (state, action) => {
        state.loading = false;
        console.log(action.payload);
        state.reviews = state.reviews.filter(
          (item) => item.id !== action.payload?.data,
        );
        state.review_summary = action.payload?.review;
      })
      .addCase(deleteReviewAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setUserReviewUpdate, clearReview } = reviewSlice.actions;
export default reviewSlice.reducer;
