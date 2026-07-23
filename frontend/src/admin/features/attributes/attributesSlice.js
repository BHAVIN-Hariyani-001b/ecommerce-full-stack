import { createSlice } from "@reduxjs/toolkit";
import {
  createAttributeAPI,
  deleteAttributeAPI,
  fetchAttributesAPI,
  updateAttributeAPI,
} from "./attributesThunk";

const initialState = {
  loading: false,
  error: null,
  attributes: [],
  isUpdate: false,
};

const attributesSlice = createSlice({
  name: "attributes",
  initialState,
  reducers: {
    setIsUpdateAttribute: (state, action) => {
      state.isUpdate = action.payload ?? true;
    },
  },
  extraReducers: (builder) => {
    builder
      // get attributes
      .addCase(fetchAttributesAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAttributesAPI.fulfilled, (state, action) => {
        state.loading = false;
        // console.log(action.payload);
        state.attributes = action.payload;
      })
      .addCase(fetchAttributesAPI.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      // add attributes
      .addCase(createAttributeAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAttributeAPI.fulfilled, (state, action) => {
        state.loading = false;
        state.attributes.push(action.payload?.data);
      })
      .addCase(createAttributeAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // update attribute

      .addCase(updateAttributeAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAttributeAPI.fulfilled, (state, action) => {
        state.loading = false;
        const updateAttribute = action.payload?.data;

        const index = state.attributes.findIndex(
          (Aid) => Aid.id == updateAttribute?.id,
        );

        if (index !== -1) {
          state.attributes[index] = updateAttribute;
        }

        state.isUpdate = true;
      })

      .addCase(updateAttributeAPI.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      // delete attribute

      .addCase(deleteAttributeAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAttributeAPI.fulfilled, (state, action) => {
        state.attributes = state.attributes.filter(
          (Aid) => Aid.id !== action.payload,
        );
        state.loading = false;
        state.isUpdate = true;
      })
      .addCase(deleteAttributeAPI.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export const { setIsUpdateAttribute } = attributesSlice.actions;
export default attributesSlice.reducer;
