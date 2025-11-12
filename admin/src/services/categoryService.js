// src/services/categoryService.js
import api from "../utils/api";

const BASE = "/api/categories";

/**
 * Lấy danh sách tất cả categories với filter và pagination
 * @param {Object} params - Query parameters
 * @param {boolean} params.isActive - Lọc theo trạng thái (true/false)
 * @param {string} params.search - Từ khóa tìm kiếm
 * @param {string} params.sortBy - Sắp xếp theo (displayOrder, name, createdAt, stats.productCount)
 * @param {string} params.order - asc hoặc desc
 * @param {number} params.page - Trang hiện tại (default: 1)
 * @param {number} params.limit - Số lượng/trang (default: 50)
 */
export const getCategories = async (params = {}) => {
    const res = await api.get(`${BASE}`, { params });
    return res.data; // { success, data: { categories, pagination } }
};

/**
 * Lấy chi tiết category theo slug
 * @param {string} slug - Slug của category
 */
export const getCategoryBySlug = async (slug) => {
    const res = await api.get(`${BASE}/${slug}`);
    return res.data; // { success, data: { category, products } }
};

/**
 * Lấy danh sách categories phổ biến (cho homepage)
 * @param {number} limit - Số lượng categories (default: 5)
 */
export const getPopularCategories = async (limit = 5) => {
    const res = await api.get(`${BASE}/popular`, { params: { limit } });
    return res.data; // { success, data: categories }
};

/**
 * Lấy tất cả categories đang active (cho menu, filter)
 * Không phân trang, sắp xếp theo displayOrder
 */
export const getActiveCategories = async () => {
    const res = await api.get(`${BASE}`, {
        params: {
            isActive: true,
            sortBy: 'displayOrder',
            order: 'asc',
            limit: 100 // Lấy nhiều để đảm bảo đủ cho menu
        }
    });
    return res.data;
};

/**
 * Tạo category mới (Admin only)
 * @param {Object} categoryData - Thông tin category
 * @param {string} categoryData.name - Tên category (required)
 * @param {string} categoryData.description - Mô tả
 * @param {string} categoryData.icon - Icon (tulip, rose, lily...)
 * @param {number} categoryData.displayOrder - Thứ tự hiển thị
 * @param {Array<string>} categoryData.occasions - Các dịp phù hợp
 * @param {Array<string>} categoryData.colors - Các màu sắc
 * @param {Array<string>} categoryData.season - Các mùa phù hợp
 * @param {Object} categoryData.seo - SEO metadata
 * @param {File} categoryData.image - File ảnh
 */
