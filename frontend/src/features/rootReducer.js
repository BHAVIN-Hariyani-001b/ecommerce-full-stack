import { combineReducers } from "@reduxjs/toolkit";
import userCategoryReducer from "../features/category/categotySlice";
import authReducer from "../features/auth/authSlice";
import productAddReducer from "../admin/features/productAdd/productAddSlice";
import storageDefault from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
import adminCategoryReducer from "../admin/features/category/categorySlice";

const storage = storageDefault.default || storageDefault;

const persistConfigCategory = {
  key: "category",
  storage,
  whitelist: ["active", "category"],
};

const persistConfigAuth = {
  key: "auth",
  storage,
  whitelist: ["token", "user", "isLoggedIn", "userRole"],
};

const rootReducer = combineReducers({
  userCategory: persistReducer(persistConfigCategory, userCategoryReducer),
  auth: persistReducer(persistConfigAuth, authReducer),
  productAdd: productAddReducer,
  adminCategory: persistReducer(persistConfigCategory, adminCategoryReducer),
});

export default rootReducer;
