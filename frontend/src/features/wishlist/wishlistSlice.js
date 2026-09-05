import { createSlice } from "@reduxjs/toolkit";
import {
  wishListAddAPI,
  wishListFetchAPI,
  wishListRemoveAPI,
} from "./wishlistThunk";

const initialState = {
  loading: false,
  error: null,
  wishListProduct: [],
  wishListProductList: [],
};

const wishListSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    setProductList: (state) => {
      state.wishListProductList = state.wishListProduct.map(
        (item) => item.product_id,
      );
    },
  },
  extraReducers: (builder) => {
    builder
      // data fetch
      .addCase(wishListFetchAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(wishListFetchAPI.fulfilled, (state, action) => {
        state.loading = false;
        state.wishListProduct = action.payload?.data;
        state.wishListProductList =
          action.payload?.data?.map((item) => item.product.id) || [];
      })
      .addCase(wishListFetchAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //  wish list data add
      .addCase(wishListAddAPI.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(wishListAddAPI.fulfilled, (state, action) => {
        state.loading = false;
        state.wishListProduct.push(action.payload?.data);
        state.wishListProductList.push(action.payload?.data?.product?.id);
      })
      .addCase(wishListAddAPI.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      // wish list data remove

      .addCase(wishListRemoveAPI.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(wishListRemoveAPI.fulfilled, (state, action) => {
        state.loading = false;
        state.wishListProduct = state.wishListProduct.filter(
          (wi) => wi.id !== action.payload?.data?.id,
        );
        state.wishListProductList = state.wishListProductList.filter(
          (pid) => pid !== action.payload.data?.product_id,
        );
      })
      .addCase(wishListRemoveAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default wishListSlice.reducer;
export const { setProductList } = wishListSlice.actions;