export const createCategory = async (categoryData) => {
    const formData = new FormData();

    // Append các field text
    formData.append("name", categoryData.name);

    if (categoryData.description) {
        formData.append("description", categoryData.description);
    }

    if (categoryData.icon) {
        formData.append("icon", categoryData.icon);
    }

    if (categoryData.displayOrder !== undefined) {
        formData.append("displayOrder", categoryData.displayOrder);
    }

    // Append arrays as JSON strings
    if (categoryData.occasions && categoryData.occasions.length > 0) {
        formData.append("occasions", JSON.stringify(categoryData.occasions));
    }

    if (categoryData.colors && categoryData.colors.length > 0) {
        formData.append("colors", JSON.stringify(categoryData.colors));
    }

    if (categoryData.season && categoryData.season.length > 0) {
        formData.append("season", JSON.stringify(categoryData.season));
    }

    // Append SEO data
    if (categoryData.seo) {
        formData.append("seo", JSON.stringify(categoryData.seo));
    }

    // Append image file
    if (categoryData.image) {
        formData.append("image", categoryData.image);
    }

    const res = await api.post(`${BASE}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
};

/**
 * Cập nhật category (Admin only)
 * @param {string} id - Category ID
 * @param {Object} updateData - Dữ liệu cập nhật (tương tự createCategory)
 */
export const updateCategory = async (id, updateData) => {
    // Nếu có image mới, dùng FormData
    const hasImage = updateData.image instanceof File;

    if (hasImage) {
        const formData = new FormData();

        // Append các field
        Object.keys(updateData).forEach((key) => {
            if (key === 'image') {
                formData.append("image", updateData.image);
            } else if (['occasions', 'colors', 'season', 'seo'].includes(key)) {
                // Convert arrays/objects to JSON string
                formData.append(key, JSON.stringify(updateData[key]));
            } else if (updateData[key] !== undefined && updateData[key] !== null) {
                formData.append(key, updateData[key]);
            }
        });

        const res = await api.put(`${BASE}/${id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return res.data;
    } else {
        // Không có image mới, gửi JSON
        const payload = { ...updateData };

        // Đảm bảo arrays/objects được stringify nếu cần
        // (Tuy nhiên nếu backend nhận JSON thì không cần)

        const res = await api.put(`${BASE}/${id}`, payload);
        return res.data;
    }
};

/**
 * Xóa category (Admin only)
 * @param {string} id - Category ID
 * @param {Object} options - Tùy chọn xóa
 * @param {boolean} options.forceDelete - Xóa bắt buộc (set product.category = null)
 * @param {string} options.moveTo - ID của category đích (chuyển products sang category khác)
 */
export const deleteCategory = async (id, options = {}) => {
    const params = {};
    if (options.forceDelete) params.forceDelete = true;
    if (options.moveTo) params.moveTo = options.moveTo;

    const res = await api.delete(`${BASE}/${id}`, { params });
    return res.data;
};

/**
 * Cập nhật thứ tự hiển thị của nhiều categories (Admin only)
 * @param {Array<Object>} orders - [{ id, displayOrder }, ...]
 */
export const updateDisplayOrder = async (orders) => {
    const res = await api.patch(`${BASE}/update-order`, { orders });
    return res.data;
};

/**
 * Đồng bộ số lượng products trong tất cả categories (Admin only)
 * Hữu ích khi có sự không khớp dữ liệu
 */
export const syncProductCounts = async () => {
    const res = await api.post(`${BASE}/sync-counts`);
    return res.data;
};

// ============= HELPER FUNCTIONS =============

/**
 * Validate category name
 * @param {string} name - Tên category
 * @returns {Object} { valid: boolean, error: string }
 */
export const validateCategoryName = (name) => {
    if (!name || name.trim().length === 0) {
        return { valid: false, error: "Tên danh mục không được để trống" };
    }

    if (name.length > 100) {
        return { valid: false, error: "Tên danh mục không được vượt quá 100 ký tự" };
    }

    return { valid: true, error: null };
};

/**
 * Validate category description
 * @param {string} description - Mô tả category
 * @returns {Object} { valid: boolean, error: string }
 */
export const validateCategoryDescription = (description) => {
    if (description && description.length > 500) {
        return {
            valid: false,
            error: "Mô tả không được vượt quá 500 ký tự"
        };
    }

    return { valid: true, error: null };
};

/**
 * Validate image file
 * @param {File} file - File ảnh
 * @returns {Object} { valid: boolean, error: string }
 */
export const validateCategoryImage = (file) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    if (file.size > maxSize) {
        return {
            valid: false,
            error: `Ảnh quá lớn. Tối đa 5MB`
        };
    }

    if (!allowedTypes.includes(file.type)) {
        return {
            valid: false,
            error: `Định dạng ảnh không hợp lệ. Chỉ chấp nhận: JPG, PNG, WebP`
        };
    }

    return { valid: true, error: null };
};

/**
 * Validate toàn bộ category data trước khi submit
 * @param {Object} categoryData - Data cần validate
 * @returns {Object} { valid: boolean, errors: Array<string> }
 */
export const validateCategoryData = (categoryData) => {
    const errors = [];

    // Validate name
    const nameValidation = validateCategoryName(categoryData.name);
    if (!nameValidation.valid) {
        errors.push(nameValidation.error);
    }

    // Validate description
    if (categoryData.description) {
        const descValidation = validateCategoryDescription(categoryData.description);
        if (!descValidation.valid) {
            errors.push(descValidation.error);
        }
    }

    // Validate image
    if (categoryData.image instanceof File) {
        const imageValidation = validateCategoryImage(categoryData.image);
        if (!imageValidation.valid) {
            errors.push(imageValidation.error);
        }
    }

    // Validate displayOrder
    if (categoryData.displayOrder !== undefined && categoryData.displayOrder < 0) {
        errors.push("Thứ tự hiển thị không được âm");
    }

    return {
        valid: errors.length === 0,
        errors
    };
};

/**
 * Tạo preview URL cho ảnh (để hiển thị trước khi upload)
 * @param {File} file - File ảnh
 * @returns {string} URL để hiển thị
 */
export const createImagePreview = (file) => {
    return URL.createObjectURL(file);
};

/**
 * Giải phóng memory của preview URL
 * @param {string} url - URL cần revoke
 */
export const revokeImagePreview = (url) => {
    URL.revokeObjectURL(url);
};

/**
 * Lấy icon name cho category (dùng cho UI)
 * @param {string} iconType - Icon type từ backend
 * @returns {string} Icon class hoặc emoji
 */
export const getCategoryIcon = (iconType) => {
    const iconMap = {
        tulip: '🌷',
        rose: '🌹',
        lily: '🌺',
        orchid: '🌸',
        sunflower: '🌻',
        daisy: '🌼',
        carnation: '💐',
        other: '🌿'
    };

    return iconMap[iconType] || iconMap.other;
};

