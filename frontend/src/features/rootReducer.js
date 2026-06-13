import { combineReducers } from "@reduxjs/toolkit";
import userCategoryReducer from "../features/category/categotySlice";
import authReducer from "../features/auth/authSlice.js";
import productAddReducer from "../admin/features/productAdd/productAddSlice";
import storageDefault from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
import adminCategoryReducer from "../admin/features/category/categorySlice";
import homePageProductReducer from "../features/producthome/productHomeSlice";
import categoryProductReducer from "../features/categoryProduct/categoryProductSlice";

const storage = storageDefault.default || storageDefault;

const persistConfigCategory = {
  key: "category",
  storage,
  whitelist: ["active", "category"],
};

const persistConfigAuth = {
  key: "auth",
  storage,
  whitelist: ["user", "isLoggedIn", "userRole", "token"],
};

const persistConfigCategoryProduct = {
  key: "categoryProduct",
  storage,
  whitelist: ["products"],
};

const rootReducer = combineReducers({
  userCategory: persistReducer(persistConfigCategory, userCategoryReducer),
  auth: persistReducer(persistConfigAuth, authReducer),
  productAdd: productAddReducer,
  adminCategory: persistReducer(persistConfigCategory, adminCategoryReducer),
  homePageProduct: homePageProductReducer,
  categoryProduct: persistReducer(
    persistConfigCategoryProduct,
    categoryProductReducer,
  ),
});

export default rootReducer;
