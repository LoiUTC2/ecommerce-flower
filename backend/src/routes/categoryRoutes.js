import express from "express";
import {
    createCategory,
    getAllCategories,
    getCategoryBySlug,
    updateCategory,
    deleteCategory,
    updateDisplayOrder,
    getPopularCategories,
    syncProductCounts
} from "../controllers/categoryController.js";
import { upload } from "../middlewares/uploadMiddleware.js";
import { verifyAccessToken, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllCategories);
router.get("/popular", getPopularCategories);
router.get("/:slug", getCategoryBySlug);

// Admin routes
router.post("/",
    verifyAccessToken,
    adminOnly,
    upload.single("image"),
    createCategory
);

router.put("/:id",
    verifyAccessToken,
    adminOnly,
    upload.single("image"),
    updateCategory
);

router.delete("/:id",
    verifyAccessToken,
    adminOnly,
    deleteCategory
);

router.patch("/update-order",
    verifyAccessToken,
    adminOnly,
    updateDisplayOrder
);

router.post("/sync-counts",
    verifyAccessToken,
    adminOnly,
    syncProductCounts
);

export default router;