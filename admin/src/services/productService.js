// src/services/productService.js
import api from "../utils/api";

const BASE = "/api/products";

/**
 * Lấy danh sách sản phẩm với filter, pagination
 * @param {Object} params - Query parameters
 * @param {number} params.page - Trang hiện tại (default: 1)
 * @param {number} params.limit - Số sản phẩm/trang (default: 12)
 * @param {string} params.category - ID danh mục
 * @param {number} params.minPrice - Giá tối thiểu
 * @param {number} params.maxPrice - Giá tối đa
 * @param {string} params.search - Từ khóa tìm kiếm
 * @param {string} params.sortBy - Sắp xếp theo (createdAt, price, name)
 * @param {string} params.order - asc hoặc desc
 */
export const getProducts = async (params = {}) => {
    const res = await api.get(`${BASE}`, { params });
    return res.data; // { success, data: { products, pagination } }
};

/**
 * Lấy chi tiết sản phẩm theo slug
 */
export const getProductBySlug = async (slug) => {
    const res = await api.get(`${BASE}/${slug}`);
    return res.data; // { success, data: product }
};

/**
 * Lấy sản phẩm theo dịp (occasion)
 * @param {string} occasion - birthday, love, condolence, etc.
 */
export const getProductsByOccasion = async (occasion) => {
    const res = await api.get(`${BASE}/occasion/${occasion}`);
    return res.data;
};

/**
 * Lấy sản phẩm liên quan
 */
export const getRelatedProducts = async (productId) => {
    const res = await api.get(`${BASE}/${productId}/related`);
    return res.data;
};

/**
 * Tạo sản phẩm mới (Admin only)
 * @param {Object} productData - Thông tin sản phẩm
 * @param {File[]} productData.images - Mảng file ảnh
 * @param {File[]} productData.videos - Mảng file video
 */
