import mongoose from "mongoose";

const shopInfoSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            default: "Cửa hàng hoa KiLan Fresh Flower",
        },
        slogan: {
            type: String,
            default: "Lan tỏa yêu thương qua từng bông hoa 🌸",
        },
        description: {
            type: String,
            default: "",
        },
        address: {
            type: String,
            required: true,
            default: "Số 123, Đường Hoa Hồng, Quận 1, TP. Hồ Chí Minh",
        },
        phone: {
            type: String,
            required: true,
            default: "0123 456 789",
        },
        email: {
            type: String,
            required: true,
            default: "contact@kilanfreshflower.vn",
        },
        logo: {
            type: String,
            default: "",
        },
        banner: {
            type: String,
            default: "",
        },
        images: [{ type: String }], // ảnh giới thiệu, banner phụ, không bắt buộc
        socialLinks: {
            facebook: { type: String },
            instagram: { type: String },
            tiktok: { type: String },
            website: { type: String },
        },
        openingHours: {
            type: String,
            default: "Thứ 2 - Chủ nhật: 7:00 - 21:00",
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model("ShopInfo", shopInfoSchema);
