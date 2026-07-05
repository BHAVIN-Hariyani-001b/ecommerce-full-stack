import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  loginApi,
  registerApi,
  getProfileApi,
  checkAdmin,
} from "../../middleware/authApi";
import { addToCart, fetchCartItem } from "../card/cardThunk";
import { clearCart } from "../card/cardSlice";
// import { logout } from "./authSlice";

const getErrorMessage = (error) => {
  const data = error?.response?.data;
  return (
    data?.message ||
    data?.error ||
    data?.detail ||
    (typeof data === "string" ? data : null) ||
    error?.message ||
    "Request failed"
  );
};

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue, dispatch, getState }) => {
    try {
      const data = await loginApi({ email, password });
      const guestItems = getState().cart.items;
      // console.log(data);
      if (guestItems.length > 0 && data.role !== "admin") {
        for (const item of guestItems) {
          await dispatch(
            addToCart({
              user_id: data.user?.id,
              product_id: item?.id || item?.product_id,
              qty: item?.qty || 1,
            }),
          );
        }
        dispatch(clearCart());
      }

      dispatch(fetchCartItem(data.user?.id));
      return data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ username, email, password }, { rejectWithValue }) => {
    try {
      const data = await registerApi({ username, email, password });
      return data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const getUserProfile = createAsyncThunk(
  "auth/getUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getProfileApi();
      return data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const fetchAdminStatus = createAsyncThunk(
  "auth/isAdmin",
  async (_, { rejectWithValue }) => {
    try {
      const data = await checkAdmin();
      return data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// export const logoutUser = createAsyncThunk(
//   "auth/logout",
//   async (_, { dispatch, rejectWithValue }) => {
//     try {
//       await loginApi();          // server deletes cookie
//       dispatch(logout());         // clear Redux state
//     } catch (err) {
//       dispatch(logout());         // clear Redux even if server fails
//       return rejectWithValue(
//         err.response?.data?.error || "Logout failed"
//       );
//     }
//   }
// );
