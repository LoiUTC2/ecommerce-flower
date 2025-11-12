import express from "express";
import {
    createProduct,
    getAllProducts,
    getProductBySlug,
    updateProduct,
    deleteProduct,
    deleteProductImage,
    deleteProductVideo,
    setPrimaryImage,
    reorderImages,
    getProductsByOccasion,
    getRelatedProducts,
} from "../controllers/productController.js";
import { upload } from "../middlewares/uploadMiddleware.js";
import { verifyAccessToken, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

// ============= PUBLIC ROUTES (không cần auth) =============

// Lấy tất cả sản phẩm (có filter, pagination)
router.get("/", getAllProducts);

// Lấy sản phẩm theo dịp/occasion (birthday, love, condolence, etc.)
router.get("/occasion/:occasion", getProductsByOccasion);

// Lấy sản phẩm liên quan
router.get("/:id/related", getRelatedProducts);

// Lấy sản phẩm theo slug (phải để CUỐI CÙNG vì nó match mọi thứ)
router.get("/:slug", getProductBySlug);

// ============= ADMIN ROUTES (cần auth + admin) =============

// Tạo sản phẩm mới
router.post(
    "/",
    verifyAccessToken,
    adminOnly,
    upload.fields([{ name: "images" }, { name: "videos" }]),
    createProduct
);

// Cập nhật sản phẩm (có thể upload thêm ảnh/video)
router.put(
    "/:id",
    verifyAccessToken,
    adminOnly,
    upload.fields([{ name: "images" }, { name: "videos" }]),
    updateProduct
);

// Xóa sản phẩm
router.delete("/:id", verifyAccessToken, adminOnly, deleteProduct);

// Xóa ảnh cụ thể của sản phẩm
router.delete("/:id/images/:imageId", verifyAccessToken, adminOnly, deleteProductImage);

// Xóa video cụ thể của sản phẩm
router.delete("/:id/videos/:videoId", verifyAccessToken, adminOnly, deleteProductVideo);

// Đặt ảnh làm ảnh chính
router.put("/:id/images/:imageId/primary", verifyAccessToken, adminOnly, setPrimaryImage);

// Sắp xếp lại thứ tự ảnh
router.put("/:id/images/reorder", verifyAccessToken, adminOnly, reorderImages);

export default router;