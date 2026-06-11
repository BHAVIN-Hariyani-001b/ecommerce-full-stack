import { createSlice } from "@reduxjs/toolkit";
import {
  addProduct,
  deleteProductAPI,
  ProductGet,
  UpdateProductAPI,
} from "./productAddThunk";

const initialState = {
  loading: false,
  error: null,
  success: false,
  products: [],
  isUpdateProduct: false,
};

const productAddSlice = createSlice({
  name: "productAdd",
  initialState,
  reducers: {
    resetProductAdd: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.isUpdateProduct = false;
    },
    setIsUpdatedProduct: (state, action) => {
      state.isUpdateProduct = action.payload ?? false;
    },
  },
  extraReducers: (builder) => {
    builder
      // get product
      .addCase(ProductGet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(ProductGet.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.products = action.payload?.products ?? action.payload;
      })
      .addCase(ProductGet.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      // add product
      .addCase(addProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.success = true;
        state.loading = false;
        state.products.push(action.payload);
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      // update product
      .addCase(UpdateProductAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(UpdateProductAPI.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const index = state.products.findIndex(
          (p) => p.id === action.payload.id,
        );
        if (index !== -1) state.products[index] = action.payload;
      })
      .addCase(UpdateProductAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // delete product
      .addCase(deleteProductAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProductAPI.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.products = state.products.filter(
          (p) => p.id !== action.meta.arg, 
        );
      })
      .addCase(deleteProductAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetProductAdd, setIsUpdatedProduct } = productAddSlice.actions;
export default productAddSlice.reducer;
