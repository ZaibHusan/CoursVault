import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentOrder: null,
  isLoading: false,
  error: null
};

export const orderSlice = createSlice({
  name: 'publicOrder',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    
    setCurrentOrder: (state, action) => {
      state.currentOrder = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
      state.error = null;
    },
    
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    
    clearError: (state) => {
      state.error = null;
    }
  }
});

export const { 
  setLoading,
  setCurrentOrder,
  clearCurrentOrder,
  setError,
  clearError
} = orderSlice.actions;

export default orderSlice.reducer;