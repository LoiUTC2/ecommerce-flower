import crypto from "crypto";
import qs from "qs";
import moment from "moment";
import dotenv from "dotenv";
import Order from "../models/orderModel.js";
import { successResponse, errorResponse } from "../utils/response.js";

dotenv.config();

export const createVnpayPayment = async (req, res) => {
    try {
        const { orderId } = req.body;
        const order = await Order.findById(orderId);
        if (!order) return errorResponse(res, "Không tìm thấy đơn hàng", 404);

        const vnp_TmnCode = process.env.VNP_TMNCODE;
        const vnp_HashSecret = process.env.VNP_HASHSECRET;
        const vnp_Url = process.env.VNP_URL;
        const vnp_ReturnUrl = process.env.VNP_RETURN_URL;

        const createDate = moment().format("YYYYMMDDHHmmss");
        const orderIdStr = `${moment().format("HHmmss")}${order._id}`;
        const amount = order.totalAmount * 100;

        const ipAddr =
            req.headers["x-forwarded-for"] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress;

        let vnp_Params = {
            vnp_Version: "2.1.0",
            vnp_Command: "pay",
            vnp_TmnCode,
            vnp_Locale: "vn",
            vnp_CurrCode: "VND",
            vnp_TxnRef: orderIdStr,
            vnp_OrderInfo: `Thanh toan don hang #${order._id}`,
            vnp_OrderType: "billpayment",
            vnp_Amount: amount,
            vnp_ReturnUrl,
            vnp_IpAddr: ipAddr,
            vnp_CreateDate: createDate,
        };

        vnp_Params = sortObject(vnp_Params);
        const signData = qs.stringify(vnp_Params, { encode: false });
        const hmac = crypto.createHmac("sha512", vnp_HashSecret);
        const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
        vnp_Params["vnp_SecureHash"] = signed;
        const paymentUrl = `${vnp_Url}?${qs.stringify(vnp_Params, { encode: false })}`;

        return successResponse(res, { paymentUrl });
    } catch (error) {
        return errorResponse(res, error.message);
    }
};

// 📥 Callback sau khi thanh toán
export const vnpayReturn = async (req, res) => {
    try {
        let vnp_Params = req.query;
        const secureHash = vnp_Params["vnp_SecureHash"];

        delete vnp_Params["vnp_SecureHash"];
        delete vnp_Params["vnp_SecureHashType"];

        vnp_Params = sortObject(vnp_Params);
        const signData = qs.stringify(vnp_Params, { encode: false });
        const hmac = crypto.createHmac("sha512", process.env.VNP_HASHSECRET);
        const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

        if (secureHash === signed && vnp_Params["vnp_ResponseCode"] === "00") {
            const orderId = vnp_Params["vnp_OrderInfo"].split("#")[1];
            const order = await Order.findById(orderId);
            if (order) {
                order.paymentMethod = "vnpay";
                order.paymentStatus = "paid";
                order.status = "confirmed";
                order.transactionId = vnp_Params["vnp_TransactionNo"];
                await order.save();
            }
            return res.redirect(`/payment-success?order=${orderId}`);
        } else {
            return res.redirect(`/payment-failed`);
        }
    } catch (error) {
        console.error(error);
        return res.redirect(`/payment-failed`);
    }
};

// Utility
function sortObject(obj) {
    const sorted = {};
    const keys = Object.keys(obj).sort();
    for (const key of keys) sorted[key] = obj[key];
    return sorted;
}
