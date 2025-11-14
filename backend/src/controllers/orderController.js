import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import mongoose from "mongoose";
import { sendEmail } from "../utils/mail.js";
import { orderConfirmationTemplate, orderStatusUpdateTemplate } from "../utils/mailTemplates.js";
import { sendMailToAdmins } from "../utils/sendAdminMail.js";
import { newOrderAdminTemplate } from "../utils/adminEmailTemplates.js";
import { successResponse, errorResponse } from "../utils/response.js";
import User from "../models/userModel.js";

// 🟢 Tạo đơn hàng (IMPROVED VERSION)
export const createOrder = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const {
            customerName, customerPhone, customerEmail,
            shippingAddress, note, items, paymentMethod,
            deliveryDate, deliveryTime, recipientName, recipientPhone, cardMessage,
            shippingFee = 0,
            discount = 0,
            voucherCode,
            discountType
        } = req.body;

        // 🆕 LẤY USER ID NẾU CÓ ĐĂNG NHẬP
        const userId = req.user ? req.user.userId : null;

        // Validation cơ bản
        if (!items || items.length === 0) {
            await session.abortTransaction();
            return errorResponse(res, "Đơn hàng trống", 400);
        }

        // Lấy chi tiết sản phẩm từ DB
        const productIds = items.map((item) => item.product);
        const products = await Product.find({
            _id: { $in: productIds },
            isActive: true
        }).session(session);

        // Kiểm tra tồn tại và tồn kho
        const orderItems = [];
        let totalAmount = 0;
        const stockErrors = [];

        for (const item of items) {
            const product = products.find((p) => p._id.toString() === item.product);

            // Kiểm tra sản phẩm có tồn tại không
            if (!product) {
                stockErrors.push(`Sản phẩm ${item.product} không tồn tại hoặc đã ngừng bán`);
                continue;
            }

            // Kiểm tra tồn kho
            if (product.stock < item.quantity) {
                stockErrors.push(
                    `${product.name}: Chỉ còn ${product.stock} sản phẩm (yêu cầu ${item.quantity})`
                );
                continue;
            }

            // Tính giá (ưu tiên discountPrice nếu có)
            const price = product.discountPrice || product.price;
            totalAmount += price * item.quantity;

            orderItems.push({
                product: item.product,
                quantity: item.quantity,
                price,
                productName: product.name,
                originalPrice: product.price,
                productImage: product.images[0]?.url
            });

            // Trừ tồn kho và tăng soldCount
            product.stock -= item.quantity;
            product.soldCount += item.quantity;
            await product.save({ session });
        }

        // Nếu có lỗi tồn kho, rollback và trả về lỗi
        if (stockErrors.length > 0) {
            await session.abortTransaction();
            return errorResponse(res, stockErrors.join("; "), 400);
        }

        // Tạo đơn hàng
        const order = await Order.create([{
            customerName,
            customerPhone,
            customerEmail,
            shippingAddress,
            note,
            items: orderItems,
            totalAmount,
            paymentMethod,
            deliveryDate,
            deliveryTime,
            recipientName,
            recipientPhone,
            cardMessage,
            shippingFee,
            discount,
            voucherCode,
            discountType,
            user: userId
        }], { session });

        await session.commitTransaction();

        // Gửi email xác nhận cho khách hàng
        if (order[0].customerEmail) {
            const htmlCus = orderConfirmationTemplate(order[0]);
            sendEmail(
                order[0].customerEmail,
                `Xác nhận đơn hàng #${order[0]._id}`,
                htmlCus
            ).catch(err => console.error("Failed to send customer email:", err.message));
        }

        // Gửi thông báo cho admin
        try {
            const adminHtml = newOrderAdminTemplate(order[0]);
            await sendMailToAdmins({
                subject: `🌸 Đơn hàng mới #${order[0]._id}`,
                html: adminHtml
            });
        } catch (err) {
            console.error("Admin notification error:", err.message);
        }

        return successResponse(res, order[0], "Đặt hàng thành công!");

    } catch (error) {
        await session.abortTransaction();
        console.error("Create order error:", error);
        return errorResponse(res, error.message);
    } finally {
        session.endSession();
    }
};

