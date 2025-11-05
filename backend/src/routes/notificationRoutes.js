import express from "express";
import {
    getUserNotifications,
    markAsRead,
    deleteNotification,
} from "../controllers/notificationController.js";
import { verifyAccessToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", verifyAccessToken, getUserNotifications);
router.patch("/:id/read", verifyAccessToken, markAsRead);
router.delete("/:id", verifyAccessToken, deleteNotification);

export default router;
