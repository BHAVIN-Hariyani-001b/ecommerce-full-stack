import { configureStore } from "@reduxjs/toolkit";
import categoryReducer from "../features/category/categotySlice";

export const store = configureStore({
  reducer: categoryReducer,
});
