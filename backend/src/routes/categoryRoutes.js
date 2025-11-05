import express from "express";
import {
    createCategory,
    getAllCategories,
    getCategoryBySlug,
    updateCategory,
    deleteCategory,
} from "../controllers/categoryController.js";
import { upload } from "../middlewares/uploadMiddleware.js";

import { verifyAccessToken, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", verifyAccessToken, adminOnly, upload.single("image"), createCategory);
router.get("/", getAllCategories);
router.get("/:slug", getCategoryBySlug);
router.put("/:id", verifyAccessToken, adminOnly, upload.single("image"), updateCategory);
router.delete("/:id", verifyAccessToken, adminOnly, deleteCategory);

export default router;
