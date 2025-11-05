import express from "express";
import {
    createProduct,
    getAllProducts,
    getProductBySlug,
    updateProduct,
    deleteProduct,
} from "../controllers/productController.js";
import { upload } from "../middlewares/uploadMiddleware.js";
import { verifyAccessToken, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

// CRUD
router.post("/", verifyAccessToken, adminOnly, upload.fields([{ name: "images" }, { name: "videos" }]), createProduct);
router.get("/", getAllProducts);
router.get("/:slug", getProductBySlug);
router.put("/:id", verifyAccessToken, adminOnly, updateProduct);
router.delete("/:id", verifyAccessToken, adminOnly, deleteProduct);

export default router;
