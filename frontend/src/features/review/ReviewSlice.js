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
};

const reviewSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetch review
      .addCase(fetchReviewsAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviewsAPI.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload?.data;
      })
      .addCase(fetchReviewsAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //   add review
      .addCase(addReviewAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addReviewAPI.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews.push(action.payload?.data);
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
        const UpdataReview = action.payload?.data;
        const index = state.reviews.findIndex(
          (reviewItem) => reviewItem.id == UpdataReview?.id,
        );

        if (index !== -1) {
          state.brand[index] = UpdataReview;
        }
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
        state.reviews = state.brand.filter(
          (r) => r.id !== action.payload?.data,
        );
      })
      .addCase(deleteReviewAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setReviews, setLoading, setError } = reviewSlice.actions;
export default reviewSlice.reducer;
