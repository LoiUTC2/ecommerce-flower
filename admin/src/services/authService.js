import api from "../utils/api";

export async function loginAdmin({ email, password }) {
    const res = await api.post("/api/auth/login", { email, password });
    return res.data;
}

export async function googleLogin(idToken) {
    const res = await api.post("/api/auth/google-login", { idToken });
    return res.data;
}

export async function register(data) {
    const res = await api.post("/api/auth/register", data);
    return res.data;
}

export async function refreshToken() {
    const res = await api.get("/api/auth/refresh-token");
    return res.data;
}

export async function logout() {
    const res = await api.post("/api/auth/logout");
    return res.data;
}

export async function forgotPassword(email) {
    const res = await api.post("/api/auth/forgot-password", { email });
    return res.data;
}

export async function resetPassword({ token, email, newPassword }) {
    const res = await api.post(`/api/auth/reset-password?token=${token}&email=${email}`, {
        newPassword,
    });
    return res.data;
}

export async function verifyEmail(token) {
    const res = await api.get(`/api/auth/verify-email?token=${token}`);
    return res.data;
}
