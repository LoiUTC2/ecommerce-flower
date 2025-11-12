"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { validateCategoryName, validateCategoryImage } from "../../services/categoryService"

const ICON_OPTIONS = ["tulip", "rose", "lily", "orchid", "sunflower", "daisy", "carnation", "other"]
const OCCASION_OPTIONS = ["birthday", "wedding", "anniversary", "funeral", "congratulation", "apology", "love", "other"]
const COLOR_OPTIONS = ["red", "white", "pink", "yellow", "purple", "orange", "blue", "mixed"]
const SEASON_OPTIONS = ["spring", "summer", "autumn", "winter", "all-year"]

const OCCASION_NAMES = {
    birthday: "Sinh nhật",
    wedding: "Đám cưới",
    anniversary: "Kỷ niệm",
    funeral: "Tang lễ",
    congratulation: "Chúc mừng",
    apology: "Xin lỗi",
    love: "Tình yêu",
    other: "Khác",
}

const COLOR_NAMES = {
    red: "Đỏ",
    white: "Trắng",
    pink: "Hồng",
    yellow: "Vàng",
    purple: "Tím",
    orange: "Cam",
    blue: "Xanh",
    mixed: "Nhiều màu",
}

const SEASON_NAMES = {
    spring: "Xuân",
    summer: "Hạ",
    autumn: "Thu",
    winter: "Đông",
    "all-year": "Quanh năm",
}

// Helper: Chuẩn hóa data từ backend về format của form
const normalizeInitialData = (data) => {
    if (!data) {
        return {
            name: "",
            description: "",
            icon: "other",
            displayOrder: 0,
            occasions: [],
            colors: [],
            season: [],
            seo: {
                metaTitle: "",
                metaDescription: "",
                metaKeywords: [],
            },
            image: null,
        }
    }

    return {
        name: data.name || "",
        description: data.description || "",
        icon: data.icon || "other",
        displayOrder: data.displayOrder || 0,
        // ✅ Lấy từ features nếu có, không thì dùng array rỗng
        occasions: data.features?.occasions || data.occasions || [],
        colors: data.features?.colors || data.colors || [],
        season: data.features?.season || data.season || [],
        seo: {
            metaTitle: data.seo?.metaTitle || "",
            metaDescription: data.seo?.metaDescription || "",
            metaKeywords: data.seo?.metaKeywords || [],
        },
        image: data.image || null,
    }
}

