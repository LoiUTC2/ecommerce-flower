import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [admin, setAdmin] = useState(null);

    useEffect(() => {
        const stored = localStorage.getItem("admin");
        if (stored) setAdmin(JSON.parse(stored));
    }, []);

    const login = (data) => {
        setAdmin(data);
        localStorage.setItem("admin", JSON.stringify(data));
    };

    const logout = () => {
        setAdmin(null);
        localStorage.removeItem("admin");
    };

    return (
        <AuthContext.Provider value={{ admin, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
