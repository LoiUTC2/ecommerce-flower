import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import { successResponse, errorResponse } from "../utils/response.js";

// Tạo access & refresh token
const generateTokens = (user) => {
    const payload = { userId: user._id, role: user.role };
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "15m" });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
    return { accessToken, refreshToken };
};

// Đăng ký
export const register = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;
        if (!fullName || !email || !password)
            return errorResponse(res, "Missing required fields", 400);

        const existing = await User.findOne({ email });
        if (existing) return errorResponse(res, "Email already in use", 400);

        const user = new User({ fullName, email, password });
        await user.save();

        return successResponse(res, user, "User registered successfully", 201);
    } catch (err) {
        return errorResponse(res, err.message, 500);
    }
};

// Đăng nhập
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select("+password");
        if (!user) return errorResponse(res, "Invalid credentials", 401);

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return errorResponse(res, "Invalid credentials", 401);

        const { accessToken, refreshToken } = generateTokens(user);

        // Gửi refresh token qua cookie bảo mật
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return successResponse(res, { user, accessToken }, "Login successful");
    } catch (err) {
        return errorResponse(res, err.message, 500);
    }
};

// Làm mới token
export const refreshToken = async (req, res) => {
    try {
        const token = req.cookies.refreshToken;
        if (!token) return errorResponse(res, "Refresh token missing", 401);

        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        const user = await User.findById(decoded.userId);
        if (!user) return errorResponse(res, "User not found", 404);

        const { accessToken, refreshToken: newRefresh } = generateTokens(user);

        // tạo refresh token mới
        res.cookie("refreshToken", newRefresh, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return successResponse(res, { accessToken }, "Token refreshed");
    } catch (err) {
        return errorResponse(res, "Invalid or expired refresh token", 401);
    }
};

// Đăng xuất
export const logout = async (req, res) => {
    res.clearCookie("refreshToken");
    return successResponse(res, {}, "Logged out successfully");
};
