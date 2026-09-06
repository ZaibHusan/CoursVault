// api.js
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const api = axios.create({
    baseURL: BACKEND_URL,
    withCredentials: true,
    headers: { 'Accept': 'application/json' }
});

api.interceptors.request.use((config) => {
    if (config.data instanceof FormData) {
        delete config.headers['Content-Type'];
    }
    return config;
});

export default api;