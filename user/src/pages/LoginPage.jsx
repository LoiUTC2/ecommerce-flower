import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login, googleLogin } from "../services/authService";
import { useAuth } from "../context/AuthContext";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // init Google Identity Services button
        if (window.google && GOOGLE_CLIENT_ID) {
            window.google.accounts.id.initialize({
                client_id: GOOGLE_CLIENT_ID,
                callback: handleGoogleResponse,
            });
            // render button in #googleButton
            window.google.accounts.id.renderButton(
                document.getElementById("googleButton"),
                { theme: "outline", size: "large" } // customization
            );
            // optional: prompt
            // window.google.accounts.id.prompt();
        }
    }, []);

    async function handleGoogleResponse(response) {
        // response.credential is the ID token
        try {
            const data = await googleLogin(response.credential);
            if (data.success) {
                alert("Login with Google successful");
                // store accessToken if returned
                if (data.data?.accessToken) localStorage.setItem("accessToken", data.data.accessToken);
                navigate("/");
            } else {
                alert("Google login failed: " + data.message);
            }
        } catch (err) {
            console.error(err);
            alert("Google login error");
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const form = new FormData(e.target);
        const email = form.get("email");
        const password = form.get("password");

        try {
            await login({ email, password });
            navigate("/");
        } catch (err) {
            alert(err.message);
        }
    }

    return (
        <div style={{ maxWidth: 420, margin: "40px auto", padding: 20 }}>
            <h2>Login</h2>

            <form onSubmit={handleSubmit} style={{ display: "grid", gap: 10 }}>
                <input name="email" type="email" placeholder="Email" required />
                <input name="password" type="password" placeholder="Password" required />
                <button type="submit">Login</button>
            </form>

            <div style={{ marginTop: 16 }}>
                <div id="googleButton"></div>
            </div>

            <div style={{ marginTop: 12 }}>
                <a href="/forgot-password">Forgot password?</a>
            </div>
        </div>
    );
}
