import mongoose from "mongoose";

const VALID_TRANSITIONS = {
    pending: ["confirmed", "cancelled"], // Đang chờ có thể xác nhận hoặc hủy
    confirmed: ["preparing", "delivering", "cancelled"], // Đã xác nhận có thể chuẩn bị, giao hàng hoặc hủy
    preparing: ["delivering", "cancelled"], // Đang chuẩn bị có thể giao hàng hoặc hủy
    delivering: ["completed", "cancelled"], // Đang giao có thể hoàn thành hoặc hủy
    completed: ["refunded"], // Hoàn thành (Chỉ có thể hoàn tiền - Thêm trạng thái này nếu cần)
    cancelled: [], // Đơn đã hủy không thể thay đổi
    refunded: [] // Đã hoàn tiền không thể thay đổi
    // Lưu ý: "refunded" không có trong enum hiện tại, nên cân nhắc thêm
};

// Schema cho từng item trong đơn hàng
const orderItemSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: [1, "Số lượng phải lớn hơn 0"]
        },
        price: {
            type: Number,
            required: true,
            min: [0, "Giá không được âm"]
        },
        // Lưu tên sản phẩm để tránh mất dữ liệu khi product bị xóa
        productName: {
            type: String,
            required: true
        },

        // Lưu lại giá niêm yết của sản phẩm tại thời điểm đặt hàng. Hữu ích cho các mục đích báo cáo và kiểm toán nếu giá sản phẩm thay đổi thường xuyên.
        originalPrice: {
            type: Number,
            required: true
        },

        // Lưu ảnh đại diện
        productImage: {
            type: String
        }
    },
    { _id: false }
);