// 🟡 Lấy danh sách đơn hàng (có filter và pagination)
export const getAllOrders = async (req, res) => {
    try {
        const {
            status,
            paymentStatus,
            page = 1,
            limit = 20,
            startDate,
            endDate,
            search
        } = req.query;

        const query = {};

        // Filter theo status
        if (status) query.status = status;
        if (paymentStatus) query.paymentStatus = paymentStatus;

        // Filter theo ngày
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) query.createdAt.$lte = new Date(endDate);
        }

        // Search theo tên/phone khách hàng
        if (search) {
            query.$or = [
                { customerName: { $regex: search, $options: 'i' } },
                { customerPhone: { $regex: search, $options: 'i' } }
            ];
        }

        const skip = (page - 1) * limit;

        const [orders, total] = await Promise.all([
            Order.find(query)
                .populate("items.product", "name price images")
                .populate("deliveryUser", "fullName phone")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit)),
            Order.countDocuments(query)
        ]);

        return successResponse(res, {
            orders,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        return errorResponse(res, error.message);
    }
};

// 🔵 Lấy chi tiết 1 đơn hàng
export const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findById(id)
            .populate("items.product", "name price images discountPrice")
            .populate("deliveryUser", "fullName phone role");

        if (!order) return errorResponse(res, "Không tìm thấy đơn hàng", 404);

        return successResponse(res, order);
    } catch (error) {
        return errorResponse(res, error.message);
    }
};

// 🟠 Cập nhật trạng thái đơn hàng (IMPROVED)
export const updateOrderStatus = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { id } = req.params;
        const { status, paymentStatus,
            adminNote,
            trackingNumber, deliveryUser
        } = req.body;

        const validStatuses = ["pending", "confirmed", "delivering", "completed", "cancelled"];
        if (status && !validStatuses.includes(status)) {
            await session.abortTransaction();
            return errorResponse(res, "Trạng thái không hợp lệ", 400);
        }

        const updatedBy = req.user.userId;

        const order = await Order.findById(id).session(session);
        if (!order) {
            await session.abortTransaction();
            return errorResponse(res, "Không tìm thấy đơn hàng", 404);
        }

        // === 1. LƯU Ý QUAN TRỌNG: HOÀN LẠI TỒN KHO ===
        // Logic hoàn lại tồn kho KHÔNG nên đặt trong Model hook Pre-save 
        // vì nó nằm ngoài giao dịch. Nó phải được đặt trong Controller 
        // hoặc Method của Model NHƯNG TRONG GIAO DỊCH.

        const isCancelled = status === "cancelled" && order.status !== "cancelled";

        if (isCancelled) {
            // Hoàn lại tồn kho VÀ GIẢM soldCount
            for (const item of order.items) {
                await Product.findByIdAndUpdate(
                    item.product,
                    { $inc: { stock: item.quantity, soldCount: -item.quantity } },
                    { session }
                );
            }
        }

        // === 2. CẬP NHẬT THÔNG TIN PHỤ ===
        if (paymentStatus) order.paymentStatus = paymentStatus;
        if (adminNote !== undefined) order.adminNote = adminNote;
        if (trackingNumber) order.trackingNumber = trackingNumber;

        // 🆕 Cập nhật Shipper (Admin chỉ định)
        if (deliveryUser) {
            // Kiểm tra User có tồn tại và có role shipper/staff không (Tùy chọn)
            const shipper = await User.findById(deliveryUser).select("role");
            if (!shipper || !["shipper", "staff", "admin"].includes(shipper.role)) {
                await session.abortTransaction();
                return errorResponse(res, "Người giao hàng không hợp lệ", 400);
            }
            order.deliveryUser = deliveryUser;
        }

        // === 3. ÁP DỤNG LOGIC CHUYỂN TRẠNG THÁI CỦA MODEL ===
        if (status) {
            // updateStatus sẽ tự kiểm tra chuyển đổi hợp lệ và thêm vào history
            await order.updateStatus(status, adminNote, updatedBy);
        } else {
            // Nếu không thay đổi status, chỉ lưu thay đổi khác (paymentStatus, adminNote,...)
            await order.save({ session });
        }

        await session.commitTransaction();

        // Gửi email thông báo
        if (order.customerEmail) {
            const html = orderStatusUpdateTemplate(order);
            sendEmail(
                order.customerEmail,
                `Đơn hàng #${order._id} - ${order.status.toUpperCase()}`,
                html
            ).catch(err => console.error("Email error:", err));
        }

        return successResponse(res, order, "Cập nhật đơn hàng thành công!");
    } catch (error) {
        await session.abortTransaction();
        // ❌ Bắt lỗi chuyển trạng thái từ Model
        if (error.message.startsWith("Không thể chuyển trạng thái")) {
            return errorResponse(res, error.message, 400);
        }
        console.error("Update order status error:", error);
        return errorResponse(res, error.message);
    } finally {
        session.endSession();
    }
};

