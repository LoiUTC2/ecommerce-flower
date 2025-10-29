import React from "react";
import { forgotPassword } from "../services/authService";

export default function ForgotPasswordPage() {
    async function handleSubmit(e) {
        e.preventDefault();
        const email = new FormData(e.target).get("email");
        try {
            const res = await forgotPassword(email);
            if (res.success) alert("Email reset sent. Check your inbox.");
            else alert("Error: " + res.message);
        } catch (err) {
            console.error(err);
            alert("Error sending reset email");
        }
    }

    return (
        <div style={{ maxWidth: 420, margin: "40px auto", padding: 20 }}>
            <h2>Forgot password</h2>
            <form onSubmit={handleSubmit} style={{ display: "grid", gap: 10 }}>
                <input name="email" type="email" placeholder="Email" required />
                <button type="submit">Send reset email</button>
            </form>
        </div>
    );
}