// Schema chính cho Order
const orderSchema = new mongoose.Schema(
    {
        // ========== THÔNG TIN KHÁCH HÀNG ==========
        customerName: {
            type: String,
            required: [true, "Tên khách hàng là bắt buộc"],
            trim: true,
            maxlength: [100, "Tên không được vượt quá 100 ký tự"]
        },
        customerPhone: {
            type: String,
            required: [true, "Số điện thoại là bắt buộc"],
            trim: true,
            match: [/^[0-9]{10,11}$/, "Số điện thoại không hợp lệ"]
        },
        customerEmail: {
            type: String,
            trim: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, "Email không hợp lệ"]
        },

        // ========== THÔNG TIN GIAO HÀNG (ĐẶC THÙ SHOP HOA) ==========
        shippingAddress: {
            type: String,
            required: [true, "Địa chỉ giao hàng là bắt buộc"],
            trim: true
        },

        // Người nhận (có thể khác người đặt)
        recipientName: {
            type: String,
            trim: true,
            maxlength: [100, "Tên người nhận không được vượt quá 100 ký tự"]
        },
        recipientPhone: {
            type: String,
            trim: true,
            match: [/^[0-9]{10,11}$/, "Số điện thoại người nhận không hợp lệ"]
        },

        // Thời gian giao hàng mong muốn
        deliveryDate: {
            type: Date,
            validate: {
                validator: function (value) {
                    // Không cho đặt ngày quá khứ (trừ đơn đã tạo)
                    return !value || this.isNew ? value >= new Date() : true;
                },
                message: "Ngày giao hàng không được là ngày quá khứ"
            }
        },
        deliveryTime: {
            type: String,
            enum: {
                values: ["morning", "afternoon", "evening", "anytime"],
                message: "Khung giờ giao hàng không hợp lệ"
            },
            default: "anytime"
        },

        // Dịp đặc biệt (để shop chuẩn bị phù hợp)
        occasionType: {
            type: String,
            enum: ["birthday", "anniversary", "wedding", "funeral", "congratulation", "apology", "love", "thankyou", "other"],
            default: "other"
        },

        // Lời nhắn trên thiệp kèm hoa
        cardMessage: {
            type: String,
            trim: true,
            maxlength: [500, "Lời nhắn không được vượt quá 500 ký tự"]
        },

        // 🆕 LIÊN KẾT VỚI TÀI KHOẢN NGƯỜI DÙNG (nếu có đăng nhập)
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null // Cho phép null nếu là Guest Checkout
        },

        note: {
            type: String,
            trim: true,
            maxlength: [1000, "Ghi chú không được vượt quá 1000 ký tự"]
        },

        deliveryUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

        // ========== THÔNG TIN SẢN PHẨM ==========
        items: {
            type: [orderItemSchema],
            validate: {
                validator: function (items) {
                    return items && items.length > 0;
                },
                message: "Đơn hàng phải có ít nhất 1 sản phẩm"
            }
        },

        totalAmount: {
            type: Number,
            required: true,
            min: [0, "Tổng tiền không được âm"]
        },

        // Phí vận chuyển
        shippingFee: {
            type: Number,
            default: 0,
            min: [0, "Phí vận chuyển không được âm"]
        },

        // Giảm giá (voucher, khuyến mãi)
        discount: {
            type: Number,
            default: 0,
            min: [0, "Giảm giá không được âm"]
        },

        // Voucher code đã dùng
        voucherCode: {
            type: String,
            trim: true,
            uppercase: true
        },

        discountType: {
            type: String,
            enum: ["fixed", "percentage", "free_shipping", null],
            default: null
        },

        // ========== THANH TOÁN ==========
        paymentMethod: {
            type: String,
            enum: {
                values: ["cod", "stripe", "vnpay", "momo", "banking"],
                message: "Phương thức thanh toán không hợp lệ"
            },
            default: "cod"
        },

        paymentStatus: {
            type: String,
            enum: {
                values: ["unpaid", "paid", "failed", "refunded"],
                message: "Trạng thái thanh toán không hợp lệ"
            },
            default: "unpaid",
            index: true
        },

        paidAt: {
            type: Date
        },

        transactionId: {
            type: String,
            trim: true,
            index: true
        },

        // ========== TRẠNG THÁI ĐỚN HÀNG ==========
        status: {
            type: String,
            enum: {
                values: ["pending", "confirmed", "preparing", "delivering", "completed", "cancelled"],
                message: "Trạng thái đơn hàng không hợp lệ"
            },
            default: "pending",
            index: true
        },

        // Lý do hủy (nếu có)
        cancelReason: {
            type: String,
            trim: true,
            maxlength: [500, "Lý do hủy không được vượt quá 500 ký tự"]
        },

        cancelledBy: {
            type: String,
            enum: ["customer", "admin", "system"]
        },

        cancelledAt: {
            type: Date
        },

        // ========== LỊCH SỬ THAY ĐỔI TRẠNG THÁI ==========
        statusHistory: [{
            status: {
                type: String,
                required: true
            },
            note: String,
            updatedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            timestamp: {
                type: Date,
                default: Date.now
            }
        }],

        // ========== ĐÁNH GIÁ & PHẢN HỒI ==========
        rating: {
            type: Number,
            min: 1,
            max: 5
        },

        review: {
            type: String,
            trim: true,
            maxlength: [1000, "Đánh giá không được vượt quá 1000 ký tự"]
        },

        reviewedAt: {
            type: Date
        },

        // ========== THÔNG TIN BỔ SUNG ==========
        // Cho phép admin ghi chú nội bộ
        adminNote: {
            type: String,
            trim: true
        },

        // Đơn hàng ưu tiên (VIP, gấp)
        isPriority: {
            type: Boolean,
            default: false,
            index: true
        },

        // Tracking ID từ đơn vị vận chuyển
        trackingNumber: {
            type: String,
            trim: true
        }
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// ========== INDEXES ĐỂ TỐI ƯU QUERY ==========
orderSchema.index({ customerPhone: 1, createdAt: -1 });
orderSchema.index({ customerEmail: 1, createdAt: -1 });
orderSchema.index({ deliveryDate: 1, status: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ status: 1, paymentStatus: 1 });

// ========== VIRTUALS ==========
// Tính tổng số item
orderSchema.virtual("totalItems").get(function () {
    if (!this.items || this.items.length === 0) return 0;
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
});

// Check xem có thể hủy không
orderSchema.virtual("canCancel").get(function () {
    return ["pending", "confirmed"].includes(this.status);
});

// Check xem có thể đánh giá không
orderSchema.virtual("canReview").get(function () {
    return this.status === "completed" && !this.rating;
});

// ========== METHODS ==========
// Cập nhật trạng thái với lịch sử
orderSchema.methods.updateStatus = async function (newStatus, note, updatedBy) {
    const currentStatus = this.status;

    // 1. Kiểm tra chuyển đổi hợp lệ
    if (currentStatus !== newStatus) {
        if (!VALID_TRANSITIONS[currentStatus] || !VALID_TRANSITIONS[currentStatus].includes(newStatus)) {
            // Ném lỗi nếu chuyển đổi không hợp lệ
            throw new Error(`Không thể chuyển trạng thái từ '${currentStatus}' sang '${newStatus}'`);
        }

        // 2. Thêm vào lịch sử nếu trạng thái THAY ĐỔI
        this.statusHistory.push({
            status: newStatus,
            note: note,
            updatedBy: updatedBy,
            timestamp: new Date()
        });

        this.status = newStatus;

        // 3. Tự động cập nhật các trường liên quan
        if (newStatus === "cancelled" && !this.cancelledAt) {
            this.cancelledAt = new Date();
        }
    }
    // 4. Bỏ qua nếu newStatus trùng với currentStatus (chỉ cập nhật note/adminNote)

    return this.save();
};

