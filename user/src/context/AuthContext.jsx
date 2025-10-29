import React, { createContext, useContext, useState, useEffect } from "react";
import {
    login as loginService,
    logout as logoutService,
    register as registerService,
    refreshToken,
} from "../services/authService";
import api from "../utils/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken"));
    const [loading, setLoading] = useState(true);

    const isAuthenticated = !!user;

    // Khi app load -> cố refresh token từ cookie (nếu còn)
    useEffect(() => {
        async function init() {
            try {
                const res = await refreshToken();
                if (res.success && res.data?.accessToken) {
                    localStorage.setItem("accessToken", res.data.accessToken);
                    setAccessToken(res.data.accessToken);

                    // Lấy thông tin user hiện tại
                    const me = await api.get("/api/auth/me");
                    if (me.data.success) setUser(me.data.data);
                }
            } catch (err) {
                console.log("Not logged in yet");
            } finally {
                setLoading(false);
            }
        }
        init();
    }, []);

    async function login(credentials) {
        const res = await loginService(credentials);
        if (res.success) {
            setAccessToken(res.data.accessToken);
            localStorage.setItem("accessToken", res.data.accessToken);
            setUser(res.data.user);
            return true;
        } else {
            throw new Error(res.message);
        }
    }

    async function register(data) {
        const res = await registerService(data);
        if (res.success) {
            alert("Đăng ký thành công! Vui lòng kiểm tra email để xác minh.");
            return true;
        } else {
            throw new Error(res.message);
        }
    }

    async function logout() {
        try {
            await logoutService();
        } catch (err) {
            console.warn("Logout failed:", err);
        }
        localStorage.removeItem("accessToken");
        setAccessToken(null);
        setUser(null);
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                accessToken,
                loading,
                isAuthenticated,
                login,
                logout,
                register,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

// Custom hook
export function useAuth() {
    return useContext(AuthContext);
}
