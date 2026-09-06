import { configureStore } from '@reduxjs/toolkit';
import courseReducer from './slices/courseSlice';
import orderReducer from './slices/orderSlice';

export const store = configureStore({
  reducer: {
    publicCourse: courseReducer,
    publicOrder: orderReducer
  },
});