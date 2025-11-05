import express from "express";
import {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    deleteOrder,
} from "../controllers/orderController.js";
import { verifyAccessToken, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", verifyAccessToken, createOrder);
router.get("/", getAllOrders);
router.get("/:id", getOrderById);
router.put("/:id", verifyAccessToken, adminOnly, updateOrderStatus);
router.delete("/:id", verifyAccessToken, adminOnly, deleteOrder);

export default router;