// 🔴 Xóa đơn hàng (NÊN HẠN CHẾ)
export const deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findById(id);

        if (!order) {
            return errorResponse(res, "Không tìm thấy đơn hàng", 404);
        }

        // 🆕 CHỈ CHO PHÉP XÓA ĐƠN 'PENDING' VÀ 'CANCELLED'
        if (!["pending", "cancelled"].includes(order.status)) {
            return errorResponse(res, `Không thể xóa đơn hàng ở trạng thái ${order.status}`, 400);
        }

        // Không cho xóa đơn đã xác nhận
        if (["confirmed", "delivering", "completed"].includes(order.status)) {
            return errorResponse(res, "Không thể xóa đơn hàng đã xác nhận", 400);
        }

        await Order.findByIdAndDelete(id);
        return successResponse(res, null, "Đã xóa đơn hàng");
    } catch (error) {
        return errorResponse(res, error.message);
    }
};

// 🆕 Lấy thống kê đơn hàng (dành cho admin dashboard)
export const getOrderStats = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        const matchStage = {};
        if (startDate || endDate) {
            matchStage.createdAt = {};
            if (startDate) matchStage.createdAt.$gte = new Date(startDate);
            if (endDate) matchStage.createdAt.$lte = new Date(endDate);
        }

        const stats = await Order.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: null,
                    totalOrders: { $sum: 1 },
                    totalRevenue: { $sum: "$totalAmount" },
                    avgOrderValue: { $avg: "$totalAmount" },
                    pendingOrders: {
                        $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] }
                    },
                    completedOrders: {
                        $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] }
                    },
                    cancelledOrders: {
                        $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] }
                    }
                }
            }
        ]);

        return successResponse(res, stats[0] || {});
    } catch (error) {
        return errorResponse(res, error.message);
    }
};

// 🆕 Thống kê chi tiết theo khoảng thời gian
export const getDetailedStats = async (req, res) => {
    try {
        const { startDate, endDate, groupBy = "day" } = req.query;

        const matchStage = {
            status: { $nin: ["cancelled"] }
        };

        if (startDate || endDate) {
            matchStage.createdAt = {};
            if (startDate) matchStage.createdAt.$gte = new Date(startDate);
            if (endDate) matchStage.createdAt.$lte = new Date(endDate);
        }

        // Group format theo yêu cầu
        let dateFormat;
        switch (groupBy) {
            case "day":
                dateFormat = { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } };
                break;
            case "week":
                dateFormat = { $dateToString: { format: "%Y-W%V", date: "$createdAt" } };
                break;
            case "month":
                dateFormat = { $dateToString: { format: "%Y-%m", date: "$createdAt" } };
                break;
            case "year":
                dateFormat = { $dateToString: { format: "%Y", date: "$createdAt" } };
                break;
            default:
                dateFormat = { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } };
        }

        const stats = await Order.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: dateFormat,
                    totalOrders: { $sum: 1 },
                    totalRevenue: { $sum: "$finalAmount" },
                    avgOrderValue: { $avg: "$finalAmount" },
                    completedOrders: {
                        $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] }
                    },
                    pendingOrders: {
                        $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] }
                    }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Top sản phẩm bán chạy trong khoảng thời gian
        const topProducts = await Order.aggregate([
            { $match: matchStage },
            { $unwind: "$items" },
            {
                $group: {
                    _id: "$items.product",
                    totalSold: { $sum: "$items.quantity" },
                    totalRevenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
                    productName: { $first: "$items.productName" }
                }
            },
            { $sort: { totalSold: -1 } },
            { $limit: 10 }
        ]);

        // Thống kê theo phương thức thanh toán
        const paymentStats = await Order.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: "$paymentMethod",
                    count: { $sum: 1 },
                    totalAmount: { $sum: "$finalAmount" }
                }
            }
        ]);

        return successResponse(res, {
            timeline: stats,
            topProducts,
            paymentMethods: paymentStats,
            summary: {
                totalOrders: stats.reduce((sum, item) => sum + item.totalOrders, 0),
                totalRevenue: stats.reduce((sum, item) => sum + item.totalRevenue, 0),
                avgOrderValue: stats.length > 0
                    ? stats.reduce((sum, item) => sum + item.avgOrderValue, 0) / stats.length
                    : 0
            }
        });
    } catch (error) {
        return errorResponse(res, error.message);
    }
};

// 🆕 Lấy đơn cần giao hôm nay
export const getTodayDeliveries = async (req, res) => {
    try {
        const orders = await Order.getTodayDeliveries();
        return successResponse(res, {
            total: orders.length,
            orders
        }, "Danh sách đơn giao hôm nay");
    } catch (error) {
        return errorResponse(res, error.message);
    }
};

