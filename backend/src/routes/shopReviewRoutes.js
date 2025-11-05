import express from "express";
import {
    createOrUpdateShopReview,
    getShopReviews,
    deleteShopReview,
    replyToReview,
    updateReply,
    deleteReply,
} from "../controllers/shopReviewController.js";
import { verifyAccessToken, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Review khách hàng
router.get("/", getShopReviews);
router.post("/", verifyAccessToken, createOrUpdateShopReview);
router.delete("/:id", verifyAccessToken, adminOnly, deleteShopReview);

// Phản hồi của shop (Admin)
router.post("/:id/reply", verifyAccessToken, adminOnly, replyToReview);
router.put("/:id/reply", verifyAccessToken, adminOnly, updateReply);
router.delete("/:id/reply", verifyAccessToken, adminOnly, deleteReply);

export default router;
