import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { OAuth2Client } from "google-auth-library";
import User from "../models/userModel.js";
import { successResponse, errorResponse } from "../utils/response.js";
import RefreshToken from "../models/refreshTokenModel.js";
import { sendVerifyEmail, sendResetPasswordEmail, sendEmail } from "../utils/mail.js"; //smtp mail
// import { sendVerifyEmail, sendResetPasswordEmail } from "../utils/mailResend.js"; //resend mail

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Tạo access & refresh token
export const generateTokens = async (user) => {
    const payload = { userId: user._id, role: user.role };
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "15m" });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
    await RefreshToken.create({
        token: refreshToken,
        user: user._id,
        expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000
    });
    // refresh endpoint: verify token exists & !revoked
    const stored = await RefreshToken.findOne({ token: refreshToken });
    if (!stored || stored.revoked) return errorResponse(res, "Invalid refresh token", 401);

    return { accessToken, refreshToken };
};

// Đăng ký, có thể bằng email
export const register = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;
        if (!fullName || !email || !password)
            return errorResponse(res, "Missing required fields", 400);

        const existing = await User.findOne({ email });
        if (existing) return errorResponse(res, "Email already in use", 400);

        const user = new User({ fullName, email, password });
        // tạo token verify
        const verifyToken = crypto.randomBytes(32).toString("hex");
        user.emailVerifyToken = verifyToken;
        user.emailVerifyExpires = Date.now() + 24 * 60 * 60 * 1000; // 24h
        await user.save();

        // gửi email xác thực với error handling (có template)
        // try {
        //     const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${verifyToken}&email=${encodeURIComponent(user.email)}`;
        //     await sendVerifyEmail({ 
        //         to: user.email, 
        //         fullName: user.fullName, 
        //         verifyUrl, 
        //         logoUrl: process.env.LOGO_URL 
        //     });
        //     console.log(`✅ Email sent successfully to ${user.email}`);
        // } catch (emailError) {
        //     console.error(`❌ Failed to send email to ${user.email}:`, emailError);
        //     // Vẫn trả về success nhưng cảnh báo user
        //     return successResponse(
        //         res, 
        //         { email: user.email }, 
        //         "User registered but email delivery failed. Please contact support.", 
        //         201
        //     );
        // }

        // gửi email xác thực
        const verifyUrl = `${process.env.API_URL || "http://localhost:5000"}/api/auth/verify-email?token=${verifyToken}`;
        const html = `
      <p>Xin chào ${user.fullName},</p>
      <p>Cảm ơn bạn đã đăng ký. Vui lòng nhấn vào link sau để xác nhận email:</p>
      <a href="${verifyUrl}">${verifyUrl}</a>
      <p>Link có hiệu lực 24 giờ.</p>
    `;
        await sendEmail({ to: user.email, subject: "Xác thực email - Flower Shop", html });

        return successResponse(res, { email: user.email }, "User registered. Please verify your email.", 201);
    } catch (err) {
        return errorResponse(res, err.message, 500);
    }
};

// Verify email
export const verifyEmail = async (req, res) => {
    try {
        const { token } = req.query;
        if (!token) return errorResponse(res, "Token missing", 400);

        const user = await User.findOne({
            emailVerifyToken: token,
            emailVerifyExpires: { $gt: Date.now() },
        });

        if (!user) return errorResponse(res, "Invalid or expired token", 400);

        user.isEmailVerified = true;
        user.emailVerifyToken = null;
        user.emailVerifyExpires = null;
        await user.save();

        return successResponse(res, {}, "Email verified successfully");
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

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        // cập nhật lastLogin
        user.lastLogin = new Date();
        await user.save();

        // không gửi password về client (ensure model select false)
        const userSafe = await User.findById(user._id);

        return successResponse(res, { user: userSafe, accessToken }, "Login successful");
    } catch (err) {
        return errorResponse(res, err.message, 500);
    }
};

// Google login (client gửi idToken)
// googleLogin dùng google-auth-library để verify ID token từ client — client (frontend) sẽ gọi Google sign-in, lấy idToken và gửi lên endpoint này.
export const googleLogin = async (req, res) => {
    try {
        const { idToken } = req.body;
        if (!idToken) return errorResponse(res, "idToken is required", 400);

        const ticket = await googleClient.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const { email, name, picture, email_verified } = payload;

        if (!email) return errorResponse(res, "Email not found in Google profile", 400);

        // tìm user theo email
        let user = await User.findOne({ email });
        if (!user) {
            // tạo user mới
            user = new User({
                fullName: name || "Google User",
                email,
                password: crypto.randomBytes(16).toString("hex"), // random password (not used)
                avatar: picture,
                provider: "google",
                isEmailVerified: email_verified || false,
            });
            await user.save();
        } else {
            // cập nhật provider/avatar nếu cần
            user.provider = "google";
            if (picture) user.avatar = picture;
            if (email_verified) user.isEmailVerified = true;
            await user.save();
        }

        const { accessToken, refreshToken } = generateTokens(user);
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        const userSafe = await User.findById(user._id);
        return successResponse(res, { user: userSafe, accessToken }, "Login with Google successful");
    } catch (err) {
        return errorResponse(res, err.message, 500);
    }
};

// Forgot password - gửi email chứa token
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return errorResponse(res, "Email is required", 400);

        const user = await User.findOne({ email });
        if (!user) return errorResponse(res, "No account with that email", 404);

        const token = crypto.randomBytes(32).toString("hex");
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour
        await user.save();

        //Gửi email (có template)
        // const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}&email=${encodeURIComponent(user.email)}`;
        // await sendResetPasswordEmail({ to: user.email, fullName: user.fullName, resetUrl, logoUrl: process.env.LOGO_URL });

        const resetUrl = `${process.env.CLIENT_URL || CLIENT_URL}/reset-password?token=${token}&email=${encodeURIComponent(user.email)}`;
        const html = `
      <p>Xin chào ${user.fullName},</p>
      <p>Vui lòng nhấn link bên dưới để đặt lại mật khẩu. Link có hiệu lực 1 giờ.</p>
      <a href="${resetUrl}">${resetUrl}</a>
    `;
        await sendEmail({ to: user.email, subject: "Đặt lại mật khẩu - Flower Shop", html });

        return successResponse(res, {}, "Password reset email sent");
    } catch (err) {
        return errorResponse(res, err.message, 500);
    }
};

// Reset password (từ link email)
//Email/Reset link dẫn tới CLIENT_URL (frontend) cho UX tốt; API verify/reset xử lý token để bảo mật.
export const resetPassword = async (req, res) => {
    try {
        const { token, email } = req.query;
        const { newPassword } = req.body;

        if (!token || !email) return errorResponse(res, "Token and email required", 400);
        if (!newPassword || newPassword.length < 6) return errorResponse(res, "Invalid new password", 400);

        const user = await User.findOne({
            email,
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        }).select("+password");

        if (!user) return errorResponse(res, "Invalid or expired token", 400);

        user.password = newPassword;
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await user.save();

        return successResponse(res, {}, "Password reset successful");
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

// 🟠 Lấy thông tin tài khoản hiện tại
export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select("-password");
        return successResponse(res, user);
    } catch (error) {
        return errorResponse(res, error.message);
    }
};