import { createSlice } from "@reduxjs/toolkit";
import {
  addNewBrand,
  deleteBrand,
  fetchBrand,
  updateBrand,
} from "./brandThunk";

const initialState = {
  loading: false,
  error: null,
  brand: [],
  isUpdate: false,
};

const brandSlice = createSlice({
  name: "brand",
  initialState,
  reducers: {
    setIsUpdateBrand: (state, action) => {
      state.isUpdate = action.payload ?? true;
    },
  },
  extraReducers: (builder) => {
    // get brand

    builder
      .addCase(fetchBrand.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(fetchBrand.fulfilled, (state, action) => {
        state.loading = false;
        console.log(action.payload);
        state.brand = action.payload?.brand;
      })
      .addCase(fetchBrand.rejected, (state, action) => {
        state.loading = false;
        state.error = null;
        state.error = action.payload;
      })

      // add brand
      .addCase(addNewBrand.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addNewBrand.fulfilled, (state, action) => {
        state.loading = false;
        state.brand.push(action.payload?.brand);
        state.isUpdate = true;
      })
      .addCase(addNewBrand.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // update brand

      .addCase(updateBrand.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBrand.fulfilled, (state, action) => {
        state.loading = false;
        const updateBrand = action.payload?.brand;

        const index = state.brand.findIndex(
          (BId) => BId.id === updateBrand?.id,
        );

        if (index !== -1) {
          state.brand[index] = updateBrand;
        }

        state.isUpdate = true;
      })
      .addCase(updateBrand.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      .addCase(deleteBrand.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBrand.fulfilled, (state, action) => {
        state.loading = false;
        console.log(action.payload)
        state.brand = state.brand.filter((bId) => bId.id !== action.payload);
        state.isUpdate = true;
      })
      .addCase(deleteBrand.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export const { setIsUpdateBrand } = brandSlice.actions;
export default brandSlice.reducer;
