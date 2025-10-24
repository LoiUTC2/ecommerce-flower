import jwt from "jsonwebtoken";
import { errorResponse } from "../utils/response.js";

export const verifyAccessToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer "))
            return errorResponse(res, "Access token missing", 401);

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // chứa userId, role
        next();
    } catch (err) {
        return errorResponse(res, "Invalid or expired access token", 401);
    }
};

// kiểm tra quyền
export const requireRole = (roles = []) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return errorResponse(res, "Permission denied", 403);
        }
        next();
    };
};
