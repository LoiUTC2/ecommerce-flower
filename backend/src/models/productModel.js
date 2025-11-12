import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Tên sản phẩm là bắt buộc"],
            trim: true,
            maxlength: [200, "Tên sản phẩm không được vượt quá 200 ký tự"]
        },
        slug: {
            type: String,
            unique: true,
            index: true
        },
        description: {
            type: String,
            required: [true, "Mô tả là bắt buộc"],
            trim: true
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            index: true
        },
        price: {
            type: Number,
            required: [true, "Giá là bắt buộc"],
            min: [0, "Giá không được âm"]
        },
        discountPrice: {
            type: Number,
            validate: {
                validator: function (value) {
                    return !value || value < this.price;
                },
                message: "Giá khuyến mãi phải nhỏ hơn giá gốc"
            }
        },
        stock: {
            type: Number,
            default: 0,
            min: [0, "Số lượng không được âm"]
        },
        // Cấu trúc images mới - chi tiết hơn
        images: [{
            url: {
                type: String,
                required: true
            },
            publicId: {
                type: String,
                required: true
            },
            isPrimary: {
                type: Boolean,
                default: false
            },
            alt: {
                type: String,
                default: ""
            },
            order: {
                type: Number,
                default: 0
            }
        }],
        // Cấu trúc videos mới
        videos: [{
            url: {
                type: String,
                required: true
            },
            publicId: {
                type: String,
                required: true
            },
            thumbnail: {
                type: String
            },
            duration: {
                type: Number
            }
        }],
        tags: [{
            type: String,
            trim: true,
            lowercase: true
        }],
        isActive: {
            type: Boolean,
            default: true,
            index: true
        },
        // Thêm các trường hữu ích
        viewCount: {
            type: Number,
            default: 0
        },
        soldCount: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// Index cho search và filter
productSchema.index({ name: "text", description: "text", tags: "text" });
productSchema.index({ price: 1, createdAt: -1 });
productSchema.index({ category: 1, isActive: 1 });

// Virtual: tính % giảm giá
productSchema.virtual("discountPercent").get(function () {
    if (!this.discountPrice || this.discountPrice >= this.price) return 0;
    return Math.round(((this.price - this.discountPrice) / this.price) * 100);
});

// Virtual: check còn hàng không
productSchema.virtual("inStock").get(function () {
    return this.stock > 0;
});

// Method: tăng view count
productSchema.methods.incrementViewCount = async function () {
    this.viewCount += 1;
    return this.save();
};

// Method: tăng sold count
productSchema.methods.incrementSoldCount = async function (quantity = 1) {
    this.soldCount += quantity;
    this.stock = Math.max(0, this.stock - quantity);
    return this.save();
};

// Static method: tìm sản phẩm hot (bán chạy)
productSchema.statics.findHotProducts = function (limit = 10) {
    return this.find({ isActive: true })
        .sort({ soldCount: -1 })
        .limit(limit)
        .populate('category', 'name');
};

// Static method: tìm sản phẩm mới
productSchema.statics.findNewProducts = function (limit = 10) {
    return this.find({ isActive: true })
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate('category', 'name');
};

// Pre-save hook: đảm bảo chỉ có 1 ảnh primary
productSchema.pre('save', function (next) {
    if (this.images && this.images.length > 0) {
        const primaryCount = this.images.filter(img => img.isPrimary).length;

        if (primaryCount === 0) {
            // Nếu không có ảnh primary, set ảnh đầu tiên
            this.images[0].isPrimary = true;
        } else if (primaryCount > 1) {
            // Nếu có nhiều ảnh primary, chỉ giữ lại ảnh đầu tiên
            let foundFirst = false;
            this.images.forEach(img => {
                if (img.isPrimary && !foundFirst) {
                    foundFirst = true;
                } else if (img.isPrimary) {
                    img.isPrimary = false;
                }
            });
        }
    }
    next();
});

export default mongoose.model("Product", productSchema);