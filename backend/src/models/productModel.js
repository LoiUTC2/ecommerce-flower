import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        slug: { type: String, unique: true },
        description: { type: String, required: true },
        category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" }, // sinh nhật, tình yêu, chia buồn,...
        price: { type: Number, required: true },
        discountPrice: { type: Number },
        stock: { type: Number, default: 0 },
        images: [{ type: String }], // link Cloudinary
        videos: [{ type: String }],
        tags: [{ type: String }],
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export default mongoose.model("Product", productSchema);
