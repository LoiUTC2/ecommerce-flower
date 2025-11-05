import crypto from "crypto";
import https from "https";
import dotenv from "dotenv";
import Order from "../models/orderModel.js";
import { successResponse, errorResponse } from "../utils/response.js";

dotenv.config();

export const createMomoPayment = async (req, res) => {
    try {
        const { orderId } = req.body;
        const order = await Order.findById(orderId);
        if (!order) return errorResponse(res, "Không tìm thấy đơn hàng", 404);

        const partnerCode = process.env.MOMO_PARTNER_CODE;
        const accessKey = process.env.MOMO_ACCESS_KEY;
        const secretKey = process.env.MOMO_SECRET_KEY;
        const requestId = partnerCode + new Date().getTime();
        const orderInfo = `Thanh toán đơn hàng #${order._id}`;
        const redirectUrl = process.env.MOMO_RETURN_URL;
        const ipnUrl = process.env.MOMO_RETURN_URL;
        const amount = order.totalAmount.toString();
        const orderIdStr = requestId;

        const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=&ipnUrl=${ipnUrl}&orderId=${orderIdStr}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=captureWallet`;
        const signature = crypto.createHmac("sha256", secretKey).update(rawSignature).digest("hex");

        const body = JSON.stringify({
            partnerCode,
            accessKey,
            requestId,
            amount,
            orderId: orderIdStr,
            orderInfo,
            redirectUrl,
            ipnUrl,
            requestType: "captureWallet",
            signature,
            extraData: "",
        });

        const options = {
            hostname: "test-payment.momo.vn",
            port: 443,
            path: "/v2/gateway/api/create",
            method: "POST",
            headers: { "Content-Type": "application/json" },
        };

        const request = https.request(options, (response) => {
            let data = "";
            response.on("data", (chunk) => (data += chunk));
            response.on("end", () => {
                const result = JSON.parse(data);
                return successResponse(res, { paymentUrl: result.payUrl });
            });
        });

        request.on("error", (e) => console.error(`Momo error: ${e.message}`));
        request.write(body);
        request.end();
    } catch (error) {
        return errorResponse(res, error.message);
    }
};

// 📥 Callback khi thanh toán thành công
export const momoReturn = async (req, res) => {
    try {
        const { orderId, resultCode } = req.query;

        if (resultCode === "0") {
            const order = await Order.findById(orderId);
            if (order) {
                order.paymentMethod = "momo";
                order.paymentStatus = "paid";
                order.status = "confirmed";
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
