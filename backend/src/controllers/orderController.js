import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import { sendEmail } from "../utils/mail.js"; //Mail gửi cho khách
import { orderConfirmationTemplate, orderStatusUpdateTemplate } from "../utils/mailTemplates.js";
import { sendMailToAdmins } from "../utils/sendAdminMail.js"; //Mail gửi cho Admin
import { newOrderAdminTemplate } from "../utils/adminEmailTemplates.js"; //Teamplte dành cho mail gửi đến Admin
import { successResponse, errorResponse } from "../utils/response.js";

// 🟢 Tạo đơn hàng
export const createOrder = async (req, res) => {
    try {
        const { customerName, customerPhone, customerEmail, shippingAddress, note, items, paymentMethod } = req.body;

        if (!items || items.length === 0) {
            return errorResponse(res, "Đơn hàng trống", 400);
        }

        // Lấy chi tiết sản phẩm từ DB để tính tổng
        const productIds = items.map((item) => item.product);
        const products = await Product.find({ _id: { $in: productIds } });

        let totalAmount = 0;
        const orderItems = items.map((item) => {
            const product = products.find((p) => p._id.toString() === item.product);
            const price = product ? product.price : 0;
            totalAmount += price * item.quantity;
            return { product: item.product, quantity: item.quantity, price };
        });

        const order = await Order.create({
            customerName,
            customerPhone,
            customerEmail,
            shippingAddress,
            note,
            items: orderItems,
            totalAmount,
            paymentMethod,
        });

        // Gửi email xác nhận cho KH (nếu có email)
        if (order.customerEmail) {
            const htmlCus = orderConfirmationTemplate(order);
            sendMail(order.customerEmail, `Xác nhận đơn hàng #${order._id}`, htmlCus)
                .catch(err => console.error("Failed to send customer email:", err.message));
            // Note: sendMail có thể trả Promise; ta không await để không delay response
        }

        // Gửi thông báo cho admin (ưu tiên, non-blocking)
        try {
            const adminHtml = newOrderAdminTemplate(order);
            // Không cần await bắt buộc, nhưng await Promise.all bên trong hàm để log lỗi
            await sendMailToAdmins({ subject: `Đơn hàng mới #${order._id}`, html: adminHtml });
        } catch (err) {
            console.error("Admin notification error:", err.message);
        }

        return successResponse(res, order, "Tạo đơn hàng thành công!");
    } catch (error) {
        return errorResponse(res, error.message);
    }
};

// 🟡 Lấy danh sách đơn hàng (cho admin)
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("items.product", "name price images")
            .sort({ createdAt: -1 });
        return successResponse(res, orders);
    } catch (error) {
        return errorResponse(res, error.message);
    }
};

// 🔵 Lấy chi tiết 1 đơn hàng
export const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findById(id).populate("items.product", "name price images");
        if (!order) return errorResponse(res, "Không tìm thấy đơn hàng", 404);
        return successResponse(res, order);
    } catch (error) {
        return errorResponse(res, error.message);
    }
};

// 🟠 Cập nhật trạng thái đơn hàng
export const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, isPaid } = req.body;

        const validStatuses = ["pending", "confirmed", "delivering", "completed", "cancelled"];
        if (status && !validStatuses.includes(status)) {
            return errorResponse(res, "Trạng thái không hợp lệ", 400);
        }

        const order = await Order.findByIdAndUpdate(
            id,
            {
                status,
                isPaid,
                paidAt: isPaid ? new Date() : undefined,
            },
            { new: true }
        );

        // 📧 Gửi email thông báo thay đổi trạng thái
        if (order.customerEmail) {
            const html = orderStatusUpdateTemplate(order);
            await sendEmail(order.customerEmail, `Đơn hàng #${order._id} - ${order.status.toUpperCase()}`, html);
        }

        return successResponse(res, order, "Cập nhật đơn hàng thành công!");
    } catch (error) {
        return errorResponse(res, error.message);
    }
};

// 🔴 Xóa đơn hàng
export const deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;
        await Order.findByIdAndDelete(id);
        return successResponse(res, null, "Đã xóa đơn hàng");
    } catch (error) {
        return errorResponse(res, error.message);
    }
};
