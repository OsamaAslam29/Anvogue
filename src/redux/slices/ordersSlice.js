import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  isLoading: false,
  error: null,
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setOrders(state, action) {
      state.items = Array.isArray(action.payload) ? action.payload : [];
    },
    setOrdersLoading(state, action) {
      state.isLoading = !!action.payload;
    },
    setOrdersError(state, action) {
      state.error = action.payload || null;
    },
    clearOrders(state) {
      state.items = [];
      state.isLoading = false;
      state.error = null;
    },
  },
});

export const { setOrders, setOrdersLoading, setOrdersError, clearOrders } = ordersSlice.actions;
export default ordersSlice.reducer;


