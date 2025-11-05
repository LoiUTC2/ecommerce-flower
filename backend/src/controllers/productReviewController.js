import ProductReview from "../models/productReviewModel.js";
import Product from "../models/productModel.js";
import { successResponse, errorResponse } from "../utils/response.js";

// 🟢 Thêm hoặc cập nhật review
export const createOrUpdateProductReview = async (req, res) => {
    try {
        const { productId } = req.params;
        const { rating, comment, images } = req.body;

        const existing = await ProductReview.findOne({ product: productId, user: req.user.id });

        if (existing) {
            existing.rating = rating;
            existing.comment = comment;
            existing.images = images || [];
            await existing.save();
            return successResponse(res, existing, "Cập nhật đánh giá thành công!");
        }

        const newReview = await ProductReview.create({
            product: productId,
            user: req.user.id,
            rating,
            comment,
            images,
        });

        // cập nhật điểm trung bình sản phẩm
        await updateProductRating(productId);

        return successResponse(res, newReview, "Thêm đánh giá thành công!");
    } catch (error) {
        return errorResponse(res, error.message);
    }
};

// 🔵 Lấy tất cả review theo sản phẩm
export const getProductReviews = async (req, res) => {
    try {
        const { productId } = req.params;
        const reviews = await ProductReview.find({ product: productId })
            .populate("user", "name avatar")
            .sort({ createdAt: -1 });

        return successResponse(res, reviews);
    } catch (error) {
        return errorResponse(res, error.message);
    }
};

// 🔴 Xóa review (admin hoặc chủ review)
export const deleteProductReview = async (req, res) => {
    try {
        const review = await ProductReview.findById(req.params.reviewId);
        if (!review) return errorResponse(res, "Không tìm thấy đánh giá", 404);

        if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
            return errorResponse(res, "Không có quyền xóa đánh giá này", 403);
        }

        await review.deleteOne();
        await updateProductRating(review.product);

        return successResponse(res, null, "Đã xóa đánh giá");
    } catch (error) {
        return errorResponse(res, error.message);
    }
};

// 🧮 Hàm cập nhật rating trung bình cho sản phẩm
const updateProductRating = async (productId) => {
    const reviews = await ProductReview.find({ product: productId });
    const avgRating =
        reviews.length > 0
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
            : 0;

    await Product.findByIdAndUpdate(productId, {
        ratings: {
            average: avgRating,
            count: reviews.length,
        },
    });
};