// Đánh dấu đã thanh toán
orderSchema.methods.markAsPaid = async function (transactionId) {
    this.paymentStatus = "paid";
    this.paidAt = new Date();
    if (transactionId) {
        this.transactionId = transactionId;
    }
    return this.save();
};

// Hủy đơn hàng
orderSchema.methods.cancelOrder = async function (reason, cancelledBy = "customer") {
    if (!this.canCancel) {
        throw new Error("Không thể hủy đơn hàng ở trạng thái hiện tại");
    }

    this.status = "cancelled";
    this.cancelReason = reason;
    this.cancelledBy = cancelledBy;
    this.cancelledAt = new Date();

    this.statusHistory.push({
        status: "cancelled",
        note: reason,
        timestamp: new Date()
    });

    return this.save();
};

// Thêm đánh giá
orderSchema.methods.addReview = async function (rating, review) {
    if (!this.canReview) {
        throw new Error("Chỉ có thể đánh giá đơn hàng đã hoàn thành");
    }

    if (rating < 1 || rating > 5) {
        throw new Error("Đánh giá sao phải từ 1 đến 5.");
    }

    this.rating = rating;
    this.review = review;
    this.reviewedAt = new Date();

    return this.save();
};

// ========== STATIC METHODS ==========
// Thống kê doanh thu theo khoảng thời gian
orderSchema.statics.getRevenueStats = function (startDate, endDate) {
    const matchStage = {
        status: { $in: ["completed", "delivering"] },
        paymentStatus: "paid"
    };

    if (startDate || endDate) {
        matchStage.createdAt = {};
        if (startDate) matchStage.createdAt.$gte = new Date(startDate);
        if (endDate) matchStage.createdAt.$lte = new Date(endDate);
    }

    return this.aggregate([
        { $match: matchStage },
        {
            $group: {
                _id: null,
                totalRevenue: { $sum: "$finalAmount" },
                totalOrders: { $sum: 1 },
                avgOrderValue: { $avg: "$finalAmount" }
            }
        }
    ]);
};

// Lấy đơn hàng cần giao trong ngày
orderSchema.statics.getTodayDeliveries = function () {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return this.find({
        deliveryDate: { $gte: today, $lt: tomorrow },
        status: { $in: ["confirmed", "preparing", "delivering"] }
    })
        .populate("items.product", "name images")
        .sort({ deliveryTime: 1, isPriority: -1 });
};

// Lấy đơn hàng quá hạn chưa giao
orderSchema.statics.getOverdueOrders = function () {
    const now = new Date();

    return this.find({
        deliveryDate: { $lt: now },
        status: { $in: ["confirmed", "preparing"] }
    })
        .populate("items.product", "name")
        .sort({ deliveryDate: 1 });
};

// Tìm đơn hàng theo số điện thoại
orderSchema.statics.findByPhone = function (phone) {
    return this.find({
        $or: [
            { customerPhone: phone },
            { recipientPhone: phone }
        ]
    })
        .populate("items.product", "name price images")
        .sort({ createdAt: -1 });
};

// ========== PRE-SAVE HOOKS ==========
orderSchema.virtual("finalAmount").get(function () {
    const calculatedAmount = this.totalAmount + this.shippingFee - this.discount;
    // Đảm bảo finalAmount không âm
    return calculatedAmount < 0 ? 0 : calculatedAmount;
});

// Thêm status đầu tiên vào history
orderSchema.pre("save", function (next) {
    if (this.isNew) {
        this.statusHistory.push({
            status: this.status,
            note: "Đơn hàng được tạo",
            timestamp: new Date()
        });
    }
    next();
});

// ========== POST-SAVE HOOKS ==========
// Log khi đơn hàng được tạo
orderSchema.post("save", function (doc) {
    if (doc.wasNew) {
        console.log(`✅ Đơn hàng mới: #${doc._id} - ${doc.customerName} - ${doc.finalAmount}đ`);
    }
});



export default mongoose.model("Order", orderSchema);