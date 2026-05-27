import { combineReducers } from "@reduxjs/toolkit";
import categoryReducer from "../features/category/categotySlice";
import authReducer from "../features/auth/authSlice";
import productAddReducer from "../admin/features/productAdd/productAddSlice";
import storageDefault from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";

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
  category: persistReducer(persistConfigCategory, categoryReducer),
  auth: persistReducer(persistConfigAuth, authReducer),
  productAdd: productAddReducer,
});

export default rootReducer;
