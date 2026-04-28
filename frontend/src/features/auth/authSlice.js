import { createSlice } from "@reduxjs/toolkit";
import { loginUser, registerUser, getUserProfile } from "./authThunk";

const initialState = {
  isLoading: false,
  error: null,
  data: null, // raw API response
  user: null,
  token: null,
  isLoggedIn: false,
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
    logout: (state) => {
      state.isLoading = false;
      state.error = null;
      state.data = null;
      state.user = null;
      state.token = null;
      state.isLoggedIn = false;
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
        state.token = pickToken(action.payload) || state.token;
        state.isLoggedIn = Boolean(state.token);
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
        state.isLoggedIn = Boolean(state.token);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Registration failed";
      })

      // get profile for token validation (optional)
      .addCase(getUserProfile.pending,(state)=>{
        state.isLoading = true;
        state.error = null; 
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.user = action.payload || state.user;
        state.isLoggedIn = false;
        state.data = action.payload;
        state.user = pickUser(action.payload) || state.user;
      })
      .addCase(getUserProfile.rejected, (state) => {
        state.token = null; // invalidate token on profile fetch failure
        state.isLoggedIn = false;
      })
  },
});

export const { clearAuthError, logout } = authSlice.actions;
export default authSlice.reducer;
