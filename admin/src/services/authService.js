import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const loginAdmin = async (email, password) => {
    const res = await axios.post(`${API_URL}/auth/login`, { email, password });
    return res.data; // { data: { user, accessToken } }
};
