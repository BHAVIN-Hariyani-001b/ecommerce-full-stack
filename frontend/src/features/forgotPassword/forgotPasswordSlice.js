import { createSlice } from "@reduxjs/toolkit";
import {
  forgotPasswordRequest,
  resetPasswordRequest,
  verifyOtpRequest,
} from "./forgotPasswordThunk";

const initialState = {
  loading: false,
  error: null,
  step: 1,
  email: "",
  otpVerified: false,
  isPasswordMatch: false,
};

const forgotPasswordSlice = createSlice({
  name: "forgotPassword",
  initialState,
  reducers: {
    setStep: (state, action) => {
      state.step = action.payload;
    },
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    setIsPasswordMath: (state, action) => {
      state.isPasswordMatch = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // forgotPasswordRequest
      .addCase(forgotPasswordRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPasswordRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // state.step = 2;
        state.email = action.meta.arg.email;
      })
      .addCase(forgotPasswordRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // verifyOtpRequest
      .addCase(verifyOtpRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtpRequest.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        // state.step = 3;
        state.otpVerified = true;
      })
      .addCase(verifyOtpRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // resetpassword
      .addCase(resetPasswordRequest.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(resetPasswordRequest.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        state.step = 1;
        state.email = "";
        state.otpVerified = false;
        state.isPasswordMatch = false;
      })
      .addCase(resetPasswordRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setStep, setEmail, setIsPasswordMath, clearError } =
  forgotPasswordSlice.actions;
export default forgotPasswordSlice.reducer;
