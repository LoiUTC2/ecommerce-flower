import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Tên danh mục là bắt buộc"],
            unique: true,
            trim: true,
            maxlength: [100, "Tên danh mục không được vượt quá 100 ký tự"]
        },
        slug: {
            type: String,
            unique: true,
            lowercase: true,
            index: true
        },
        description: {
            type: String,
            trim: true,
            maxlength: [500, "Mô tả không được vượt quá 500 ký tự"]
        },
        // Cấu trúc image chi tiết hơn
        image: {
            url: { type: String },
            publicId: { type: String }, // Để xóa trên Cloudinary
            alt: { type: String }
        },
        isActive: {
            type: Boolean,
            default: true,
            index: true
        },
        // Thứ tự hiển thị (cho admin sắp xếp)
        displayOrder: {
            type: Number,
            default: 0
        },
        // Icon cho category (tulip, rose, lily...)
        icon: {
            type: String,
            enum: ['tulip', 'rose', 'lily', 'orchid', 'sunflower', 'daisy', 'carnation', 'other'],
            default: 'other'
        },
        // Thêm metadata cho SEO
        seo: {
            metaTitle: { type: String, maxlength: 60 },
            metaDescription: { type: String, maxlength: 160 },
            metaKeywords: [{ type: String }]
        },
        // Đặc điểm của loại hoa này (cho filter/search)
        features: {
            // Dịp phù hợp
            occasions: [{
                type: String,
                enum: ['birthday', 'wedding', 'anniversary', 'funeral', 'congratulation', 'apology', 'love', 'other']
            }],
            // Màu sắc chủ đạo
            colors: [{
                type: String,
                enum: ['red', 'white', 'pink', 'yellow', 'purple', 'orange', 'blue', 'mixed']
            }],
            // Mùa hoa
            season: [{
                type: String,
                enum: ['spring', 'summer', 'autumn', 'winter', 'all-year']
            }]
        },
        // Thống kê
        stats: {
            productCount: { type: Number, default: 0 },
            viewCount: { type: Number, default: 0 },
            orderCount: { type: Number, default: 0 }
        }
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// Index cho search và filter
categorySchema.index({ name: 'text', description: 'text' });
categorySchema.index({ isActive: 1, displayOrder: 1 });

// Virtual: check có product không
categorySchema.virtual('hasProducts').get(function () {
    return this.stats.productCount > 0;
});

// Method: tăng view count
categorySchema.methods.incrementViewCount = async function () {
    this.stats.viewCount += 1;
    return this.save();
};

// Method: cập nhật số lượng product
categorySchema.methods.updateProductCount = async function () {
    const Product = mongoose.model('Product');
    const count = await Product.countDocuments({
        category: this._id,
        isActive: true
    });
    this.stats.productCount = count;
    return this.save();
};

// Static: lấy categories phổ biến
categorySchema.statics.findPopularCategories = function (limit = 5) {
    return this.find({ isActive: true })
        .sort({ 'stats.orderCount': -1 })
        .limit(limit)
        .select('name slug image icon stats');
};

// Static: lấy categories theo displayOrder
categorySchema.statics.findActiveCategories = function () {
    return this.find({ isActive: true })
        .sort({ displayOrder: 1, name: 1 })
        .select('name slug description image icon features');
};

// Pre-remove hook: kiểm tra trước khi xóa
categorySchema.pre('findOneAndDelete', async function (next) {
    const docToDelete = await this.model.findOne(this.getQuery());
    if (docToDelete && docToDelete.stats.productCount > 0) {
        throw new Error('Không thể xóa danh mục đang có sản phẩm. Vui lòng chuyển sản phẩm sang danh mục khác trước.');
    }
    next();
});

export default mongoose.model("Category", categorySchema);