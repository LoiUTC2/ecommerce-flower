import Product from "../models/productModel.js";
import cloudinary from "../config/cloudinary.js";
import { successResponse, errorResponse } from "../utils/response.js";
import slugify from "slugify";
import fs from "fs/promises";

// Helper: Xóa file local sau khi upload
const deleteLocalFile = async (filePath) => {
    try {
        await fs.unlink(filePath);
    } catch (error) {
        console.error("Lỗi xóa file local:", error);
    }
};

// Helper: Upload và xóa file local
const uploadToCloudinary = async (file, folder, resourceType = "image") => {
    try {
        const result = await cloudinary.uploader.upload(file.path, {
            folder,
            resource_type: resourceType,
        });
        await deleteLocalFile(file.path);
        return result;
    } catch (error) {
        await deleteLocalFile(file.path);
        throw error;
    }
};

// Helper: Xóa file trên Cloudinary
const deleteFromCloudinary = async (publicId, resourceType = "image") => {
    try {
        await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    } catch (error) {
        console.error("Lỗi xóa file Cloudinary:", error);
    }
};

export const createProduct = async (req, res) => {
    try {
        const { name, description, category, price, discountPrice, stock, tags } = req.body;

        // Validation
        if (!name || !description || !price) {
            return errorResponse(res, "Thiếu thông tin bắt buộc", 400);
        }

        if (price < 0 || (discountPrice && discountPrice < 0)) {
            return errorResponse(res, "Giá không hợp lệ", 400);
        }

        if (stock && stock < 0) {
            return errorResponse(res, "Số lượng không hợp lệ", 400);
        }

        const slug = slugify(name, { lower: true, strict: true });

        // Check slug trùng
        const existingProduct = await Product.findOne({ slug });
        if (existingProduct) {
            return errorResponse(res, "Tên sản phẩm đã tồn tại", 400);
        }

        // Upload hình ảnh lên Cloudinary
        const images = [];
        if (req.files?.images) {
            for (let i = 0; i < req.files.images.length; i++) {
                const file = req.files.images[i];
                const upload = await uploadToCloudinary(file, "flowers/images");
                images.push({
                    url: upload.secure_url,
                    publicId: upload.public_id,
                    isPrimary: i === 0, // Ảnh đầu tiên là primary
                    order: i
                });
            }
        }

        // Upload video lên Cloudinary
        const videos = [];
        if (req.files?.videos) {
            for (const file of req.files.videos) {
                const upload = await uploadToCloudinary(file, "flowers/videos", "video");
                videos.push({
                    url: upload.secure_url,
                    publicId: upload.public_id,
                    thumbnail: upload.secure_url.replace(/\.[^.]+$/, '.jpg'), // Cloudinary auto-generate thumbnail
                    duration: upload.duration
                });
            }
        }

        const newProduct = await Product.create({
            name,
            slug,
            description,
            category,
            price,
            discountPrice,
            stock: stock || 0,
            tags: tags ? tags.split(",").map(tag => tag.trim()) : [],
            images,
            videos,
        });

        return successResponse(res, newProduct, "Tạo sản phẩm thành công!", 201);
    } catch (error) {
        // Xóa các file đã upload nếu có lỗi
        if (req.files?.images) {
            for (const file of req.files.images) {
                await deleteLocalFile(file.path);
            }
        }
        if (req.files?.videos) {
            for (const file of req.files.videos) {
                await deleteLocalFile(file.path);
            }
        }
        return errorResponse(res, error.message);
    }
};

export const getAllProducts = async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 12, 
            category, 
            minPrice, 
            maxPrice,
            search,
            sortBy = 'createdAt',
            order = 'desc'
        } = req.query;

        // Build filter
        const filter = { isActive: true };
        
        if (category) filter.category = category;
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { tags: { $in: [new RegExp(search, 'i')] } }
            ];
        }

        // Pagination
        const skip = (Number(page) - 1) * Number(limit);
        const sortOrder = order === 'asc' ? 1 : -1;

        const [products, total] = await Promise.all([
            Product.find(filter)
                .populate('category', 'name')
                .sort({ [sortBy]: sortOrder })
                .skip(skip)
                .limit(Number(limit)),
            Product.countDocuments(filter)
        ]);

        return successResponse(res, {
            products,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                totalPages: Math.ceil(total / Number(limit))
            }
        });
    } catch (error) {
        return errorResponse(res, error.message);
    }
};

