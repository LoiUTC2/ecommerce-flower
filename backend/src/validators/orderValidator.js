import { body, param, query, validationResult } from "express-validator";
import mongoose from "mongoose";

// ========== HELPER: Xử lý lỗi validation ==========
export const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: "Dữ liệu không hợp lệ",
            errors: errors.array().map(err => ({
                field: err.path,
                message: err.msg,
                value: err.value
            }))
        });
    }
    next();
};

// ========== VALIDATION: TẠO ĐƠN HÀNG ==========
export const validateCreateOrder = [
    // Thông tin khách hàng
    body("customerName")
        .trim()
        .notEmpty().withMessage("Tên khách hàng là bắt buộc")
        .isLength({ min: 2, max: 100 }).withMessage("Tên phải từ 2-100 ký tự")
        .matches(/^[a-zA-ZÀ-ỹ\s]+$/).withMessage("Tên chỉ chứa chữ cái và khoảng trắng"),

    body("customerPhone")
        .trim()
        .notEmpty().withMessage("Số điện thoại là bắt buộc")
        .matches(/^(0|\+84)[0-9]{9,10}$/).withMessage("Số điện thoại không hợp lệ (VD: 0912345678)"),

    body("customerEmail")
        .optional()
        .trim()
        .isEmail().withMessage("Email không hợp lệ")
        .normalizeEmail(),

    // Địa chỉ giao hàng
    body("shippingAddress")
        .trim()
        .notEmpty().withMessage("Địa chỉ giao hàng là bắt buộc")
        .isLength({ min: 10, max: 500 }).withMessage("Địa chỉ phải từ 10-500 ký tự"),

    // Người nhận (optional)
    body("recipientName")
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 }).withMessage("Tên người nhận phải từ 2-100 ký tự")
        .matches(/^[a-zA-ZÀ-ỹ\s]+$/).withMessage("Tên người nhận chỉ chứa chữ cái"),

    body("recipientPhone")
        .optional()
        .trim()
        .matches(/^(0|\+84)[0-9]{9,10}$/).withMessage("SĐT người nhận không hợp lệ"),

    // Thời gian giao hàng
    body("deliveryDate")
        .optional()
        .isISO8601().withMessage("Ngày giao hàng không hợp lệ")
        .custom((value) => {
            const deliveryDate = new Date(value);
            const now = new Date();
            now.setHours(0, 0, 0, 0);

            if (deliveryDate < now) {
                throw new Error("Ngày giao hàng không được là ngày quá khứ");
            }

            // Không cho đặt quá 30 ngày trước
            const maxDate = new Date();
            maxDate.setDate(maxDate.getDate() + 30);
            if (deliveryDate > maxDate) {
                throw new Error("Chỉ nhận đặt hàng trong vòng 30 ngày");
            }

            return true;
        }),

    body("deliveryTime")
        .optional()
        .isIn(["morning", "afternoon", "evening", "anytime"])
        .withMessage("Khung giờ giao hàng không hợp lệ"),

    // Dịp đặc biệt
    body("occasionType")
        .optional()
        .isIn(["birthday", "anniversary", "wedding", "funeral", "congratulation", "apology", "love", "thankyou", "other"])
        .withMessage("Loại dịp không hợp lệ"),

    // Lời nhắn
    body("cardMessage")
        .optional()
        .trim()
        .isLength({ max: 500 }).withMessage("Lời nhắn không được quá 500 ký tự"),

    body("note")
        .optional()
        .trim()
        .isLength({ max: 1000 }).withMessage("Ghi chú không được quá 1000 ký tự"),

    // Sản phẩm
    body("items")
        .isArray({ min: 1 }).withMessage("Đơn hàng phải có ít nhất 1 sản phẩm")
        .custom((items) => {
            if (items.length > 50) {
                throw new Error("Đơn hàng không được quá 50 sản phẩm");
            }
            return true;
        }),

    body("items.*.product")
        .notEmpty().withMessage("Product ID là bắt buộc")
        .custom((value) => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                throw new Error("Product ID không hợp lệ");
            }
            return true;
        }),

    body("items.*.quantity")
        .isInt({ min: 1, max: 999 }).withMessage("Số lượng phải từ 1-999"),

    // Phương thức thanh toán
    body("paymentMethod")
        .optional()
        .isIn(["cod", "stripe", "vnpay", "momo", "banking"])
        .withMessage("Phương thức thanh toán không hợp lệ"),

    // Voucher
    body("voucherCode")
        .optional()
        .trim()
        .toUpperCase()
        .matches(/^[A-Z0-9]{4,20}$/).withMessage("Mã voucher không hợp lệ"),

    // Phí vận chuyển
    body("shippingFee")
        .optional()
        .isFloat({ min: 0, max: 1000000 }).withMessage("Phí vận chuyển không hợp lệ"),

    body("discount")
        .optional()
        .isFloat({ min: 0 }).withMessage("Giảm giá không được âm"),

    body("discountType")
        .optional()
        .isIn(["fixed", "percentage", "free_shipping", null])
        .withMessage("Loại giảm giá không hợp lệ"),

    handleValidationErrors
];

