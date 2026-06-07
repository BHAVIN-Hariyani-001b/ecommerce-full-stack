import { createSlice } from "@reduxjs/toolkit";
import { addProduct, ProductGet } from "./productAddThunk";

const initialState = {
  loading: false,
  error: null,
  success: false,
  products: [],
};

const productAddSlice = createSlice({
  name: "productAdd",
  initialState,
  reducers: {
    resetProductAdd: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
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
        state.products = action.payload;
      })
      .addCase(ProductGet.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = true;
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
      });
  },
});

export const { resetProductAdd } = productAddSlice.actions;
export default productAddSlice.reducer;
