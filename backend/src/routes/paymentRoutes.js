import express from "express";
import { createVnpayPayment, vnpayReturn } from "../controllers/paymentVnpayController.js";
import { createMomoPayment, momoReturn } from "../controllers/paymentMomoController.js";
import { createStripePayment, stripeWebhook } from "../controllers/paymentController.js";
import { verifyAccessToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Stripe
router.post("/stripe/create", verifyAccessToken, createStripePayment);
router.post("/stripe/webhook", express.raw({ type: "application/json" }), stripeWebhook);

// VNPay
router.post("/vnpay/create", verifyAccessToken, createVnpayPayment);
router.get("/vnpay/return", vnpayReturn);

// Momo
router.post("/momo/create", verifyAccessToken, createMomoPayment);
router.get("/momo/return", momoReturn);

export default router;
