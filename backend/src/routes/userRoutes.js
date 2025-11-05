import express from "express";
import {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    changePassword,
} from "../controllers/userController.js";
import { verifyAccessToken, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Admin quản lý khách hàng
router.get("/", verifyAccessToken, adminOnly, getAllUsers);
router.get("/:id", verifyAccessToken, adminOnly, getUserById);
router.put("/:id", verifyAccessToken, adminOnly, updateUser);
router.delete("/:id", verifyAccessToken, adminOnly, deleteUser);

// Khách hàng tự đổi mật khẩu
router.put("/me/change-password", verifyAccessToken, changePassword);

export default router;
