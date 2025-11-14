import Order from "../models/orderModel.js";
import { errorResponse } from "../utils/response.js";
import { body, validationResult } from "express-validator";
import mongoose from "mongoose";

// Middleware 1: Kiểm tra tính hợp lệ của dữ liệu (Tên & SĐT)
// (Nên được đặt trước khi gọi middleware xác thực chính)
export const validateGuestCredentials = [
    // body: Tên khách hàng (cần cho hủy/cập nhật)
    body("customerName")
        .trim()
        .notEmpty().withMessage("Tên khách hàng là bắt buộc"),
    
    // body: Số điện thoại
    body("customerPhone")
        .trim()
        .notEmpty().withMessage("Số điện thoại là bắt buộc")
        .matches(/^(0|\+84)[0-9]{9,10}$/).withMessage("Số điện thoại không hợp lệ"),

    // Kiểm tra và trả về lỗi
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, "Thông tin xác thực không hợp lệ", 400);
        }
        next();
    }
];

// Middleware 2: Xác thực Guest và Gán Đơn hàng
export const authenticateGuestOrder = async (req, res, next) => {
    // 1. Lấy Order ID từ params
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return errorResponse(res, "Order ID không hợp lệ", 400);
    }
    
    // 2. Lấy thông tin xác thực từ body (đã được validate)
    const { customerName, customerPhone } = req.body;

    try {
        // 3. Tìm kiếm đơn hàng bằng ID VÀ khớp SĐT/Tên
        const order = await Order.findOne({
            _id: id,
            customerPhone: customerPhone,
            // Sử dụng regex không phân biệt chữ hoa/thường (case-insensitive)
            // và khớp chính xác (^) để đảm bảo bảo mật
            customerName: { $regex: new RegExp(`^${customerName}$`, 'i') }
        });

        if (!order) {
            return errorResponse(res, "Thông tin xác thực không khớp. Vui lòng kiểm tra lại Tên và Số điện thoại.", 403);
        }
        
        // 4. Gán đơn hàng vào req để Controller sử dụng
        req.guestOrder = order;

        next();
    } catch (error) {
        return errorResponse(res, "Lỗi xác thực đơn hàng", 500);
    }
};