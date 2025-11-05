import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true },
        slug: { type: String, unique: true },
        description: { type: String },
        image: { type: String }, // banner, icon hoặc hình minh họa danh mục
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export default mongoose.model("Category", categorySchema);
