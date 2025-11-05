import mongoose from "mongoose";

const shopReviewSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        comment: {
            type: String,
            default: "",
        },
        reply: {
            content: { type: String, default: "" },
            repliedAt: { type: Date },
        },
    },
    { timestamps: true }
);

// 1 user chỉ được review 1 lần
shopReviewSchema.index({ user: 1 }, { unique: true });

export default mongoose.model("ShopReview", shopReviewSchema);