// 🆕 Lấy đơn quá hạn
export const getOverdueOrders = async (req, res) => {
    try {
        const orders = await Order.getOverdueOrders();
        return successResponse(res, {
            total: orders.length,
            orders
        }, "Danh sách đơn quá hạn");
    } catch (error) {
        return errorResponse(res, error.message);
    }
};

// 🆕 Tìm đơn theo số điện thoại VÀ tên người đặt hàng
export const getOrdersByPhoneAndName = async (req, res) => {
    try {
        const { phone, customerName } = req.query;

        const query = {
            $or: [
                // Tìm theo SĐT người đặt HOẶC SĐT người nhận
                { customerPhone: phone },
                { recipientPhone: phone }
            ],
            // Đảm bảo tên khách hàng khớp (không phân biệt hoa/thường)
            customerName: { $regex: new RegExp(`^${customerName}$`, 'i') }
        };

        const orders = await Order.find(query)
            .populate("items.product", "name price images")
            .sort({ createdAt: -1 });

        if (orders.length === 0) {
            return successResponse(res, [], "Không tìm thấy đơn hàng nào khớp với thông tin cung cấp.");
        }

        return successResponse(res, orders, `Tìm thấy ${orders.length} đơn hàng`);
    } catch (error) {
        return errorResponse(res, error.message);
    }
};

// 🆕 Thêm đánh giá cho đơn hàng (Chỉ dành cho người dùng đã đăng nhập)
export const addOrderReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { rating, review } = req.body;

        const userId = req.user?.userId;

        if (!userId) {
            return errorResponse(res, "Bạn cần đăng nhập để đánh giá đơn hàng.", 401);
        }

        const order = await Order.findOne({ _id: id, user: userId });

        if (!order) {
            return errorResponse(res, "Không tìm thấy đơn hàng hoặc bạn không có quyền đánh giá.", 404);
        }

        if (order.status !== 'completed') {
            return errorResponse(res, `Đơn hàng phải ở trạng thái 'completed' mới có thể đánh giá. Trạng thái hiện tại: ${order.status}`, 400);
        }

        if (order.rating && order.rating > 0) {
            return errorResponse(res, "Đơn hàng này đã được đánh giá trước đó.", 400);
        }

        // 4. Thêm đánh giá (Giả định Order Model có method addReview)
        await order.addReview(rating, review);

        return successResponse(res, order, "Cảm ơn bạn đã đánh giá!");
    } catch (error) {
        return errorResponse(res, error.message);
    }
};

// 🆕 Khách hàng hủy đơn
// 1. Nếu là User, middleware verifyAccessToken đã chạy và có req.user.
// 2. Nếu là Guest, middleware authenticateGuestOrder đã chạy và có req.guestOrder.
export const cancelOrder = async (req, res) => {
    // 1. Xác định đơn hàng và người thực hiện
    const order = req.guestOrder || await Order.findById(req.params.id).populate("items.product");
    const { cancelReason } = req.body;
    
    // Xác định người hủy (updatedBy)
    let updatedBy;
    if (req.user?.userId) {
        updatedBy = req.user.userId; // User/Admin/Shipper
    } else {
        updatedBy = "customer_guest"; // Khách hàng Guest
    }

    if (!order) {
        return errorResponse(res, "Không tìm thấy đơn hàng", 404);
    }
    
    // 2. Kiểm tra quyền sở hữu (Chỉ cần kiểm tra nếu không phải Guest và không phải Admin/Staff)
    if (req.user?.role === "user" && order.user && order.user.toString() !== req.user.userId) {
        return errorResponse(res, "Bạn không có quyền hủy đơn hàng này", 403);
    }

    // 3. Bắt đầu Transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Kiểm tra trạng thái hiện tại
        if (order.status === 'cancelled') {
            await session.abortTransaction();
            return errorResponse(res, "Đơn hàng đã được hủy trước đó.", 400);
        }
        
        // 4. Hoàn lại tồn kho VÀ giảm soldCount
        for (const item of order.items) {
            if (item.product) {
                // Tăng stock và giảm soldCount
                await Product.findByIdAndUpdate(
                    item.product._id,
                    {
                        $inc: {
                            stock: item.quantity,
                            soldCount: -item.quantity
                        }
                    },
                    { session } // Quan trọng: Sử dụng session
                );
            }
        }
        
        // 5. Cập nhật trạng thái qua method của Model
        // updateStatus sẽ tự kiểm tra VALID_TRANSITIONS
        await order.updateStatus('cancelled', cancelReason, updatedBy);

        // 6. Commit Transaction
        await session.commitTransaction();

        // 7. Gửi email (Không trong Transaction)
        if (order.customerEmail) {
            const html = orderStatusUpdateTemplate(order);
            sendEmail(
                order.customerEmail,
                `Đơn hàng #${order._id} - Đã HỦY`,
                html
            ).catch(err => console.error("Email error:", err));
        }

        return successResponse(res, order, "Đã hủy đơn hàng thành công");
    } catch (error) {
        // Rollback Transaction nếu có lỗi
        await session.abortTransaction();
        
        // Xử lý lỗi chuyển trạng thái từ Model
        if (error.message.startsWith("Không thể chuyển trạng thái")) {
            return errorResponse(res, error.message, 400);
        }
        
        console.error("Cancel order error:", error);
        return errorResponse(res, error.message);
    } finally {
        session.endSession();
    }
};

