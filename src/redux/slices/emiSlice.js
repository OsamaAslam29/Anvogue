import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  emiBanks: [],
  selectedBank: null,
  selectedEMI: null,
  isLoading: false,
  error: null,
};

const emiSlice = createSlice({
  name: "emi",
  initialState,
  reducers: {
    setEMIBanks: (state, action) => {
      state.emiBanks = action.payload;
    },
    setSelectedBank: (state, action) => {
      state.selectedBank = action.payload;
    },
    setSelectedEMI: (state, action) => {
      state.selectedEMI = action.payload;
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
    clearSelection: (state) => {
      state.selectedBank = null;
      state.selectedEMI = null;
    },
  },
});

const emiReducer = emiSlice.reducer;

export const emiActions = emiSlice.actions;
export default emiReducer;