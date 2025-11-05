import express from "express";
import {
    getSummaryStats,
    getRevenueByDay,
    getRevenueByMonth,
    getTopProducts,
    getOrderStatusStats,
} from "../controllers/dashboardController.js";
import { verifyAccessToken, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

// 👑 Chỉ admin mới được xem dashboard
router.get("/summary", verifyAccessToken, adminOnly, getSummaryStats);
router.get("/revenue/day", verifyAccessToken, adminOnly, getRevenueByDay);
router.get("/revenue/month", verifyAccessToken, adminOnly, getRevenueByMonth);
router.get("/top-products", verifyAccessToken, adminOnly, getTopProducts);
router.get("/orders/status", verifyAccessToken, adminOnly, getOrderStatusStats);

export default router;
