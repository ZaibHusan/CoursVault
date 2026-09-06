import { useSelector, useDispatch } from "react-redux";
import { setUser, clearAuth } from "../redux/authSlice"; // Adjust path as needed
import api from "../api/api";

export const useAuth = () => {
    const dispatch = useDispatch();
    const { user, isLoggedIn, isLoading } = useSelector((state) => state.auth);

    const checkAuthStatus = async () => {
        try {
            const response = await api.get('/auth/status');
            // Added .data if using Axios. Remove .data if using native fetch or an interceptor.
            if (response.data?.admin) { 
                dispatch(setUser(response.data.admin));
            } else {
                dispatch(clearAuth());
            }
        } catch (error) {
            dispatch(clearAuth());
        }
    };

    const login = async (credentials) => {
        try {
            const response = await api.post('/auth/login', credentials);
            // Assuming your backend sends { message: "Login successful" }
            if (response.status === 200) {
                // Fetch the user status to update the Redux state after a successful login
                await checkAuthStatus(); 
            }
        } catch (error) {
            console.error("Login failed:", error);
        }
    };

    const logout = async () => {
        try {
            const response = await api.post('/auth/logout');
            if (response.status === 200) {
                dispatch(clearAuth());
            }
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return { user, isLoggedIn, isLoading, checkAuthStatus, login, logout };
};