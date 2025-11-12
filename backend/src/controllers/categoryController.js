import Category from "../models/categoryModel.js";
import Product from "../models/productModel.js";
import cloudinary from "../config/cloudinary.js";
import slugify from "slugify";
import { successResponse, errorResponse } from "../utils/response.js";

// Validation helper
const validateCategoryInput = (data) => {
    const errors = [];

    if (!data.name || data.name.trim().length === 0) {
        errors.push("Tên danh mục không được để trống");
    }

    if (data.name && data.name.length > 100) {
        errors.push("Tên danh mục không được vượt quá 100 ký tự");
    }

    if (data.description && data.description.length > 500) {
        errors.push("Mô tả không được vượt quá 500 ký tự");
    }

    return errors;
};

// Helper: upload và xóa ảnh
const handleImageUpload = async (file, oldPublicId = null) => {
    try {
        // Xóa ảnh cũ nếu có
        if (oldPublicId) {
            await cloudinary.uploader.destroy(oldPublicId);
        }

        // Upload ảnh mới
        const upload = await cloudinary.uploader.upload(file.path, {
            folder: "flowers/categories",
            transformation: [
                { width: 800, height: 600, crop: "limit" },
                { quality: "auto" },
                { fetch_format: "auto" }
            ]
        });

        return {
            url: upload.secure_url,
            publicId: upload.public_id,
            alt: ""
        };
    } catch (error) {
        throw new Error(`Lỗi upload ảnh: ${error.message}`);
    }
};

export const createCategory = async (req, res) => {
    try {
        const { name, description, icon, displayOrder, occasions, colors, season, seo } = req.body;

        // Validate input
        const validationErrors = validateCategoryInput({ name, description });
        if (validationErrors.length > 0) {
            return errorResponse(res, validationErrors.join(", "), 400);
        }

        // Generate slug
        const slug = slugify(name, { lower: true, strict: true });

        // Check duplicate
        const existingCategory = await Category.findOne({
            $or: [{ name }, { slug }]
        });
        if (existingCategory) {
            return errorResponse(res, "Danh mục đã tồn tại", 409);
        }

        // Prepare category data
        const categoryData = {
            name: name.trim(),
            slug,
            description: description?.trim(),
            icon,
            displayOrder: displayOrder || 0,
            features: {
                occasions: occasions ? JSON.parse(occasions) : [],
                colors: colors ? JSON.parse(colors) : [],
                season: season ? JSON.parse(season) : []
            },
            seo: seo ? JSON.parse(seo) : {}
        };

        // Upload ảnh nếu có
        if (req.file) {
            categoryData.image = await handleImageUpload(req.file);
        }

        const category = await Category.create(categoryData);

        return successResponse(res, category, "Tạo danh mục thành công!", 201);
    } catch (error) {
        console.error("Create category error:", error);
        return errorResponse(res, error.message);
    }
};

export const getAllCategories = async (req, res) => {
    try {
        const {
            isActive,
            search,
            sortBy = 'displayOrder',
            order = 'asc',
            page = 1,
            limit = 50
        } = req.query;

        // Build filter
        const filter = {};
        if (isActive !== undefined) {
            filter.isActive = isActive === 'true';
        }
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        // Sorting
        const sortOrder = order === 'desc' ? -1 : 1;
        const sortOptions = {};
        sortOptions[sortBy] = sortOrder;
        if (sortBy !== 'name') sortOptions.name = 1; // Secondary sort

        // Pagination
        const skip = (page - 1) * limit;

        const [categories, total] = await Promise.all([
            Category.find(filter)
                .sort(sortOptions)
                .skip(skip)
                .limit(parseInt(limit))
                .select('-__v'),
            Category.countDocuments(filter)
        ]);

        return successResponse(res, {
            categories,
            pagination: {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / limit),
                limit: parseInt(limit)
            }
        });
    } catch (error) {
        console.error("Get categories error:", error);
        return errorResponse(res, error.message);
    }
};

export const getCategoryBySlug = async (req, res) => {
    try {
        const { slug } = req.params;

        const category = await Category.findOne({ slug, isActive: true });
        if (!category) {
            return errorResponse(res, "Không tìm thấy danh mục", 404);
        }

        // Tăng view count (không chặn response)
        category.incrementViewCount().catch(err =>
            console.error("Error incrementing view count:", err)
        );

        // Lấy danh sách sản phẩm của category
        const products = await Product.find({
            category: category._id,
            isActive: true
        })
            .select('name slug price discountPrice images stock')
            .limit(12)
            .sort({ soldCount: -1 });

        return successResponse(res, {
            category,
            products
        });
    } catch (error) {
        console.error("Get category error:", error);
        return errorResponse(res, error.message);
    }
};

