import express from "express";
import {
    getShopInfo,
    updateShopInfo,
    toggleShopVisibility,
} from "../controllers/shopInfoController.js";
import { verifyAccessToken, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Hiển thị công khai
router.get("/", getShopInfo);

// Admin quản lý
router.put("/", verifyAccessToken, adminOnly, updateShopInfo);
router.patch("/toggle", verifyAccessToken, adminOnly, toggleShopVisibility);

export default router;
