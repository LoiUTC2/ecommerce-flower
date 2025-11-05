import Product from "../models/productModel.js";
import cloudinary from "../config/cloudinary.js";
import { successResponse, errorResponse } from "../utils/response.js";
import slugify from "slugify";

export const createProduct = async (req, res) => {
    try {
        const { name, description, category, price, discountPrice, stock, tags } = req.body;
        const slug = slugify(name, { lower: true, strict: true });

        // Upload hình ảnh lên Cloudinary
        const imageUrls = [];
        if (req.files?.images) {
            for (const file of req.files.images) {
                const upload = await cloudinary.uploader.upload(file.path, { folder: "flowers/images" });
                imageUrls.push(upload.secure_url);
            }
        }

        const newProduct = await Product.create({
            name,
            slug,
            description,
            category,
            price,
            discountPrice,
            stock,
            tags: tags ? tags.split(",") : [],
            images: imageUrls,
        });

        return successResponse(res, newProduct, "Tạo sản phẩm thành công!");
    } catch (error) {
        return errorResponse(res, error.message);
    }
};

export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        return successResponse(res, products);
    } catch (error) {
        return errorResponse(res, error.message);
    }
};

export const getProductBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const product = await Product.findOne({ slug });
        if (!product) return errorResponse(res, "Không tìm thấy sản phẩm", 404);
        return successResponse(res, product);
    } catch (error) {
        return errorResponse(res, error.message);
    }
};

export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const product = await Product.findByIdAndUpdate(id, updateData, { new: true });
        return successResponse(res, product, "Cập nhật sản phẩm thành công!");
    } catch (error) {
        return errorResponse(res, error.message);
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        await Product.findByIdAndDelete(id);
        return successResponse(res, null, "Xóa sản phẩm thành công!");
    } catch (error) {
        return errorResponse(res, error.message);
    }
};