export const getProductBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const product = await Product.findOne({ slug, isActive: true })
            .populate('category', 'name description');
        
        if (!product) {
            return errorResponse(res, "Không tìm thấy sản phẩm", 404);
        }

        return successResponse(res, product);
    } catch (error) {
        return errorResponse(res, error.message);
    }
};

export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = { ...req.body };

        // Tìm sản phẩm hiện tại
        const product = await Product.findById(id);
        if (!product) {
            return errorResponse(res, "Không tìm thấy sản phẩm", 404);
        }

        // Update slug nếu đổi tên
        if (updateData.name && updateData.name !== product.name) {
            updateData.slug = slugify(updateData.name, { lower: true, strict: true });
        }

        // Xử lý upload ảnh mới
        if (req.files?.images) {
            const newImages = [];
            const startOrder = product.images.length;
            
            for (let i = 0; i < req.files.images.length; i++) {
                const file = req.files.images[i];
                const upload = await uploadToCloudinary(file, "flowers/images");
                newImages.push({
                    url: upload.secure_url,
                    publicId: upload.public_id,
                    isPrimary: product.images.length === 0 && i === 0,
                    order: startOrder + i
                });
            }
            updateData.images = [...product.images, ...newImages];
        }

        // Xử lý upload video mới
        if (req.files?.videos) {
            const newVideos = [];
            for (const file of req.files.videos) {
                const upload = await uploadToCloudinary(file, "flowers/videos", "video");
                newVideos.push({
                    url: upload.secure_url,
                    publicId: upload.public_id,
                    thumbnail: upload.secure_url.replace(/\.[^.]+$/, '.jpg'),
                    duration: upload.duration
                });
            }
            updateData.videos = [...product.videos, ...newVideos];
        }

        // Xử lý tags
        if (updateData.tags && typeof updateData.tags === 'string') {
            updateData.tags = updateData.tags.split(",").map(tag => tag.trim());
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            id, 
            updateData, 
            { new: true, runValidators: true }
        ).populate('category');

        return successResponse(res, updatedProduct, "Cập nhật sản phẩm thành công!");
    } catch (error) {
        // Xóa file local nếu có lỗi
        if (req.files?.images) {
            for (const file of req.files.images) {
                await deleteLocalFile(file.path);
            }
        }
        if (req.files?.videos) {
            for (const file of req.files.videos) {
                await deleteLocalFile(file.path);
            }
        }
        return errorResponse(res, error.message);
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);

        if (!product) {
            return errorResponse(res, "Không tìm thấy sản phẩm", 404);
        }

        // Xóa tất cả images trên Cloudinary
        if (product.images && product.images.length > 0) {
            for (const image of product.images) {
                await deleteFromCloudinary(image.publicId);
            }
        }

        // Xóa tất cả videos trên Cloudinary
        if (product.videos && product.videos.length > 0) {
            for (const video of product.videos) {
                await deleteFromCloudinary(video.publicId, "video");
            }
        }

        await Product.findByIdAndDelete(id);
        return successResponse(res, null, "Xóa sản phẩm thành công!");
    } catch (error) {
        return errorResponse(res, error.message);
    }
};

// API mới: Xóa ảnh cụ thể
export const deleteProductImage = async (req, res) => {
    try {
        const { id, imageId } = req.params;
        const product = await Product.findById(id);

        if (!product) {
            return errorResponse(res, "Không tìm thấy sản phẩm", 404);
        }

        const imageIndex = product.images.findIndex(img => img._id.toString() === imageId);
        if (imageIndex === -1) {
            return errorResponse(res, "Không tìm thấy ảnh", 404);
        }

        // Xóa trên Cloudinary
        await deleteFromCloudinary(product.images[imageIndex].publicId);

        // Xóa khỏi database
        product.images.splice(imageIndex, 1);

        // Nếu xóa ảnh primary, set ảnh đầu tiên làm primary
        if (product.images.length > 0 && !product.images.some(img => img.isPrimary)) {
            product.images[0].isPrimary = true;
        }

        await product.save();
        return successResponse(res, product, "Xóa ảnh thành công!");
    } catch (error) {
        return errorResponse(res, error.message);
    }
};

