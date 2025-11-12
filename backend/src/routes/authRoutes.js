import express from "express";
import {
    register,
    login,
    logout,
    refreshToken,
    verifyEmail,
    googleLogin,
    forgotPassword,
    resetPassword,
    getProfile,
} from "../controllers/authController.js";

import passport from "../config/passport.js";
import { generateTokens } from "../controllers/authController.js";
import { successResponse } from "../utils/response.js";
import { verifyAccessToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/refresh-token", refreshToken);

router.get("/me", verifyAccessToken, getProfile);

// advanced
// Bắt đầu đăng nhập Google
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Sau khi Google xác thực xong
router.get(
    "/google/callback",
    passport.authenticate("google", { session: false }),
    async (req, res) => {
        const user = req.user;
        const tokens = await generateTokens(user);

        res.cookie("refreshToken", tokens.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return successResponse(res, { user, accessToken: tokens.accessToken }, "Google login successful");
    }
);
router.get("/verify-email", verifyEmail); // ?token=...
router.post("/google-login", googleLogin); // body: { idToken }
router.post("/forgot-password", forgotPassword); // body: { email }
router.post("/reset-password", resetPassword); // query: ?token=&email=  body: { newPassword }

export default router;
