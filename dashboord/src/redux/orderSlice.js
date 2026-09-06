import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orders: [],
  singleOrder: null,
  isLoading: false,
  error: null,
  stats: {
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    completed: 0,
    totalRevenueUSD: 0
  }
};

const calculateStats = (orders) => {
  return {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    approved: orders.filter(o => o.status === 'approved').length,
    rejected: orders.filter(o => o.status === 'rejected').length,
    completed: orders.filter(o => o.status === 'completed').length,
    totalRevenueUSD: orders
      .filter(o => o.status === 'approved' || o.status === 'completed')
      .reduce((total, o) => total + (o.coursePriceUSD || 0), 0)
  };
};

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    
    setOrders: (state, action) => {
      state.orders = action.payload || [];
      state.stats = calculateStats(state.orders);
      state.isLoading = false;
      state.error = null;
    },
    
    addOrder: (state, action) => {
      state.orders.unshift(action.payload);
      state.stats = calculateStats(state.orders);
      state.error = null;
    },
    
    updateOrderInList: (state, action) => {
      const index = state.orders.findIndex(o => o._id === action.payload._id);
      if (index !== -1) {
        state.orders[index] = { ...state.orders[index], ...action.payload };
        state.stats = calculateStats(state.orders);
      }
    },
    
    removeOrder: (state, action) => {
      state.orders = state.orders.filter(o => o._id !== action.payload);
      state.stats = calculateStats(state.orders);
    },
    
    setSingleOrder: (state, action) => {
      state.singleOrder = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    
    clearSingleOrder: (state) => {
      state.singleOrder = null;
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
  setOrders,
  addOrder,
  updateOrderInList,
  removeOrder,
  setSingleOrder,
  clearSingleOrder,
  setError,
  clearError
} = orderSlice.actions;

export default orderSlice.reducer;