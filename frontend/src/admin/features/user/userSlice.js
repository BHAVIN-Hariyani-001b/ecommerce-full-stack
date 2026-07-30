import { createSlice } from "@reduxjs/toolkit";
import {
  createUserAPI,
  deleteUserAPI,
  fetchUserAPI,
  updateUserAPI,
} from "./userThunk";

const initialState = {
  loading: false,
  error: null,
  users: [],
  isUpdate: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setIsUpdatedUser: (state, action) => {
      state.isUpdate = action.payload || true;
    },
  },
  extraReducers: (builder) => {
    builder
      // get user

      .addCase(fetchUserAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserAPI.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload?.data;
      })
      .addCase(fetchUserAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // create user
      .addCase(createUserAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUserAPI.fulfilled, (state, action) => {
        state.users.push(action.payload?.data);
        state.loading = false;
      })
      .addCase(createUserAPI.rejected, (state, action) => {
        state.error = action.payload || "User Create failed";
        state.loading = false;
      })

      // update user

      .addCase(updateUserAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserAPI.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.users.findIndex(
          (p) => p.id === action.payload?.data?.id,
        );
        if (index !== -1) state.users[index] = action.payload?.data;
      })
      .addCase(updateUserAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // delete user
      .addCase(deleteUserAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUserAPI.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter(
          (user) => user.id !== action.payload?.data,
        );
      })
      .addCase(deleteUserAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setIsUpdatedUser } = userSlice.actions;
export default userSlice.reducer;
