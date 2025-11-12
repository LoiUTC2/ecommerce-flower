import axios from "axios";
import { refreshToken, logout } from "../services/authService";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Tạo instance mặc định
const api = axios.create({
    baseURL: API,
    withCredentials: true, // gửi cookie HttpOnly (refreshToken)
    headers: { "Content-Type": "application/json" },
});

// === Helper: gắn access token vào header ===
function attachAccessToken(config) {
    const token = localStorage.getItem("accessToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
}

// Thêm accessToken vào mỗi request
api.interceptors.request.use(attachAccessToken, (error) => Promise.reject(error));

// === Response Interceptor ===
let isRefreshing = false;
let failedQueue = [];

function processQueue(error, token = null) {
    failedQueue.forEach((prom) => {
        if (error) prom.reject(error);
        else prom.resolve(token);
    });
    failedQueue = [];
}

// Intercept responses
api.interceptors.response.use(
    (response) => response, // ok
    async (error) => {
        const originalRequest = error.config;

        // Nếu lỗi 401 (token hết hạn)
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                // Nếu đang refresh → chờ
                return new Promise(function (resolve, reject) {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers["Authorization"] = "Bearer " + token;
                        return api(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const res = await refreshToken(); // gọi API /refresh-token
                if (res.success && res.data?.accessToken) {
                    const newToken = res.data.accessToken;
                    localStorage.setItem("accessToken", newToken);
                    api.defaults.headers.common["Authorization"] = "Bearer " + newToken;
                    processQueue(null, newToken);
                    return api(originalRequest); // retry request cũ
                } else {
                    throw new Error("Refresh failed");
                }
            } catch (err) {
                processQueue(err, null);
                await logout();
                localStorage.removeItem("accessToken");
                window.location.href = "/login";
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default api;