import { combineReducers } from "@reduxjs/toolkit";
import userCategoryReducer from "../features/category/categotySlice";
import authReducer from "../features/auth/authSlice.js";
import productAddReducer from "../admin/features/productAdd/productAddSlice";
import storageDefault from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
import adminCategoryReducer from "../admin/features/category/categorySlice";
import homePageProductReducer from "../features/producthome/productHomeSlice";
import categoryProductReducer from "../features/categoryProduct/categoryProductSlice";
import cartReducer from "./card/cardSlice.js";
import searchReducer from "./search/searchSlice";
import productReducer from "./productPage/productPageSlice.js";

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

const persistConfigCart = {
  key: "cart",
  storage,
  whitelist: ["items", "totalPrice", "count"],
};

const persistConfigHomePageProduct = {
  key: "productHomePage",
  storage,
  whitelist: ["productHomePage"],
};

const rootReducer = combineReducers({
  userCategory: persistReducer(persistConfigCategory, userCategoryReducer),
  auth: persistReducer(persistConfigAuth, authReducer),
  productAdd: productAddReducer,
  adminCategory: persistReducer(persistConfigCategory, adminCategoryReducer),
  homePageProduct: persistReducer(
    persistConfigHomePageProduct,
    homePageProductReducer,
  ),
  categoryProduct: persistReducer(
    persistConfigCategoryProduct,
    categoryProductReducer,
  ),
  cart: persistReducer(persistConfigCart, cartReducer),
  searchProduct: searchReducer,
  product: productReducer,
});

export default rootReducer;
