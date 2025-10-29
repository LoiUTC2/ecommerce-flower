import React from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/authService";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
    const { register } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        const form = new FormData(e.target);
        const data = {
            fullName: form.get("fullName"),
            email: form.get("email"),
            password: form.get("password"),
        };

        try {
            await register(data);
            navigate("/login");
        } catch (err) {
            alert(err.message);
        }
    }

    return (
        <div style={{ maxWidth: 420, margin: "40px auto", padding: 20 }}>
            <h2>Register</h2>
            <form onSubmit={handleSubmit} style={{ display: "grid", gap: 10 }}>
                <input name="fullName" placeholder="Full name" required />
                <input name="email" type="email" placeholder="Email" required />
                <input name="password" type="password" placeholder="Password" minLength={6} required />
                <button type="submit">Register</button>
            </form>
        </div>
    );
}
