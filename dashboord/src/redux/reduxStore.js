import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import courseReducer from "./courseSlice";
import orderReducer from "./orderSlice";  // NEW

export const store = configureStore({
    reducer: {
        auth: authReducer,
        course: courseReducer,
        order: orderReducer  // NEW
    },
});