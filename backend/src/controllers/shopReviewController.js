import ShopReview from "../models/shopReviewModel.js";
import ShopInfo from "../models/shopInfoModel.js";
import Notification from "../models/Notification.js";
import User from "../models/userModel.js";

import { successResponse, errorResponse } from "../utils/response.js";

// 🟢 Thêm hoặc cập nhật đánh giá cửa hàng
export const createOrUpdateShopReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;

        const existing = await ShopReview.findOne({ user: req.user.userId });
        if (existing) {
            existing.rating = rating;
            existing.comment = comment;
            await existing.save();
        } else {
            await ShopReview.create({ user: req.user.userId, rating, comment });
        }

        // cập nhật điểm trung bình shop
        await updateShopAverageRating();

        return successResponse(res, null, "Đánh giá cửa hàng thành công!");
    } catch (error) {
        return errorResponse(res, error.message);
    }
};

// 🔵 Lấy danh sách đánh giá cửa hàng (công khai)
export const getShopReviews = async (req, res) => {
    try {
        const reviews = await ShopReview.find()
            .populate("user", "name avatar")
            .sort({ createdAt: -1 });

        return successResponse(res, reviews);
    } catch (error) {
        return errorResponse(res, error.message);
    }
};

// 🔴 Admin xóa review
export const deleteShopReview = async (req, res) => {
    try {
        const review = await ShopReview.findById(req.params.id);
        if (!review) return errorResponse(res, "Không tìm thấy đánh giá", 404);

        await review.deleteOne();
        await updateShopAverageRating();

        return successResponse(res, null, "Đã xóa đánh giá cửa hàng!");
    } catch (error) {
        return errorResponse(res, error.message);
    }
};

// 🟢 Admin phản hồi đánh giá
export const replyToReview = async (req, res) => {
    try {
        const { id } = req.params; // id của review
        const { content } = req.body;

        const review = await ShopReview.findById(id);
        if (!review) return errorResponse(res, "Không tìm thấy đánh giá", 404);

        review.reply = { content, repliedAt: new Date() };
        await review.save();

        await Notification.create({
            user: review.user,
            title: "Shop đã phản hồi đánh giá của bạn 💬",
            message: `Phản hồi: "${content}"`,
            type: "review",
        });

        return successResponse(res, review, "Phản hồi đánh giá thành công!");
    } catch (error) {
        return errorResponse(res, error.message);
    }
};

// 🟠 Admin chỉnh sửa phản hồi
export const updateReply = async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;

        const review = await ShopReview.findById(id);
        if (!review || !review.reply.content)
            return errorResponse(res, "Không có phản hồi để chỉnh sửa", 404);

        review.reply.content = content;
        review.reply.repliedAt = new Date();
        await review.save();

        return successResponse(res, review, "Cập nhật phản hồi thành công!");
    } catch (error) {
        return errorResponse(res, error.message);
    }
};

// 🔴 Admin xóa phản hồi
export const deleteReply = async (req, res) => {
    try {
        const { id } = req.params;

        const review = await ShopReview.findById(id);
        if (!review || !review.reply.content)
            return errorResponse(res, "Không có phản hồi để xóa", 404);

        review.reply = { content: "", repliedAt: null };
        await review.save();

        return successResponse(res, review, "Đã xóa phản hồi!");
    } catch (error) {
        return errorResponse(res, error.message);
    }
};


// 🧮 Tính trung bình rating
const updateShopAverageRating = async () => {
    const reviews = await ShopReview.find();
    const average =
        reviews.length > 0
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
            : 0;

    const shop = await ShopInfo.findOne();
    if (shop) {
        shop.rating = { average, count: reviews.length };
        await shop.save();
    }
};
