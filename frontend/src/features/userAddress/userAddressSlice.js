import { createSlice } from "@reduxjs/toolkit";
import {
  AddUserAddress,
  DeleteUserAddress,
  GetUserAddress,
  UpdateUserAddress,
} from "./userAddressThunk";

const initialState = {
  loading: false,
  error: null,
  Address: [],
  PrimaryAddress: null,
  isUpdate: false,
};

const AddressSlice = createSlice({
  name: "Address",
  initialState,
  reducers: {
    setIsUpdateAddress: (state, action) => {
      state.isUpdate = action.payload ?? true;
    },

    setPrimaryAddress: (state) => {
      state.PrimaryAddress =
        state.Address.find((address) => address.isPrimary) || null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(GetUserAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetUserAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.Address = action.payload?.data || [];
      })
      .addCase(GetUserAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //   add user address

      .addCase(AddUserAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(AddUserAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.Address.push(action.payload?.data);
      })
      .addCase(AddUserAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // update user address

      .addCase(UpdateUserAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(UpdateUserAddress.fulfilled, (state, action) => {
        state.loading = false;

        const address = action.payload?.data;

        const index = state.Address.findIndex((add) => add?.id == address?.id);

        if (index !== -1) {
          state.Address[index] = address;
        }
      })
      .addCase(UpdateUserAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //   Delete user Address
      .addCase(DeleteUserAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(DeleteUserAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.Address = state.Address.filter(
          (add) => add.id != action.payload?.data,
        );
      })
      .addCase(DeleteUserAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setIsUpdateAddress,setPrimaryAddress } = AddressSlice.actions;
export default AddressSlice.reducer;
