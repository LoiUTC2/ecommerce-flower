import express from "express";
import {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    deleteOrder,
    getTodayDeliveries,
    getOverdueOrders,
    getOrdersByPhoneAndName,
    addOrderReview,
    cancelOrder,
    updateDeliveryInfo,
    getDetailedStats,
    getOrderStats,
    getUserOrders,
    getOrderDetailForUser,
} from "../controllers/orderController.js";

import { verifyAccessToken, adminOnly } from "../middlewares/authMiddleware.js";

import {
    validateCreateOrder,
    validateUpdateStatus,
    validateGetOrders,
    validateGetOrderById,
    validateDeleteOrder,
    validateGetOrdersByPhone,
    validateAddReview,
    validateGetStats,
    validateCancelOrder,
    validateUpdateDelivery,
    validateGetOrdersByPhoneAndName
} from "../validators/orderValidator.js";

//Xác thực đơn hàng của Guest
import { validateGuestCredentials, authenticateGuestOrder } from '../middlewares/guestAuthMiddleware.js'; 

const router = express.Router();

// ========== PUBLIC ROUTES ==========
// Khách hàng tạo đơn hàng (có thể không cần login nếu cho phép guest checkout)
router.post("/", validateCreateOrder, createOrder);

// Khách tra cứu đơn theo SĐT (có thể không cần login)
router.get("/search", validateGetOrdersByPhoneAndName, getOrdersByPhoneAndName);

// HỦY ĐƠN HÀNG DÀNH CHO GUEST (POST để lấy body chứa Tên/SĐT)
router.post("/guest/:id/cancel", 
    validateCancelOrder, 
    validateGuestCredentials, // Kiểm tra Tên và SĐT
    authenticateGuestOrder, // Xác thực đơn hàng và gán req.guestOrder
    cancelOrder // Thực thi logic hủy
);

// CẬP NHẬT THÔNG TIN GIAO HÀNG DÀNH CHO GUEST
router.patch("/guest/:id/delivery-info", 
    validateUpdateDelivery, 
    validateGuestCredentials, // Kiểm tra Tên và SĐT
    authenticateGuestOrder, // Xác thực đơn hàng và gán req.guestOrder
    updateDeliveryInfo
);

// ========== CUSTOMER ROUTES (Cần login) ==========
// Lấy danh sách tất cả đơn hàng của người dùng hiện tại
router.get("/my-orders", verifyAccessToken, getUserOrders);

// Lấy chi tiết một đơn hàng cụ thể của người dùng
router.get("/my-orders/:id", verifyAccessToken, getOrderDetailForUser);

// Khách hàng hủy đơn
router.post("/:id/cancel", verifyAccessToken, validateCancelOrder, cancelOrder);

// Khách hàng đánh giá đơn đã hoàn thành
router.post("/:id/review", verifyAccessToken, validateAddReview, addOrderReview);

// Cập nhật thông tin giao hàng (chỉ khi đơn chưa xác nhận)
router.patch("/:id/delivery", verifyAccessToken, validateUpdateDelivery, updateDeliveryInfo);


// ========== ADMIN ROUTES ==========
// Thống kê đơn hàng (Dashboard)
router.get("/admin/stats/summary", verifyAccessToken, adminOnly, validateGetStats, getOrderStats);

// Thống kê chi tiết đơn hàng
router.get("/admin/stats/analytics", verifyAccessToken, adminOnly, validateGetStats, getDetailedStats);

// Đơn cần giao hôm nay
router.get("/admin/today-deliveries", verifyAccessToken, adminOnly, getTodayDeliveries);

// Đơn quá hạn chưa giao
router.get("/admin/overdue", verifyAccessToken, adminOnly, getOverdueOrders);

// Lấy tất cả đơn hàng (có filter, pagination)
router.get("/", verifyAccessToken, adminOnly, validateGetOrders, getAllOrders);

// Xem chi tiết 1 đơn
router.get("/:id", verifyAccessToken, adminOnly, validateGetOrderById, getOrderById);

// Cập nhật trạng thái đơn hàng
router.put("/:id/status", verifyAccessToken, adminOnly, validateUpdateStatus, updateOrderStatus);

// Xóa đơn hàng (chỉ admin, hạn chế sử dụng)
router.delete("/:id", verifyAccessToken, adminOnly, validateDeleteOrder, deleteOrder);



export default router;