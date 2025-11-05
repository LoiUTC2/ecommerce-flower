import Category from "../models/categoryModel.js";
import cloudinary from "../config/cloudinary.js";
import slugify from "slugify";
import { successResponse, errorResponse } from "../utils/response.js";

export const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        const slug = slugify(name, { lower: true, strict: true });

        // Upload ảnh nếu có
        let imageUrl = null;
        if (req.file) {
            const upload = await cloudinary.uploader.upload(req.file.path, {
                folder: "flowers/categories",
            });
            imageUrl = upload.secure_url;
        }

        const category = await Category.create({
            name,
            slug,
            description,
            image: imageUrl,
        });

        return successResponse(res, category, "Tạo danh mục thành công!");
    } catch (error) {
        return errorResponse(res, error.message);
    }
};

export const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort({ createdAt: -1 });
        return successResponse(res, categories);
    } catch (error) {
        return errorResponse(res, error.message);
    }
};

export const getCategoryBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const category = await Category.findOne({ slug });
        if (!category) return errorResponse(res, "Không tìm thấy danh mục", 404);
        return successResponse(res, category);
    } catch (error) {
        return errorResponse(res, error.message);
    }
};

export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        if (updateData.name) {
            updateData.slug = slugify(updateData.name, { lower: true, strict: true });
        }

        // Upload ảnh mới nếu có
        if (req.file) {
            const upload = await cloudinary.uploader.upload(req.file.path, {
                folder: "flowers/categories",
            });
            updateData.image = upload.secure_url;
        }

        const category = await Category.findByIdAndUpdate(id, updateData, {
            new: true,
        });

        return successResponse(res, category, "Cập nhật danh mục thành công!");
    } catch (error) {
        return errorResponse(res, error.message);
    }
};

export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        await Category.findByIdAndDelete(id);
        return successResponse(res, null, "Xóa danh mục thành công!");
    } catch (error) {
        return errorResponse(res, error.message);
    }
};
