import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { verifyEmail } from "../services/authService";

export default function VerifyEmailPage() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const [status, setStatus] = useState("loading");

    useEffect(() => {
        async function verify() {
            if (!token) return setStatus("missing");
            try {
                const res = await verifyEmail(token);
                if (res.success) setStatus("ok");
                else setStatus("error:" + res.message);
            } catch (err) {
                console.error(err);
                setStatus("error");
            }
        }
        verify();
    }, [token]);

    return (
        <div style={{ maxWidth: 720, margin: "40px auto", padding: 20 }}>
            <h2>Email verification</h2>
            {status === "loading" && <p>Verifying...</p>}
            {status === "missing" && (
                <p>Không có token. Vui lòng sử dụng link xác minh từ email.</p>
            )}
            {status === "ok" && (
                <div>
                    <p>Email đã được xác thực ✅</p>
                    <Link to="/login">Đăng nhập ngay</Link>
                </div>
            )}
            {status.startsWith("error") && (
                <div>
                    <p>Xác thực thất bại: {status.replace("error:", "")}</p>
                    <Link to="/register">Đăng ký lại</Link>
                </div>
            )}
        </div>
    );
}