/**
 * Format tên dịp (occasion) thành tiếng Việt
 * @param {string} occasion - Occasion key
 * @returns {string} Tên tiếng Việt
 */
export const formatOccasionName = (occasion) => {
    const occasionNames = {
        birthday: 'Sinh nhật',
        wedding: 'Đám cưới',
        anniversary: 'Kỷ niệm',
        funeral: 'Tang lễ',
        congratulation: 'Chúc mừng',
        apology: 'Xin lỗi',
        love: 'Tình yêu',
        other: 'Khác'
    };

    return occasionNames[occasion] || occasion;
};

/**
 * Format tên màu thành tiếng Việt
 * @param {string} color - Color key
 * @returns {string} Tên tiếng Việt
 */
export const formatColorName = (color) => {
    const colorNames = {
        red: 'Đỏ',
        white: 'Trắng',
        pink: 'Hồng',
        yellow: 'Vàng',
        purple: 'Tím',
        orange: 'Cam',
        blue: 'Xanh',
        mixed: 'Nhiều màu'
    };

    return colorNames[color] || color;
};

/**
 * Format tên mùa thành tiếng Việt
 * @param {string} season - Season key
 * @returns {string} Tên tiếng Việt
 */
export const formatSeasonName = (season) => {
    const seasonNames = {
        spring: 'Xuân',
        summer: 'Hạ',
        autumn: 'Thu',
        winter: 'Đông',
        'all-year': 'Quanh năm'
    };

    return seasonNames[season] || season;
};

/**
 * Lấy URL ảnh category (với fallback)
 * @param {Object} category - Category object
 * @returns {string} URL ảnh
 */
export const getCategoryImageUrl = (category) => {
    if (category.image?.url) {
        return category.image.url;
    }

    // Fallback placeholder theo icon
    return `/placeholder-${category.icon || 'flower'}.jpg`;
};

/**
 * Sort categories theo displayOrder
 * @param {Array} categories - Mảng categories
 * @returns {Array} Mảng đã sắp xếp
 */
export const sortCategoriesByOrder = (categories) => {
    if (!categories) return [];
    return [...categories].sort((a, b) => {
        // Sort by displayOrder first, then by name
        if (a.displayOrder !== b.displayOrder) {
            return a.displayOrder - b.displayOrder;
        }
        return a.name.localeCompare(b.name);
    });
};

/**
 * Filter categories theo features
 * @param {Array} categories - Mảng categories
 * @param {Object} filters - Filters object
 * @param {Array<string>} filters.occasions - Filter theo dịp
 * @param {Array<string>} filters.colors - Filter theo màu
 * @param {Array<string>} filters.season - Filter theo mùa
 * @returns {Array} Mảng đã filter
 */
export const filterCategoriesByFeatures = (categories, filters) => {
    if (!categories) return [];

    return categories.filter(category => {
        // Filter by occasions
        if (filters.occasions && filters.occasions.length > 0) {
            const hasOccasion = filters.occasions.some(occ =>
                category.features?.occasions?.includes(occ)
            );
            if (!hasOccasion) return false;
        }

        // Filter by colors
        if (filters.colors && filters.colors.length > 0) {
            const hasColor = filters.colors.some(color =>
                category.features?.colors?.includes(color)
            );
            if (!hasColor) return false;
        }

        // Filter by season
        if (filters.season && filters.season.length > 0) {
            const hasSeason = filters.season.some(s =>
                category.features?.season?.includes(s)
            );
            if (!hasSeason) return false;
        }

        return true;
    });
};

/**
 * Tạo breadcrumb cho category page
 * @param {Object} category - Category object
 * @returns {Array} Breadcrumb items
 */
export const createCategoryBreadcrumb = (category) => {
    return [
        { label: 'Trang chủ', path: '/' },
        { label: 'Danh mục', path: '/categories' },
        { label: category.name, path: `/categories/${category.slug}` }
    ];
};

/**
 * Generate SEO meta tags cho category
 * @param {Object} category - Category object
 * @returns {Object} Meta tags
 */
export const generateCategorySEO = (category) => {
    const title = category.seo?.metaTitle ||
        `${category.name} - Shop Hoa Tươi`;

    const description = category.seo?.metaDescription ||
        category.description ||
        `Khám phá bộ sưu tập ${category.name} đẹp và tươi mới tại shop hoa của chúng tôi`;

    const keywords = category.seo?.metaKeywords ||
        [category.name, 'hoa tươi', 'shop hoa'];

    return {
        title,
        description,
        keywords: Array.isArray(keywords) ? keywords.join(', ') : keywords,
        image: getCategoryImageUrl(category)
    };
};