export default function CategoryForm({ initialData, onSubmit, isLoading }) {
    const [formData, setFormData] = useState(
        initialData || {
            name: "",
            description: "",
            icon: "other",
            displayOrder: 0,
            occasions: [],
            colors: [],
            season: [],
            seo: {
                metaTitle: "",
                metaDescription: "",
                metaKeywords: [],
            },
            image: null,
        },
    )

    const [imagePreview, setImagePreview] = useState(initialData?.image?.url || null)
    const [errors, setErrors] = useState({})
    const [touched, setTouched] = useState({})

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
        if (touched[name]) {
            validateField(name, value)
        }
    }

    const handleImageChange = (e) => {
        const file = e.target.files?.[0]
        if (file) {
            const validation = validateCategoryImage(file)
            if (!validation.valid) {
                setErrors((prev) => ({
                    ...prev,
                    image: validation.error,
                }))
                return
            }

            setFormData((prev) => ({
                ...prev,
                image: file,
            }))

            const reader = new FileReader()
            reader.onload = (e) => {
                setImagePreview(e.target.result)
            }
            reader.readAsDataURL(file)

            setErrors((prev) => ({
                ...prev,
                image: null,
            }))
        }
    }

    const handleMultiSelect = (field, option) => {
        setFormData((prev) => {
            const currentArray = prev[field] || [] // ✅ Fallback
            return {
                ...prev,
                [field]: currentArray.includes(option)
                    ? currentArray.filter(item => item !== option)
                    : [...currentArray, option],
            }
        })
    }

    const handleSeoChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            seo: {
                ...prev.seo,
                [field]: value,
            },
        }))
    }

    const validateField = (name, value) => {
        let error = null

        if (name === "name") {
            const validation = validateCategoryName(value)
            error = validation.valid ? null : validation.error
        } else if (name === "description" && value && value.length > 500) {
            error = "Mô tả không được vượt quá 500 ký tự"
        }

        setErrors((prev) => ({
            ...prev,
            [name]: error,
        }))
    }

    const handleBlur = (e) => {
        const { name, value } = e.target
        setTouched((prev) => ({
            ...prev,
            [name]: true,
        }))
        validateField(name, value)
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        // Validate required fields
        const nameValidation = validateCategoryName(formData.name)
        if (!nameValidation.valid) {
            setErrors((prev) => ({
                ...prev,
                name: nameValidation.error,
            }))
            return
        }

        onSubmit(formData)
    }

    return (
        <motion.form
            onSubmit={handleSubmit}
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            {/* Basic Info Section */}
            <div className="card-elevated">
                <h3 className="text-lg font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
                    Thông tin cơ bản
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>
                            Tên danh mục <span style={{ color: "var(--error)" }}>*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            placeholder="VD: Hoa hồng"
                            className="input-field"
                        />
                        {errors.name && touched.name && (
                            <p className="text-sm mt-1" style={{ color: "var(--error)" }}>
                                {errors.name}
                            </p>
                        )}
                    </div>

                    {/* Icon */}
                    <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>
                            Biểu tượng
                        </label>
                        <select name="icon" value={formData.icon} onChange={handleInputChange} className="input-field">
                            {ICON_OPTIONS.map((icon) => (
                                <option key={icon} value={icon}>
                                    {icon}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Description */}
                <div className="mt-4">
                    <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>
                        Mô tả
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        placeholder="Mô tả về danh mục này..."
                        rows="4"
                        className="input-field"
                    />
                    <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                        {(formData.description || "").length}/500
                    </p>
                    {errors.description && touched.description && (
                        <p className="text-sm mt-1" style={{ color: "var(--error)" }}>
                            {errors.description}
                        </p>
                    )}
                </div>

                {/* Display Order */}
                <div className="mt-4">
                    <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>
                        Thứ tự hiển thị
                    </label>
                    <input
                        type="number"
                        name="displayOrder"
                        value={formData.displayOrder}
                        onChange={handleInputChange}
                        min="0"
                        className="input-field"
                    />
                </div>
            </div>

            {/* Image Upload Section */}
            <div className="card-elevated">
                <h3 className="text-lg font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
                    Ảnh danh mục
                </h3>

                <div className="flex flex-col md:flex-row gap-6">
                    {/* Preview */}
                    <div className="flex-1">
                        <div
                            className="w-full aspect-video rounded-lg border-2 border-dashed flex items-center justify-center overflow-hidden"
                            style={{ borderColor: "var(--border-color)", backgroundColor: "var(--bg-secondary)" }}
                        >
                            {imagePreview ? (
                                <img src={imagePreview || "/placeholder.svg"} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-center">
                                    <p style={{ color: "var(--text-muted)" }}>Chưa có ảnh</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Upload */}
                    <div className="flex-1 flex flex-col justify-center">
                        <label className="block">
                            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                            <div
                                className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all hover:opacity-75"
                                style={{ borderColor: "var(--primary-light)", backgroundColor: "var(--bg-secondary)" }}
                            >
                                <p className="text-sm font-medium mb-1" style={{ color: "var(--text-primary)" }}>
                                    Chọn ảnh
                                </p>
                                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                                    JPG, PNG, WebP • Max 5MB
                                </p>
                            </div>
                        </label>
                        {errors.image && (
                            <p className="text-sm mt-2" style={{ color: "var(--error)" }}>
                                {errors.image}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="card-elevated">
                <h3 className="text-lg font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
                    Đặc điểm danh mục
                </h3>

                {/* Occasions */}
                <div className="mb-6">
                    <label className="block text-sm font-medium mb-3" style={{ color: "var(--text-secondary)" }}>
                        Dịp phù hợp
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {OCCASION_OPTIONS.map((occasion) => (
                            <motion.button
                                key={occasion}
                                type="button"
                                onClick={() => handleMultiSelect("occasions", occasion)}
                                className="p-3 rounded-lg text-sm font-medium transition-all text-center"
                                style={{
                                    backgroundColor: (formData.occasions || []).includes(occasion)
                                        ? "var(--primary-light)"
                                        : "var(--bg-secondary)",
                                    color: (formData.occasions || []).includes(occasion) ? "var(--primary-dark)" : "var(--text-secondary)",
                                    border: `1px solid ${(formData.occasions || []).includes(occasion) ? "var(--primary)" : "var(--border-color)"
                                        }`,
                                }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {OCCASION_NAMES[occasion]}
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* Colors */}
                <div className="mb-6">
                    <label className="block text-sm font-medium mb-3" style={{ color: "var(--text-secondary)" }}>
                        Màu sắc
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {COLOR_OPTIONS.map((color) => (
                            <motion.button
                                key={color}
                                type="button"
                                onClick={() => handleMultiSelect("colors", color)}
                                className="p-3 rounded-lg text-sm font-medium transition-all text-center"
                                style={{
                                    backgroundColor: (formData.colors || []).includes(color) ? "var(--accent-lavender)" : "var(--bg-secondary)",
                                    color: (formData.colors || []).includes(color) ? "var(--primary-dark)" : "var(--text-secondary)",
                                    border: `1px solid ${(formData.colors || []).includes(color) ? "var(--primary-light)" : "var(--border-color)"
                                        }`,
                                }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {COLOR_NAMES[color]}
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* Season */}
                <div>
                    <label className="block text-sm font-medium mb-3" style={{ color: "var(--text-secondary)" }}>
                        Mùa
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                        {SEASON_OPTIONS.map((season) => (
                            <motion.button
                                key={season}
                                type="button"
                                onClick={() => handleMultiSelect("season", season)}
                                className="p-3 rounded-lg text-sm font-medium transition-all text-center"
                                style={{
                                    backgroundColor: (formData.season || []).includes(season) ? "var(--accent-mint)" : "var(--bg-secondary)",
                                    color: (formData.season || []).includes(season) ? "var(--text-primary)" : "var(--text-secondary)",
                                    border: `1px solid ${(formData.season || []).includes(season) ? "var(--success)" : "var(--border-color)"}`,
                                }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {SEASON_NAMES[season]}
                            </motion.button>
                        ))}
                    </div>
                </div>
            </div>

            {/* SEO Section */}
            <div className="card-elevated">
                <h3 className="text-lg font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
                    SEO
                </h3>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>
                            Meta Title
                        </label>
                        <input
                            type="text"
                            value={formData.seo.metaTitle}
                            onChange={(e) => handleSeoChange("metaTitle", e.target.value)}
                            placeholder="Tiêu đề cho SEO..."
                            maxLength="60"
                            className="input-field"
                        />
                        <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                            {(formData.seo.metaTitle || "").length}/60
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>
                            Meta Description
                        </label>
                        <textarea
                            value={formData.seo.metaDescription}
                            onChange={(e) => handleSeoChange("metaDescription", e.target.value)}
                            placeholder="Mô tả cho SEO..."
                            maxLength="160"
                            rows="3"
                            className="input-field"
                        />
                        <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                            {(formData.seo.metaDescription || "").length}/160
                        </p>
                    </div>
                </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3">
                <motion.button
                    type="submit"
                    disabled={isLoading}
                    className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    {isLoading ? "Đang xử lý..." : "Lưu danh mục"}
                </motion.button>
            </div>
        </motion.form>
    )
}