export const createProduct = async (productData) => {
    const formData = new FormData();

    // Append các field text
    formData.append("name", productData.name);
    formData.append("description", productData.description);
    formData.append("price", productData.price);

    if (productData.category) formData.append("category", productData.category);
    if (productData.discountPrice) formData.append("discountPrice", productData.discountPrice);
    if (productData.stock !== undefined) formData.append("stock", productData.stock);
    if (productData.tags) {
        // Backend expects comma-separated string
        const tagsString = Array.isArray(productData.tags)
            ? productData.tags.join(",")
            : productData.tags;
        formData.append("tags", tagsString);
    }

    // Append images
    if (productData.images && productData.images.length > 0) {
        // Nếu là FileList, convert sang array
        const imageFiles = Array.isArray(productData.images)
            ? productData.images
            : Array.from(productData.images);

        imageFiles.forEach((file) => {
            formData.append("images", file);
        });
    }

    // Append videos
    if (productData.videos && productData.videos.length > 0) {
        const videoFiles = Array.isArray(productData.videos)
            ? productData.videos
            : Array.from(productData.videos);

        videoFiles.forEach((file) => {
            formData.append("videos", file);
        });
    }

    const res = await api.post(`${BASE}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
};

/**
 * Cập nhật sản phẩm (Admin only)
 * @param {string} id - Product ID
 * @param {Object} updateData - Dữ liệu cập nhật
 */
export const updateProduct = async (id, updateData) => {
    // Nếu có images/videos mới, dùng FormData
    const hasFiles = (updateData.images && updateData.images.length > 0) ||
        (updateData.videos && updateData.videos.length > 0);

    if (hasFiles) {
        const formData = new FormData();

        // Append các field text
        Object.keys(updateData).forEach((key) => {
            if (key !== 'images' && key !== 'videos') {
                if (key === 'tags' && Array.isArray(updateData[key])) {
                    formData.append(key, updateData[key].join(","));
                } else if (updateData[key] !== undefined && updateData[key] !== null) {
                    formData.append(key, updateData[key]);
                }
            }
        });

        // Append new images
        if (updateData.images && updateData.images.length > 0) {
            const imageFiles = Array.isArray(updateData.images)
                ? updateData.images
                : Array.from(updateData.images);
            imageFiles.forEach((file) => {
                formData.append("images", file);
            });
        }

        // Append new videos
        if (updateData.videos && updateData.videos.length > 0) {
            const videoFiles = Array.isArray(updateData.videos)
                ? updateData.videos
                : Array.from(updateData.videos);
            videoFiles.forEach((file) => {
                formData.append("videos", file);
            });
        }

        const res = await api.put(`${BASE}/${id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return res.data;
    } else {
        // Chỉ update text fields
        const res = await api.put(`${BASE}/${id}`, updateData);
        return res.data;
    }
};

/**
 * Xóa sản phẩm (Admin only)
 */
export const deleteProduct = async (id) => {
    const res = await api.delete(`${BASE}/${id}`);
    return res.data;
};

/**
 * Xóa một ảnh cụ thể của sản phẩm (Admin only)
 * @param {string} productId - ID sản phẩm
 * @param {string} imageId - ID của ảnh cần xóa
 */
export const deleteProductImage = async (productId, imageId) => {
    const res = await api.delete(`${BASE}/${productId}/images/${imageId}`);
    return res.data;
};

/**
 * Xóa một video cụ thể của sản phẩm (Admin only)
 * @param {string} productId - ID sản phẩm
 * @param {string} videoId - ID của video cần xóa
 */
export const deleteProductVideo = async (productId, videoId) => {
    const res = await api.delete(`${BASE}/${productId}/videos/${videoId}`);
    return res.data;
};

/**
 * Đặt ảnh làm ảnh chính (Admin only)
 * @param {string} productId - ID sản phẩm
 * @param {string} imageId - ID của ảnh cần đặt làm primary
 */
export const setPrimaryImage = async (productId, imageId) => {
    const res = await api.put(`${BASE}/${productId}/images/${imageId}/primary`);
    return res.data;
};

/**
 * Sắp xếp lại thứ tự ảnh (Admin only)
 * @param {string} productId - ID sản phẩm
 * @param {Array} imageOrders - [{ imageId, order }, ...]
 */
export const reorderImages = async (productId, imageOrders) => {
    const res = await api.put(`${BASE}/${productId}/images/reorder`, { imageOrders });
    return res.data;
};

/**
 * Upload thêm ảnh cho sản phẩm đã tồn tại (Admin only)
 * @param {string} productId - ID sản phẩm
 * @param {File[]} images - Mảng file ảnh mới
 */
export const addProductImages = async (productId, images) => {
    const formData = new FormData();
    const imageFiles = Array.isArray(images) ? images : Array.from(images);
    imageFiles.forEach((file) => {
        formData.append("images", file);
    });

    const res = await api.put(`${BASE}/${productId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
};

/**
 * Upload thêm video cho sản phẩm đã tồn tại (Admin only)
 * @param {string} productId - ID sản phẩm
 * @param {File[]} videos - Mảng file video mới
 */
export const addProductVideos = async (productId, videos) => {
    const formData = new FormData();
    const videoFiles = Array.isArray(videos) ? videos : Array.from(videos);
    videoFiles.forEach((file) => {
        formData.append("videos", file);
    });

    const res = await api.put(`${BASE}/${productId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
};

// ============= HELPER FUNCTIONS =============

/**
 * Validate file trước khi upload
 * @param {File} file - File cần validate
 * @param {string} type - 'image' hoặc 'video'
 * @returns {Object} { valid: boolean, error: string }
 */
export const validateMediaFile = (file, type = 'image') => {
    const maxSize = type === 'image' ? 5 * 1024 * 1024 : 10 * 1024 * 1024; // 5MB cho ảnh, 10MB cho video
    const allowedTypes = type === 'image'
        ? ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
        : ['video/mp4', 'video/quicktime', 'video/x-msvideo'];

    if (file.size > maxSize) {
        return {
            valid: false,
            error: `File quá lớn. Tối đa ${maxSize / 1024 / 1024}MB`
        };
    }

    if (!allowedTypes.includes(file.type)) {
        return {
            valid: false,
            error: `Định dạng file không hợp lệ. Chỉ chấp nhận: ${allowedTypes.join(', ')}`
        };
    }

    return { valid: true, error: null };
};

/**
 * Validate nhiều files
 * @param {FileList|File[]} files - Danh sách files
 * @param {string} type - 'image' hoặc 'video'
 * @param {number} maxFiles - Số lượng file tối đa
 * @returns {Object} { valid: boolean, errors: string[] }
 */
export const validateMediaFiles = (files, type = 'image', maxFiles = 10) => {
    const fileArray = Array.isArray(files) ? files : Array.from(files);
    const errors = [];

    if (fileArray.length > maxFiles) {
        errors.push(`Chỉ được upload tối đa ${maxFiles} file`);
        return { valid: false, errors };
    }

    fileArray.forEach((file, index) => {
        const result = validateMediaFile(file, type);
        if (!result.valid) {
            errors.push(`File ${index + 1} (${file.name}): ${result.error}`);
        }
    });

    return {
        valid: errors.length === 0,
        errors
    };
};

/**
 * Tạo preview URL cho file (để hiển thị trước khi upload)
 * @param {File} file - File cần preview
 * @returns {string} URL để hiển thị
 */
export const createFilePreview = (file) => {
    return URL.createObjectURL(file);
};

/**
 * Giải phóng memory của preview URL
 * @param {string} url - URL cần revoke
 */
export const revokeFilePreview = (url) => {
    URL.revokeObjectURL(url);
};

/**
 * Format giá tiền VND
 * @param {number} price - Giá cần format
 * @returns {string} Giá đã format (VD: "150.000đ")
 */
export const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price);
};

/**
 * Tính % giảm giá
 * @param {number} price - Giá gốc
 * @param {number} discountPrice - Giá giảm
 * @returns {number} % giảm (VD: 20)
 */
export const calculateDiscountPercent = (price, discountPrice) => {
    if (!discountPrice || discountPrice >= price) return 0;
    return Math.round(((price - discountPrice) / price) * 100);
};

/**
 * Lấy ảnh primary của sản phẩm
 * @param {Object} product - Product object
 * @returns {string} URL của ảnh primary hoặc ảnh đầu tiên
 */
export const getPrimaryImage = (product) => {
    if (!product.images || product.images.length === 0) {
        return '/placeholder-flower.jpg'; // Placeholder image
    }

    const primaryImage = product.images.find(img => img.isPrimary);
    return primaryImage ? primaryImage.url : product.images[0].url;
};

/**
 * Sắp xếp images theo order
 * @param {Array} images - Mảng images
 * @returns {Array} Mảng đã sắp xếp
 */
export const sortImagesByOrder = (images) => {
    if (!images) return [];
    return [...images].sort((a, b) => a.order - b.order);
};