// ========== VALIDATION: CẬP NHẬT TRẠNG THÁI ==========
export const validateUpdateStatus = [
    param("id")
        .custom((value) => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                throw new Error("Order ID không hợp lệ");
            }
            return true;
        }),

    body("status")
        .optional()
        .isIn(["pending", "confirmed", "preparing", "delivering", "completed", "cancelled"])
        .withMessage("Trạng thái không hợp lệ"),

    body("paymentStatus")
        .optional()
        .isIn(["unpaid", "paid", "failed", "refunded"])
        .withMessage("Trạng thái thanh toán không hợp lệ"),

    body("cancelReason")
        .if(body("status").equals("cancelled"))
        .notEmpty().withMessage("Lý do hủy là bắt buộc khi hủy đơn")
        .isLength({ max: 500 }).withMessage("Lý do hủy không được quá 500 ký tự"),

    body("adminNote")
        .optional()
        .trim()
        .isLength({ max: 1000 }).withMessage("Ghi chú admin không được quá 1000 ký tự"),

    body("trackingNumber")
        .optional()
        .trim()
        .isLength({ max: 50 }).withMessage("Mã vận đơn không được quá 50 ký tự"),

    handleValidationErrors
];

// ========== VALIDATION: LẤY DANH SÁCH ĐƠN HÀNG ==========
export const validateGetOrders = [
    query("page")
        .optional()
        .isInt({ min: 1 }).withMessage("Số trang phải lớn hơn 0")
        .toInt(),

    query("limit")
        .optional()
        .isInt({ min: 1, max: 100 }).withMessage("Số lượng mỗi trang từ 1-100")
        .toInt(),

    query("status")
        .optional()
        .isIn(["pending", "confirmed", "preparing", "delivering", "completed", "cancelled"])
        .withMessage("Trạng thái không hợp lệ"),

    query("paymentStatus")
        .optional()
        .isIn(["unpaid", "paid", "failed", "refunded"])
        .withMessage("Trạng thái thanh toán không hợp lệ"),

    query("paymentMethod")
        .optional()
        .isIn(["cod", "stripe", "vnpay", "momo", "banking"])
        .withMessage("Phương thức thanh toán không hợp lệ"),

    query("startDate")
        .optional()
        .isISO8601().withMessage("Ngày bắt đầu không hợp lệ")
        .toDate(),

    query("endDate")
        .optional()
        .isISO8601().withMessage("Ngày kết thúc không hợp lệ")
        .toDate()
        .custom((endDate, { req }) => {
            if (req.query.startDate && endDate < new Date(req.query.startDate)) {
                throw new Error("Ngày kết thúc phải sau ngày bắt đầu");
            }
            return true;
        }),

    query("search")
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 }).withMessage("Từ khóa tìm kiếm từ 2-100 ký tự"),

    query("minAmount")
        .optional()
        .isFloat({ min: 0 }).withMessage("Số tiền tối thiểu không hợp lệ")
        .toFloat(),

    query("maxAmount")
        .optional()
        .isFloat({ min: 0 }).withMessage("Số tiền tối đa không hợp lệ")
        .toFloat()
        .custom((maxAmount, { req }) => {
            if (req.query.minAmount && maxAmount < parseFloat(req.query.minAmount)) {
                throw new Error("Số tiền tối đa phải lớn hơn số tiền tối thiểu");
            }
            return true;
        }),

    query("isPriority")
        .optional()
        .isBoolean().withMessage("isPriority phải là true/false")
        .toBoolean(),

    query("sortBy")
        .optional()
        .isIn(["createdAt", "updatedAt", "deliveryDate", "totalAmount", "finalAmount"])
        .withMessage("Trường sắp xếp không hợp lệ"),

    query("sortOrder")
        .optional()
        .isIn(["asc", "desc"])
        .withMessage("Thứ tự sắp xếp phải là asc hoặc desc"),

    handleValidationErrors
];

// ========== VALIDATION: LẤY CHI TIẾT ĐƠN HÀNG ==========
export const validateGetOrderById = [
    param("id")
        .custom((value) => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                throw new Error("Order ID không hợp lệ");
            }
            return true;
        }),

    handleValidationErrors
];

