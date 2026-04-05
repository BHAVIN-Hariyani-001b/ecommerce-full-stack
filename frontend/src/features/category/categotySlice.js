import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  active: "All",
};

const categorySlice = createSlice({
  name: "categoty",
  initialState: initialState,
  reducers: {
    setCategory: (state, action) => {
      state.active = action.payload;
    },
  },
});

export default categorySlice.reducer;
export const { setCategory } = categorySlice.actions;
