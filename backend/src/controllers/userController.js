import User from "../models/userModel.js";
import { successResponse, errorResponse } from "../utils/response.js";
import bcrypt from "bcryptjs";

// 🟢 Lấy danh sách tất cả người dùng (Admin)
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password").sort({ createdAt: -1 });
        return successResponse(res, users);
    } catch (error) {
        return errorResponse(res, error.message);
    }
};

// 🔵 Lấy thông tin chi tiết 1 user
export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) return errorResponse(res, "Không tìm thấy người dùng", 404);
        return successResponse(res, user);
    } catch (error) {
        return errorResponse(res, error.message);
    }
};

// 🟠 Cập nhật thông tin user (Admin)
export const updateUser = async (req, res) => {
    try {
        const { name, email, phone, address, role, isActive } = req.body;

        const updated = await User.findByIdAndUpdate(
            req.params.id,
            { name, email, phone, address, role, isActive },
            { new: true }
        ).select("-password");

        return successResponse(res, updated, "Cập nhật người dùng thành công!");
    } catch (error) {
        return errorResponse(res, error.message);
    }
};

// 🔴 Xóa người dùng (Admin)
export const deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        return successResponse(res, null, "Xóa người dùng thành công!");
    } catch (error) {
        return errorResponse(res, error.message);
    }
};

// 🟣 Đổi mật khẩu (tự user thực hiện)
export const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id);

        const isMatch = await user.matchPassword(oldPassword);
        if (!isMatch) return errorResponse(res, "Mật khẩu cũ không đúng", 400);

        user.password = newPassword;
        await user.save();

        return successResponse(res, null, "Đổi mật khẩu thành công!");
    } catch (error) {
        return errorResponse(res, error.message);
    }
};