// API mới: Xóa video cụ thể
export const deleteProductVideo = async (req, res) => {
    try {
        const { id, videoId } = req.params;
        const product = await Product.findById(id);

        if (!product) {
            return errorResponse(res, "Không tìm thấy sản phẩm", 404);
        }

        const videoIndex = product.videos.findIndex(vid => vid._id.toString() === videoId);
        if (videoIndex === -1) {
            return errorResponse(res, "Không tìm thấy video", 404);
        }

        // Xóa trên Cloudinary
        await deleteFromCloudinary(product.videos[videoIndex].publicId, "video");

        // Xóa khỏi database
        product.videos.splice(videoIndex, 1);
        await product.save();

        return successResponse(res, product, "Xóa video thành công!");
    } catch (error) {
        return errorResponse(res, error.message);
    }
};

// API mới: Set ảnh primary
export const setPrimaryImage = async (req, res) => {
    try {
        const { id, imageId } = req.params;
        const product = await Product.findById(id);

        if (!product) {
            return errorResponse(res, "Không tìm thấy sản phẩm", 404);
        }

        product.images.forEach(img => {
            img.isPrimary = img._id.toString() === imageId;
        });

        await product.save();
        return successResponse(res, product, "Đặt ảnh chính thành công!");
    } catch (error) {
        return errorResponse(res, error.message);
    }
};

// API mới: Reorder images
export const reorderImages = async (req, res) => {
    try {
        const { id } = req.params;
        const { imageOrders } = req.body; // [{ imageId, order }, ...]

        const product = await Product.findById(id);
        if (!product) {
            return errorResponse(res, "Không tìm thấy sản phẩm", 404);
        }

        imageOrders.forEach(({ imageId, order }) => {
            const image = product.images.find(img => img._id.toString() === imageId);
            if (image) image.order = order;
        });

        product.images.sort((a, b) => a.order - b.order);
        await product.save();

        return successResponse(res, product, "Sắp xếp ảnh thành công!");
    } catch (error) {
        return errorResponse(res, error.message);
    }
};

// API mới: Lấy sản phẩm theo dịp (occasion/tags)
export const getProductsByOccasion = async (req, res) => {
    try {
        const { occasion } = req.params;
        const { page = 1, limit = 12 } = req.query;

        const skip = (Number(page) - 1) * Number(limit);

        const [products, total] = await Promise.all([
            Product.find({ 
                tags: { $regex: occasion, $options: 'i' },
                isActive: true 
            })
                .populate('category', 'name')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(Number(limit)),
            Product.countDocuments({ 
                tags: { $regex: occasion, $options: 'i' },
                isActive: true 
            })
        ]);

        return successResponse(res, {
            products,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                totalPages: Math.ceil(total / Number(limit))
            }
        });
    } catch (error) {
        return errorResponse(res, error.message);
    }
};

// API mới: Lấy sản phẩm liên quan
export const getRelatedProducts = async (req, res) => {
    try {
        const { id } = req.params;
        const { limit = 4 } = req.query;

        const product = await Product.findById(id);
        if (!product) {
            return errorResponse(res, "Không tìm thấy sản phẩm", 404);
        }

        // Tìm sản phẩm cùng category hoặc có tags giống nhau
        const related = await Product.find({
            _id: { $ne: id },
            $or: [
                { category: product.category },
                { tags: { $in: product.tags } }
            ],
            isActive: true
        })
            .populate('category', 'name')
            .limit(Number(limit))
            .sort({ createdAt: -1 });

        return successResponse(res, related);
    } catch (error) {
        return errorResponse(res, error.message);
    }
};