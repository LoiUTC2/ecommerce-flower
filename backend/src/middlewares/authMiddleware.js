import jwt from "jsonwebtoken";
import { errorResponse } from "../utils/response.js";
import User from "../models/userModel.js";

export const verifyAccessToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer "))
            return errorResponse(res, "Access token missing", 401);

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // chứa userId, role
        const user = await User.findById(decoded.userId).select("-password");

        if (!user || !user.isActive) {
            return errorResponse(res, "Tài khoản bị khóa hoặc không tồn tại", 403);
        }
        
        next();
    } catch (err) {
        return errorResponse(res, "Invalid or expired access token", 401);
    }
};

// kiểm tra quyền
export const requireRole = (roles = []) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return errorResponse(res, "Không có quyền truy cập", 403);
        }
        next();
    };
};

// Middleware kiểm tra quyền admin
export const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        return errorResponse(res, "Chỉ admin mới có quyền truy cập", 403);
    }
};
