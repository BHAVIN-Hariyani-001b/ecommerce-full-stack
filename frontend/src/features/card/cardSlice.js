import { createSlice } from "@reduxjs/toolkit";
import {
  addToCart,
  decrementCartItem,
  fetchCartItem,
  incrementCartItem,
} from "./cardThunk";

const initialState = {
  loading: false,
  error: null,
  items: [],
  totalPrice: 0,
  basePrice: 0,
  deliveryCharge: 0,
  handlingCharge: 0,
  finalPrice: 0,
  count: 0,
};

const mapCartItem = (cartItem) => ({
  cart_id: cartItem.cart_id,
  id: cartItem.id,
  product_id: cartItem.id,
  qty: cartItem.qty,
  BTotalAmount: cartItem.BTotalAmount,
  PTotalAmount: cartItem.PTotalAmount,
  product: cartItem.product,
  ...(cartItem.product || {}),
});

const recalculate = (state) => {
  const items = state.items ?? [];

  state.count = items.reduce((acc, i) => acc + (i.qty || 0), 0);

  state.totalPrice = items.reduce((acc, i) => {
    const price = parseFloat(i.product?.PPrice || i.PPrice || 0);
    return acc + (i.qty || 0) * price;
  }, 0);

  state.basePrice = items.reduce((acc, i) => {
    const price = parseFloat(i.product?.BPrice || i.BPrice || 0);
    return acc + (i.qty || 0) * price;
  }, 0);

  state.deliveryCharge = parseFloat((state.totalPrice * 5) / 100).toFixed(2);
  state.handlingCharge = parseFloat((state.totalPrice * 2) / 100).toFixed(2);
  state.finalPrice = parseFloat(
    state.totalPrice + Number(state.handlingCharge),
  ).toFixed(2);
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addGuestCartItem: (state, action) => {
      if (!state.items) state.items = [];
      const existingItem = state.items.find(
        (item) => item?.id === action.payload?.id,
      );

      if (existingItem) {
        existingItem.qty += 1;
      } else {
        state.items.push({
          ...action.payload,
          qty: 1,
        });
      }
      recalculate(state);
    },

    incrementQty: (state, action) => {
      const item = state.items.find((item) => item.id === action.payload);
      if (item) item.qty += 1;
      recalculate(state);
    },

    decrementQty: (state, action) => {
      if (!state.items) return;
      const item = state.items.find((i) => i.id === action.payload);
      if (item && item.qty > 1) {
        item.qty -= 1;
      } else {
        state.items = state.items.filter((i) => i.id !== action.payload);
      }
      recalculate(state);
    },

    clearCart: (state) => {
      state.count = 0;
      state.items = [];
      state.totalPrice = 0;
      state.basePrice = 0;
      state.finalPrice = 0;
      state.deliveryCharge = 0;
      state.handlingCharge = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCartItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items = (action.payload?.cart ?? []).map(mapCartItem);
        recalculate(state);
      })
      .addCase(fetchCartItem.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        const cart = action.payload.cart;
        const existing = state.items.find(
          (item) => item.id === cart.id || item.product_id === cart.id,
        );

        if (existing) {
          existing.qty = cart.qty;
          existing.cart_id = cart.cart_id;
          existing.BTotalAmount = cart.BTotalAmount;
          existing.PTotalAmount = cart.PTotalAmount;
          existing.product = cart.product;
        } else {
          state.items.push(mapCartItem(cart));
        }
        recalculate(state);
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      .addCase(incrementCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(incrementCartItem.fulfilled, (state, action) => {
        state.loading = false;
        const updatedCart = action.payload?.cart;
        if (!updatedCart) return;

        const existingItem = state.items.find(
          (item) => item?.cart_id === updatedCart?.cart_id,
        );

        if (existingItem) {
          existingItem.qty = updatedCart.qty;
          existingItem.BTotalAmount = updatedCart.BTotalAmount;
          existingItem.PTotalAmount = updatedCart.PTotalAmount;
        }

        recalculate(state);
      })
      .addCase(incrementCartItem.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      .addCase(decrementCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(decrementCartItem.fulfilled, (state, action) => {
        state.loading = false;
        const { cart, cart_id } = action.payload;

        if (!cart) {
          state.items = state.items.filter((item) => item.cart_id !== cart_id);
        } else {
          const existingItem = state.items.find(
            (item) => item.cart_id === cart_id,
          );
          if (existingItem) {
            existingItem.qty = cart.qty;
            existingItem.BTotalAmount = cart.BTotalAmount;
            existingItem.PTotalAmount = cart.PTotalAmount;
          }
        }
        recalculate(state);
      })
      .addCase(decrementCartItem.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export default cartSlice.reducer;
export const { addGuestCartItem, decrementQty, incrementQty, clearCart } =
  cartSlice.actions;
