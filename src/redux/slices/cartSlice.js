import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartArray: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const newItem = { 
        ...action.payload, 
        quantity: 1, 
        selectedSize: '', 
        selectedColor: '' 
      };
      state.cartArray.push(newItem);
    },
    removeFromCart: (state, action) => {
      state.cartArray = state.cartArray.filter(
        (item) => (item._id || item.id) !== action.payload
      );
    },
    updateCart: (state, action) => {
      const { itemId, quantity, selectedSize, selectedColor } = action.payload;
      const item = state.cartArray.find((item) => (item._id || item.id) === itemId);
      if (item) {
        item.quantity = quantity;
        item.selectedSize = selectedSize;
        item.selectedColor = selectedColor;
      }
    },
    loadCart: (state, action) => {
      state.cartArray = action.payload;
    },
    clearCart: (state) => {
      state.cartArray = [];
    },
  },
});

const cartReducer = cartSlice.reducer;

export const cartActions = cartSlice.actions;
export default cartReducer;

