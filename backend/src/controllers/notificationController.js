import Notification from "../models/Notification.js";
import { successResponse, errorResponse } from "../utils/response.js";

// 🟢 Lấy thông báo của người dùng
export const getUserNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .limit(50);

        return successResponse(res, notifications);
    } catch (error) {
        return errorResponse(res, error.message);
    }
};

// 🟠 Đánh dấu đã đọc
export const markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);
        if (!notification) return errorResponse(res, "Không tìm thấy thông báo", 404);

        if (notification.user.toString() !== req.user.id)
            return errorResponse(res, "Không có quyền truy cập", 403);

        notification.isRead = true;
        await notification.save();

        return successResponse(res, notification, "Đã đánh dấu là đã đọc");
    } catch (error) {
        return errorResponse(res, error.message);
    }
};

// 🔴 Xóa thông báo
export const deleteNotification = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);
        if (!notification) return errorResponse(res, "Không tìm thấy thông báo", 404);

        if (notification.user.toString() !== req.user.id)
            return errorResponse(res, "Không có quyền xóa", 403);

        await notification.deleteOne();
        return successResponse(res, null, "Đã xóa thông báo");
    } catch (error) {
        return errorResponse(res, error.message);
    }
};
