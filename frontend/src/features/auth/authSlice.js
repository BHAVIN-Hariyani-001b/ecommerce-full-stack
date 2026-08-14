import { createSlice } from "@reduxjs/toolkit";
import {
  loginUser,
  registerUser,
  getUserProfile,
  fetchAdminStatus,
  editProfile,
} from "./authThunk";

const initialState = {
  isLoading: false,
  error: null,
  user: null,
  userRole: "user",
  isLoggedIn: false,
  isAdmin: false,
  sessionExpired: false,

  authView: "signin",
  authOpen: false,
  forgotPassword: false,
};

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
      state.isLoggedIn = false;
      state.isAdmin = false;
    },

    setForgotPassword: (state, action) => {
      state.forgotPassword = action.payload;
    },

    setAuthView: (state, action) => {
      state.authView = action.payload;
    },

    setAuthOpen: (state, action) => {
      state.authOpen = action.payload;
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
        state.isLoggedIn = Boolean(state.user);
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
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
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
      })

      // update profile
      .addCase(editProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(editProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload?.user;
        state.error = null;
      })
      .addCase(editProfile.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      });
  },
});

export default authSlice.reducer;

export const {
  clearAuthError,
  logout,
  setSessionExpired,
  clearSessionExpired,
  setAuthOpen,
  setForgotPassword,
  setAuthView,
} = authSlice.actions;
