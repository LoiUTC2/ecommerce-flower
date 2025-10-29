import React from "react";
import { useSearchParams, Link } from "react-router-dom";
import { resetPassword } from "../services/authService";

export default function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    async function handleSubmit(e) {
        e.preventDefault();
        const newPassword = new FormData(e.target).get("newPassword");
        if (!newPassword || newPassword.length < 6) {
            alert("Password phải >= 6 ký tự");
            return;
        }
        try {
            const res = await resetPassword({ token, email, newPassword });
            if (res.success) {
                alert("Password changed. You can login now.");
                window.location.href = "/login";
            } else {
                alert("Reset failed: " + res.message);
            }
        } catch (err) {
            console.error(err);
            alert("Reset error");
        }
    }

    if (!token || !email) {
        return (
            <div style={{ maxWidth: 720, margin: "40px auto", padding: 20 }}>
                <p>Link không hợp lệ. Vui lòng sử dụng link từ email.</p>
                <Link to="/forgot-password">Yêu cầu gửi lại</Link>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: 420, margin: "40px auto", padding: 20 }}>
            <h2>Reset password</h2>
            <form onSubmit={handleSubmit} style={{ display: "grid", gap: 10 }}>
                <input name="newPassword" type="password" placeholder="New password" required />
                <button type="submit">Set new password</button>
            </form>
        </div>
    );
}