// ========== VALIDATION: XÓA ĐƠN HÀNG ==========
export const validateDeleteOrder = [
    param("id")
        .custom((value) => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                throw new Error("Order ID không hợp lệ");
            }
            return true;
        }),

    handleValidationErrors
];

// ========== VALIDATION: TÌM ĐƠN THEO SỐ ĐIỆN THOẠI ==========
export const validateGetOrdersByPhone = [
    param("phone")
        .trim()
        .notEmpty().withMessage("Số điện thoại là bắt buộc")
        .matches(/^(0|\+84)[0-9]{9,10}$/).withMessage("Số điện thoại không hợp lệ"),

    handleValidationErrors
];

// ========== VALIDATION: TÌM ĐƠN THEO SỐ ĐIỆN THOẠI VÀ TÊN ========== Cái này chắc chắn hơn
export const validateGetOrdersByPhoneAndName = [
    // 1. Số điện thoại (dùng query thay vì param)
    query("phone")
        .trim()
        .notEmpty().withMessage("Số điện thoại là bắt buộc")
        .matches(/^(0|\+84)[0-9]{9,10}$/).withMessage("Số điện thoại không hợp lệ"),

    // 2. Tên khách hàng
    query("customerName")
        .trim()
        .notEmpty().withMessage("Tên khách hàng là bắt buộc")
        .isLength({ min: 2, max: 100 }).withMessage("Tên phải từ 2-100 ký tự"),

    handleValidationErrors
];

// ========== VALIDATION: THÊM ĐÁNH GIÁ ==========
export const validateAddReview = [
    param("id")
        .custom((value) => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                throw new Error("Order ID không hợp lệ");
            }
            return true;
        }),

    body("rating")
        .notEmpty().withMessage("Đánh giá sao là bắt buộc")
        .isInt({ min: 1, max: 5 }).withMessage("Đánh giá phải từ 1-5 sao"),

    body("review")
        .optional()
        .trim()
        .isLength({ min: 10, max: 1000 }).withMessage("Nội dung đánh giá từ 10-1000 ký tự"),

    handleValidationErrors
];

// ========== VALIDATION: THỐNG KÊ ==========
export const validateGetStats = [
    query("startDate")
        .optional()
        .isISO8601().withMessage("Ngày bắt đầu không hợp lệ")
        .toDate(),

    query("endDate")
        .optional()
        .isISO8601().withMessage("Ngày kết thúc không hợp lệ")
        .toDate()
        .custom((endDate, { req }) => {
            if (req.query.startDate && endDate < new Date(req.query.startDate)) {
                throw new Error("Ngày kết thúc phải sau ngày bắt đầu");
            }
            return true;
        }),

    query("groupBy")
        .optional()
        .isIn(["day", "week", "month", "year"])
        .withMessage("Nhóm theo không hợp lệ"),

    handleValidationErrors
];

// ========== VALIDATION: HỦY ĐƠN HÀNG (CUSTOMER) ==========
export const validateCancelOrder = [
    param("id")
        .custom((value) => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                throw new Error("Order ID không hợp lệ");
            }
            return true;
        }),

    body("cancelReason")
        .notEmpty().withMessage("Lý do hủy là bắt buộc")
        .trim()
        .isLength({ min: 10, max: 500 }).withMessage("Lý do hủy phải từ 10-500 ký tự"),

    handleValidationErrors
];

// ========== VALIDATION: CẬP NHẬT THÔNG TIN GIAO HÀNG ==========
export const validateUpdateDelivery = [
    param("id")
        .custom((value) => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                throw new Error("Order ID không hợp lệ");
            }
            return true;
        }),

    body("deliveryDate")
        .optional()
        .isISO8601().withMessage("Ngày giao hàng không hợp lệ")
        .custom((value) => {
            const deliveryDate = new Date(value);
            const now = new Date();
            now.setHours(0, 0, 0, 0);

            if (deliveryDate < now) {
                throw new Error("Ngày giao hàng không được là ngày quá khứ");
            }
            return true;
        }),

    body("deliveryTime")
        .optional()
        .isIn(["morning", "afternoon", "evening", "anytime"])
        .withMessage("Khung giờ giao hàng không hợp lệ"),

    body("shippingAddress")
        .optional()
        .trim()
        .isLength({ min: 10, max: 500 }).withMessage("Địa chỉ phải từ 10-500 ký tự"),

    body("recipientName")
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 }).withMessage("Tên người nhận phải từ 2-100 ký tự"),

    body("recipientPhone")
        .optional()
        .trim()
        .matches(/^(0|\+84)[0-9]{9,10}$/).withMessage("SĐT người nhận không hợp lệ"),

    body("cardMessage")
        .optional()
        .trim()
        .isLength({ max: 500 }).withMessage("Lời nhắn không được quá 500 ký tự"),

    handleValidationErrors
];