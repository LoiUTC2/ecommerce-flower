import express from "express";
import { verifyAccessToken } from "../middlewares/authMiddleware.js";
import {
    createOrUpdateProductReview,
    getProductReviews,
    deleteProductReview,
} from "../controllers/productReviewController.js";

const router = express.Router();

router.post("/product/:productId", verifyAccessToken, createOrUpdateProductReview);
router.get("/product/:productId", getProductReviews);
router.delete("/product/:reviewId", verifyAccessToken, deleteProductReview);


export default router;
