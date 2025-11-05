import Stripe from "stripe";
import dotenv from "dotenv";
import Order from "../models/orderModel.js";
import { successResponse, errorResponse } from "../utils/response.js";

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// 🟢 1. Tạo Payment Intent (Stripe)
export const createStripePayment = async (req, res) => {
    try {
        const { orderId } = req.body;

        const order = await Order.findById(orderId);
        if (!order) return errorResponse(res, "Không tìm thấy đơn hàng", 404);

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(order.totalAmount * 100), // VNĐ → cent
            currency: "vnd",
            metadata: { orderId: order._id.toString() },
            description: `Thanh toán đơn hàng #${order._id}`,
        });

        // Cập nhật order
        order.paymentMethod = "stripe";
        order.transactionId = paymentIntent.id;
        await order.save();

        return successResponse(res, {
            clientSecret: paymentIntent.client_secret,
            orderId: order._id,
        });
    } catch (error) {
        console.error("Stripe payment error:", error.message);
        return errorResponse(res, error.message);
    }
};

// 🟠 2. Stripe Webhook — nhận kết quả thanh toán
export const stripeWebhook = async (req, res) => {
    let event;

    try {
        const sig = req.headers["stripe-signature"];
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error("Webhook signature failed:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "payment_intent.succeeded") {
        const paymentIntent = event.data.object;
        const orderId = paymentIntent.metadata.orderId;
        const order = await Order.findById(orderId);
        if (order) {
            order.paymentStatus = "paid";
            order.status = "confirmed";
            await order.save();
            console.log(`✅ Order ${orderId} marked as paid`);
        }
    }

    res.json({ received: true });
};
