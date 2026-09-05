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
import forgotPasswordReducer from "./forgotPassword/forgotPasswordSlice";
import brandReducer from "../admin/features/Brand/brandSlice.js";
import attributeReducer from "../admin/features/attributes/attributesSlice";
import userReducer from "../admin/features/user/userSlice";
import reviewReducer from "../features/review/ReviewSlice";
import userAddressReducer from "./userAddress/userAddressSlice";
import wishlistReducer from "./wishlist/wishlistSlice";

const storage = storageDefault.default || storageDefault;

const persistConfigCategory = {
  key: "category",
  storage,
  whitelist: ["active", "category"],
};

const persistConfigAuth = {
  key: "auth",
  storage,
  whitelist: ["user", "isLoggedIn", "userRole"],
};

const persistConfigCart = {
  key: "cart",
  storage,
  whitelist: ["items", "count", "totalPrice"],
};

const persistConfigWishList = {
  key: "wishlist",
  storage,
  whitelist: ["wishListProduct", "wishListProductList"],
};

const rootReducer = combineReducers({
  userCategory: persistReducer(persistConfigCategory, userCategoryReducer),
  auth: persistReducer(persistConfigAuth, authReducer),
  productAdd: productAddReducer,
  adminCategory: persistReducer(persistConfigCategory, adminCategoryReducer),
  homePageProduct: homePageProductReducer,
  categoryProduct: categoryProductReducer,
  cart: persistReducer(persistConfigCart, cartReducer),
  searchProduct: searchReducer,
  product: productReducer,
  forgotPassword: forgotPasswordReducer,
  brand: brandReducer,
  attribute: attributeReducer,
  user: userReducer,
  review: reviewReducer,
  address: userAddressReducer,
  wishlist: persistReducer(persistConfigWishList, wishlistReducer),
});

export default rootReducer;
