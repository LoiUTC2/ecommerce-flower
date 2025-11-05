import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Header() {
    const { user, isAuthenticated, logout } = useAuth();

    return (
        <header style={{ padding: 12, borderBottom: "1px solid #eee" }}>
            <nav style={{ display: "flex", gap: 16, alignItems: "center" }}>
                <Link to="/">Home</Link>
                {!isAuthenticated ? (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                ) : (
                    <>
                        <span>👤 {user?.fullName}</span>
                        <button onClick={logout}>Logout</button>
                    </>
                )}
            </nav>
        </header>
    );
}