// 🆕 Cập nhật thông tin giao hàng (chỉ khi đơn chưa xác nhận)
export const updateDeliveryInfo = async (req, res) => {
    // 1. Xác định đơn hàng
    // Lấy order từ req.guestOrder (Guest) HOẶC tìm theo ID (User/Admin)
    const order = req.guestOrder || await Order.findById(req.params.id);

    const {
        deliveryDate, deliveryTime, shippingAddress,
        recipientName, recipientPhone, cardMessage,
        // Chỉ cho phép cập nhật các trường này
    } = req.body;

    if (!order) {
        return errorResponse(res, "Không tìm thấy đơn hàng", 404);
    }
    
    // 2. Kiểm tra quyền (Chỉ cần kiểm tra nếu không phải Guest và không phải Admin/Staff)
    if (req.user?.role === "user" && order.user && order.user.toString() !== req.user.userId) {
        return errorResponse(res, "Bạn không có quyền cập nhật đơn hàng này", 403);
    }

    // 3. Kiểm tra trạng thái: Chỉ cho phép cập nhật khi đơn chưa được xử lý sâu
    // Cho phép: pending, confirmed (nếu chưa bắt đầu chuẩn bị)
    if (!["pending", "confirmed"].includes(order.status)) {
        return errorResponse(res, `Không thể cập nhật thông tin giao hàng khi đơn ở trạng thái ${order.status}`, 400);
    }
    
    try {
        // 4. Cập nhật thông tin (Chỉ cập nhật nếu giá trị được cung cấp)
        if (deliveryDate) order.deliveryDate = deliveryDate;
        if (deliveryTime) order.deliveryTime = deliveryTime;
        if (shippingAddress) order.shippingAddress = shippingAddress;
        if (recipientName) order.recipientName = recipientName;
        if (recipientPhone) order.recipientPhone = recipientPhone;
        // cardMessage có thể là chuỗi rỗng
        if (cardMessage !== undefined) order.cardMessage = cardMessage; 

        await order.save();

        return successResponse(res, order, "Cập nhật thông tin giao hàng thành công");
    } catch (error) {
        // Xử lý lỗi validation từ Model (ví dụ: deliveryDate không hợp lệ)
        return errorResponse(res, error.message);
    }
};


// ===== For USER =====

// 🆕 Lấy tất cả đơn hàng của người dùng hiện tại
export const getUserOrders = async (req, res) => {
    try {
        const userId = req.user.userId;

        const orders = await Order.find({ user: userId })
            .populate("items.product", "name price images discountPrice")
            .sort({ createdAt: -1 }); // Sắp xếp từ mới nhất đến cũ nhất

        if (!orders || orders.length === 0) {
            return successResponse(res, [], "Bạn chưa có đơn hàng nào.");
        }

        return successResponse(res, orders);
    } catch (error) {
        return errorResponse(res, error.message);
    }
};

// 🆕 Lấy chi tiết đơn hàng của người dùng (Đảm bảo người dùng chỉ xem được đơn của mình)
export const getOrderDetailForUser = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;

        const order = await Order.findOne({ _id: id, user: userId })
            .populate("items.product", "name price images discountPrice")
            // Không cần populate deliveryUser ở đây, trừ khi User là Shipper
            .select("-deliveryUser"); // Ẩn thông tin shipper/admin

        if (!order) {
            return errorResponse(res, "Không tìm thấy đơn hàng hoặc bạn không có quyền xem.", 404);
        }

        return successResponse(res, order);
    } catch (error) {
        return errorResponse(res, error.message);
    }
};