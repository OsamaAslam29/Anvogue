import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  compareArray: [],
};

const compareSlice = createSlice({
  name: "compare",
  initialState,
  reducers: {
    addToCompare: (state, action) => {
      const newItem = { ...action.payload };
      state.compareArray.push(newItem);
    },
    removeFromCompare: (state, action) => {
      state.compareArray = state.compareArray.filter(
        (item) => (item._id || item.id) !== action.payload
      );
    },
    loadCompare: (state, action) => {
      state.compareArray = action.payload;
    },
    clearCompare: (state) => {
      state.compareArray = [];
    },
  },
});

const compareReducer = compareSlice.reducer;

export const compareActions = compareSlice.actions;
export default compareReducer;

