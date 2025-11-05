import mongoose from "mongoose";

const productReviewSchema = new mongoose.Schema(
    {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        rating: { type: Number, min: 1, max: 5, required: true },
        comment: { type: String },
        images: [{ type: String }], // người dùng có thể đính kèm ảnh review
    },
    { timestamps: true }
);

// Không cho phép 1 user đánh giá 1 sản phẩm nhiều lần
productReviewSchema.index({ product: 1, user: 1 }, { unique: true });

export default mongoose.model("ProductReview", productReviewSchema);