export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, icon, displayOrder, isActive, occasions, colors, season, seo } = req.body;

        // Helper: Parse nếu là string, giữ nguyên nếu là array
        const parseIfNeeded = (value) => {
            if (!value) return null;              // Nếu undefined/null → null
            if (Array.isArray(value)) return value; // Nếu đã là array → giữ nguyên
            try {
                return JSON.parse(value);          // Nếu là string → parse
            } catch (e) {
                console.error('Parse error:', value);
                return null;                        // Parse fail → null
            }
        };

        const parseSEO = (value) => {
            if (!value) return null;
            if (typeof value === 'object' && !Array.isArray(value)) return value; // Đã là object
            try {
                return JSON.parse(value);
            } catch (e) {
                console.error('Parse SEO error:', value);
                return null;
            }
        };

        // Check category exists
        const category = await Category.findById(id);
        if (!category) {
            return errorResponse(res, "Không tìm thấy danh mục", 404);
        }

        // Validate if name is being updated
        if (name && name !== category.name) {
            const validationErrors = validateCategoryInput({ name, description });
            if (validationErrors.length > 0) {
                return errorResponse(res, validationErrors.join(", "), 400);
            }

            // Check duplicate name
            const duplicate = await Category.findOne({
                name,
                _id: { $ne: id }
            });
            if (duplicate) {
                return errorResponse(res, "Tên danh mục đã tồn tại", 409);
            }

            category.name = name.trim();
            category.slug = slugify(name, { lower: true, strict: true });
        }

        // Update fields
        if (description !== undefined) category.description = description?.trim();
        if (icon) category.icon = icon;
        if (displayOrder !== undefined) category.displayOrder = displayOrder;
        if (isActive !== undefined) category.isActive = isActive;

        if (occasions || colors || season) {
            const parsedOccasions = parseIfNeeded(occasions);
            const parsedColors = parseIfNeeded(colors);
            const parsedSeason = parseIfNeeded(season);

            category.features = {
                occasions: parsedOccasions !== null ? parsedOccasions : category.features.occasions,
                colors: parsedColors !== null ? parsedColors : category.features.colors,
                season: parsedSeason !== null ? parsedSeason : category.features.season
            };
        }

        if (seo) {
            const parsedSEO = parseSEO(seo);
            if (parsedSEO) {
                category.seo = parsedSEO;
            }
        }

        // Upload ảnh mới nếu có
        if (req.file) {
            category.image = await handleImageUpload(
                req.file,
                category.image?.publicId
            );
        }

        await category.save();

        return successResponse(res, category, "Cập nhật danh mục thành công!");
    } catch (error) {
        console.error("Update category error:", error);
        return errorResponse(res, error.message);
    }
};

export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { forceDelete = false, moveTo } = req.query;

        const category = await Category.findById(id);
        if (!category) {
            return errorResponse(res, "Không tìm thấy danh mục", 404);
        }

        // Kiểm tra có product không
        const productCount = await Product.countDocuments({ category: id });

        if (productCount > 0) {
            if (!forceDelete && !moveTo) {
                return errorResponse(
                    res,
                    `Danh mục đang có ${productCount} sản phẩm. Vui lòng chuyển sản phẩm hoặc dùng forceDelete=true`,
                    400
                );
            }

            if (moveTo) {
                // Chuyển sản phẩm sang danh mục khác
                const targetCategory = await Category.findById(moveTo);
                if (!targetCategory) {
                    return errorResponse(res, "Danh mục đích không tồn tại", 404);
                }

                await Product.updateMany(
                    { category: id },
                    { category: moveTo }
                );

                // Cập nhật product count
                await targetCategory.updateProductCount();
            } else if (forceDelete) {
                // Set category của products về null
                await Product.updateMany(
                    { category: id },
                    { category: null }
                );
            }
        }

        // Xóa ảnh trên Cloudinary
        if (category.image?.publicId) {
            await cloudinary.uploader.destroy(category.image.publicId);
        }

        await Category.findByIdAndDelete(id);

        return successResponse(res, null, "Xóa danh mục thành công!");
    } catch (error) {
        console.error("Delete category error:", error);
        return errorResponse(res, error.message);
    }
};

// API mới: Cập nhật thứ tự hiển thị
export const updateDisplayOrder = async (req, res) => {
    try {
        const { orders } = req.body; // [{ id, displayOrder }, ...]

        if (!Array.isArray(orders)) {
            return errorResponse(res, "Format không hợp lệ", 400);
        }

        const updatePromises = orders.map(({ id, displayOrder }) =>
            Category.findByIdAndUpdate(id, { displayOrder })
        );

        await Promise.all(updatePromises);

        return successResponse(res, null, "Cập nhật thứ tự thành công!");
    } catch (error) {
        console.error("Update display order error:", error);
        return errorResponse(res, error.message);
    }
};

// API mới: Lấy danh mục phổ biến
export const getPopularCategories = async (req, res) => {
    try {
        const { limit = 5 } = req.query;
        const categories = await Category.findPopularCategories(parseInt(limit));
        return successResponse(res, categories);
    } catch (error) {
        console.error("Get popular categories error:", error);
        return errorResponse(res, error.message);
    }
};

// API mới: Sync product count
export const syncProductCounts = async (req, res) => {
    try {
        const categories = await Category.find();

        const updatePromises = categories.map(category =>
            category.updateProductCount()
        );

        await Promise.all(updatePromises);

        return successResponse(res, null, "Đồng bộ số lượng sản phẩm thành công!");
    } catch (error) {
        console.error("Sync product counts error:", error);
        return errorResponse(res, error.message);
    }
};