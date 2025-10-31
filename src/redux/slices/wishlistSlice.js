import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  wishlistArray: [],
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    addToWishlist: (state, action) => {
      const newItem = { ...action.payload };
      state.wishlistArray.push(newItem);
    },
    removeFromWishlist: (state, action) => {
      state.wishlistArray = state.wishlistArray.filter(
        (item) => (item._id || item.id) !== action.payload
      );
    },
    loadWishlist: (state, action) => {
      state.wishlistArray = action.payload;
    },
    clearWishlist: (state) => {
      state.wishlistArray = [];
    },
  },
});

const wishlistReducer = wishlistSlice.reducer;

export const wishlistActions = wishlistSlice.actions;
export default wishlistReducer;

