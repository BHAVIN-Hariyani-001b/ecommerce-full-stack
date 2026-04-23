import { createSlice } from "@reduxjs/toolkit";
import { loginUser, registerUser } from "./authThunk";

const initialState = {
  loading: false,
  error: null,
  data: null, // raw API response
  user: null,
  token: null,
};

const pickToken = (data) =>
  data?.token || data?.access_token || data?.accessToken || data?.data?.token || null;

const pickUser = (data) => data?.user || data?.data?.user || null;

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      state.loading = false;
      state.error = null;
      state.data = null;
      state.user = null;
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.user = pickUser(action.payload) || state.user;
        state.token = pickToken(action.payload) || state.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.user = pickUser(action.payload) || state.user;
        state.token = pickToken(action.payload) || state.token;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Registration failed";
      });
  },
});

export const { clearAuthError, logout } = authSlice.actions;
export default authSlice.reducer;

