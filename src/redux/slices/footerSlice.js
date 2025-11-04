import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  footerInfo: null,
  isLoading: false,
  error: null,
};

const footerSlice = createSlice({
  name: "footer",
  initialState,
  reducers: {
    setFooterInfo: (state, action) => {
      state.footerInfo = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

const footerReducer = footerSlice.reducer;

export const footerActions = footerSlice.actions;
export default footerReducer;

