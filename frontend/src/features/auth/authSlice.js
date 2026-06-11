import { createSlice } from "@reduxjs/toolkit";
import {
  loginUser,
  registerUser,
  getUserProfile,
  fetchAdminStatus,
} from "./authThunk";

const initialState = {
  isLoading: false,
  error: null,
  user: null,
  userRole: "user",
  token: null,
  isLoggedIn: false,
  isAdmin: false,
  sessionExpired: false,
};

const pickToken = (data) => data?.token;

const pickUser = (data) => data?.user;

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
    setSessionExpired: (state) => {
      state.sessionExpired = true;
    },
    clearSessionExpired: (state) => {
      state.sessionExpired = false;
    },

    logout: (state) => {
      state.isLoading = false;
      state.error = null;
      state.user = null;
      state.userRole = "user";
      state.token = null;
      state.isLoggedIn = false;
      state.isAdmin = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = pickUser(action.payload);
        state.token = pickToken(action.payload) || state.token;
        state.isLoggedIn = Boolean(state.token);
        state.userRole = state.user?.role || "user";
        state.isAdmin =
          state.user?.role === "admin" || state.userRole === "admin";
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Login failed";
      })

      // registration cases
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = pickToken(action.payload) || state.token;
        state.isAdmin =
          state.user?.role === "admin" || state.userRole === "admin";
        state.userRole = state.user?.role || "user";
        state.user = pickUser(action.payload);
        state.isLoggedIn = Boolean(state.token);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Registration failed";
      })

      // get profile for token validation (optional)
      .addCase(getUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = pickUser(action.payload) || state.user;
        state.userRole = state.user?.role || "user";
        state.isAdmin = state.user?.role === "admin";
        state.isLoggedIn = true;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to fetch profile";
        state.token = null; // invalidate token on profile fetch failure
        state.isLoggedIn = false;
        state.user = null;
        state.isAdmin = false;
      })

      // check admin status(IsAdmin Or Not)
      .addCase(fetchAdminStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAdminStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        console.log(action.payload);
        state.isAdmin = action.payload?.role === "admin"; // adjust to your API response shape
      })
      .addCase(fetchAdminStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.isAdmin = false;
        state.error = action.payload || "Failed to verify admin";
      });
  },
});

export default authSlice.reducer;

export const {
  clearAuthError,
  logout,
  setSessionExpired,
  clearSessionExpired,
} = authSlice.actions;
