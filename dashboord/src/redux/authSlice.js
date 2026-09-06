import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    isLoggedIn: false,
    isLoading: true // Start true so the app can verify the session on first load
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {

        setUser: (state, action) => {
            state.user = action.payload;
            state.isLoggedIn = true;
            state.isLoading = false;
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        clearAuth: (state) => {
            state.user = null;
            state.isLoggedIn = false;
            state.isLoading = false;
        }
    }
});

export const { setUser, setLoading, clearAuth } = authSlice.actions;
export default authSlice.reducer;