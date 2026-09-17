import { createSlice } from "@reduxjs/toolkit";
import {
  createGstAPI,
  deleteGstAPI,
  getGstAPI,
  getGstOneAPI,
  updateGstAPI,
} from "./gstThunk";

const initialState = {
  loading: false,
  error: null,
  success: false,
  gst: [],
  selectedGst: null,
  isUpdated: false,
};

const unwrapGstPayload = (payload) => payload?.data ?? payload;

const getGstRecord = (payload) => {
  const data = unwrapGstPayload(payload);
  return data?.gst ?? data?.data ?? data;
};

const getGstRecords = (payload) => {
  const data = unwrapGstPayload(payload);
  const records = data?.gst ?? data?.data ?? data;
  return Array.isArray(records) ? records : [];
};

const gstSlice = createSlice({
  name: "gst",
  initialState,
  reducers: {
    resetGstState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.isUpdated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getGstOneAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getGstOneAPI.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedGst = getGstRecord(action.payload);
      })
      .addCase(getGstOneAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getGstAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getGstAPI.fulfilled, (state, action) => {
        state.loading = false;
        state.gst = getGstRecords(action.payload);
      })
      .addCase(getGstAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createGstAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createGstAPI.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.isUpdated = true;
        state.gst.push(getGstRecord(action.payload));
      })
      .addCase(createGstAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateGstAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateGstAPI.fulfilled, (state, action) => {
        const updatedGst = getGstRecord(action.payload);
        const updatedId = updatedGst?.gst_id ?? updatedGst?.id;
        const index = state.gst.findIndex(
          (gst) => (gst.gst_id ?? gst.id) === updatedId,
        );

        state.loading = false;
        state.success = true;
        state.isUpdated = true;
        if (index !== -1) state.gst[index] = updatedGst;
      })
      .addCase(updateGstAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteGstAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteGstAPI.fulfilled, (state, action) => {
        const deletedId = action.meta.arg;
        state.loading = false;
        state.success = true;
        state.isUpdated = true;
        state.gst = state.gst.filter(
          (gst) => (gst.gst_id ?? gst.id) !== deletedId,
        );
      })
      .addCase(deleteGstAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetGstState } = gstSlice.actions;

export default gstSlice.reducer;
