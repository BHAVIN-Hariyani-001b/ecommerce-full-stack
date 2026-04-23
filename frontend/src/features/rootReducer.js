import { combineReducers } from "@reduxjs/toolkit";
import categoryReducer from "../features/category/categotySlice";
import authReducer from "../features/auth/authSlice";

const rootReducer = combineReducers({
  category: categoryReducer,
  auth: authReducer,
});

export default rootReducer;
