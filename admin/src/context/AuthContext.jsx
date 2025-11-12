import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [admin, setAdmin] = useState(() => {
        const stored = localStorage.getItem("admin");
        return stored ? JSON.parse(stored) : null;
    });

    const login = (data) => {
        localStorage.setItem("admin", JSON.stringify(data.user));
        localStorage.setItem("adminToken", data.accessToken);
        localStorage.setItem("accessToken", data.accessToken);
        setAdmin(data.user);
    };

    const logout = () => {
        localStorage.removeItem("admin");
        localStorage.removeItem("adminToken");
        localStorage.removeItem("accessToken");
        setAdmin(null);
    };

    return (
        <AuthContext.Provider value={{ admin, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
