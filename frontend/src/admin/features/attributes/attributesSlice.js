import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  error: null,
  attributes: [],
};

const attributesSlice = createSlice({
  name: "attributes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(() => {});
  },
});

export default attributesSlice.reducer;
