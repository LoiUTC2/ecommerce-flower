"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Upload, X, Star } from "lucide-react"
import {
    createProduct,
    updateProduct,
    validateMediaFiles,
    createFilePreview,
    revokeFilePreview,
    deleteProductImage,
    setPrimaryImage,
} from "../../services/productService"

export default function ProductForm({ product = null, onSuccess, categories = [] }) {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        category: "",
        price: "",
        discountPrice: "",
        stock: "",
        tags: "",
    })

    const [images, setImages] = useState([])
    const [videos, setVideos] = useState([])
    const [imagePreviews, setImagePreviews] = useState([])
    const [videoPreviews, setVideoPreviews] = useState([])
    const [existingImages, setExistingImages] = useState([])
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({})
    const [successMessage, setSuccessMessage] = useState("")

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name || "",
                description: product.description || "",
                category: product.category?._id || "",
                price: product.price || "",
                discountPrice: product.discountPrice || "",
                stock: product.stock || "",
                tags: product.tags?.join(", ") || "",
            })
            setExistingImages(product.images || [])
        }
    }, [product])

    useEffect(() => {
        return () => {
            imagePreviews.forEach((url) => revokeFilePreview(url))
            videoPreviews.forEach((url) => revokeFilePreview(url))
        }
    }, [imagePreviews, videoPreviews])

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: null }))
        }
    }

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files)
        const validation = validateMediaFiles(files, "image", 10)

        if (!validation.valid) {
            setErrors((prev) => ({ ...prev, images: validation.errors.join("; ") }))
            return
        }

        setErrors((prev) => ({ ...prev, images: null }))
        setImages(files)

        const previews = files.map((file) => createFilePreview(file))
        setImagePreviews(previews)
    }

    const handleVideoChange = (e) => {
        const files = Array.from(e.target.files)
        const validation = validateMediaFiles(files, "video", 3)

        if (!validation.valid) {
            setErrors((prev) => ({ ...prev, videos: validation.errors.join("; ") }))
            return
        }

        setErrors((prev) => ({ ...prev, videos: null }))
        setVideos(files)

        const previews = files.map((file) => createFilePreview(file))
        setVideoPreviews(previews)
    }

    const handleDeleteExistingImage = async (imageId) => {
        if (!product) return

        try {
            await deleteProductImage(product._id, imageId)
            setExistingImages((prev) => prev.filter((img) => img._id !== imageId))
            setSuccessMessage("Xóa ảnh thành công!")
            setTimeout(() => setSuccessMessage(""), 3000)
        } catch (error) {
            setErrors((prev) => ({ ...prev, general: error.message }))
        }
    }

    const handleSetPrimaryImage = async (imageId) => {
        if (!product) return

        try {
            await setPrimaryImage(product._id, imageId)
            setExistingImages((prev) =>
                prev.map((img) => ({
                    ...img,
                    isPrimary: img._id === imageId,
                })),
            )
        } catch (error) {
            setErrors((prev) => ({ ...prev, general: error.message }))
        }
    }

    const handleRemoveNewImage = (index) => {
        setImages((prev) => prev.filter((_, i) => i !== index))
        revokeFilePreview(imagePreviews[index])
        setImagePreviews((prev) => prev.filter((_, i) => i !== index))
    }

    const handleRemoveNewVideo = (index) => {
        setVideos((prev) => prev.filter((_, i) => i !== index))
        revokeFilePreview(videoPreviews[index])
        setVideoPreviews((prev) => prev.filter((_, i) => i !== index))
    }

    const validateForm = () => {
        const newErrors = {}

        if (!formData.name.trim()) newErrors.name = "Tên sản phẩm không được bỏ trống"
        if (!formData.description.trim()) newErrors.description = "Mô tả không được bỏ trống"
        if (!formData.price || formData.price <= 0) newErrors.price = "Giá phải lớn hơn 0"
        if (formData.discountPrice && formData.discountPrice >= formData.price) {
            newErrors.discountPrice = "Giá khuyến mãi phải nhỏ hơn giá gốc"
        }
        if (!product && images.length === 0) {
            newErrors.images = "Vui lòng chọn ít nhất 1 ảnh"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm()) return

        setLoading(true)
        try {
            const productData = {
                ...formData,
                images,
                videos,
            }

            if (product) {
                await updateProduct(product._id, productData)
                setSuccessMessage("Cập nhật sản phẩm thành công!")
            } else {
                await createProduct(productData)
                setSuccessMessage("Tạo sản phẩm thành công!")
                setFormData({
                    name: "",
                    description: "",
                    category: "",
                    price: "",
                    discountPrice: "",
                    stock: "",
                    tags: "",
                })
                setImages([])
                setVideos([])
                setImagePreviews([])
                setVideoPreviews([])
            }

            if (onSuccess) onSuccess()
            setTimeout(() => setSuccessMessage(""), 3000)
        } catch (error) {
            setErrors((prev) => ({
                ...prev,
                general: error.response?.data?.message || error.message,
            }))
        } finally {
            setLoading(false)
        }
    }

    return (
        <motion.form
            onSubmit={handleSubmit}
            className="card-elevated max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            {/* Success Message */}
            {successMessage && (
                <motion.div
                    className="mb-4 p-4 rounded-lg text-white"
                    style={{ backgroundColor: "var(--success)" }}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                >
                    {successMessage}
                </motion.div>
            )}

            {/* Error Message */}
            {errors.general && (
                <motion.div
                    className="mb-4 p-4 rounded-lg text-white"
                    style={{ backgroundColor: "var(--error)" }}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    {errors.general}
                </motion.div>
            )}

            <h2 className="text-3xl font-bold mb-8">{product ? "Cập nhật sản phẩm" : "Tạo sản phẩm mới"}</h2>

            {/* Two Column Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Name */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                    <label className="block font-medium mb-2" style={{ color: "var(--text-primary)" }}>
                        Tên sản phẩm <span style={{ color: "var(--error)" }}>*</span>
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`input-field ${errors.name ? "border-red-500" : ""}`}
                        placeholder="VD: Hoa hồng đỏ"
                    />
                    {errors.name && (
                        <p className="text-sm mt-1" style={{ color: "var(--error)" }}>
                            {errors.name}
                        </p>
                    )}
                </motion.div>

                {/* Category */}
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                    <label className="block font-medium mb-2" style={{ color: "var(--text-primary)" }}>
                        Danh mục
                    </label>
                    <select name="category" value={formData.category} onChange={handleInputChange} className="input-field">
                        <option value="">-- Chọn danh mục --</option>
                        {categories.map((cat) => (
                            <option key={cat._id} value={cat._id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </motion.div>
            </div>

            {/* Description */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <label className="block font-medium mb-2" style={{ color: "var(--text-primary)" }}>
                    Mô tả <span style={{ color: "var(--error)" }}>*</span>
                </label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="4"
                    className={`input-field ${errors.description ? "border-red-500" : ""}`}
                    placeholder="Mô tả chi tiết về sản phẩm..."
                />
                {errors.description && (
                    <p className="text-sm mt-1" style={{ color: "var(--error)" }}>
                        {errors.description}
                    </p>
                )}
            </motion.div>

            {/* Price Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
                {/* Price */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                    <label className="block font-medium mb-2" style={{ color: "var(--text-primary)" }}>
                        Giá gốc (VNĐ) <span style={{ color: "var(--error)" }}>*</span>
                    </label>
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        className={`input-field ${errors.price ? "border-red-500" : ""}`}
                        placeholder="150000"
                    />
                    {errors.price && (
                        <p className="text-sm mt-1" style={{ color: "var(--error)" }}>
                            {errors.price}
                        </p>
                    )}
                </motion.div>

                {/* Discount Price */}
                <motion.div initial={{ opacity: 0, x: 0 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                    <label className="block font-medium mb-2" style={{ color: "var(--text-primary)" }}>
                        Giá khuyến mãi (VNĐ)
                    </label>
                    <input
                        type="number"
                        name="discountPrice"
                        value={formData.discountPrice}
                        onChange={handleInputChange}
                        className={`input-field ${errors.discountPrice ? "border-red-500" : ""}`}
                        placeholder="120000"
                    />
                    {errors.discountPrice && (
                        <p className="text-sm mt-1" style={{ color: "var(--error)" }}>
                            {errors.discountPrice}
                        </p>
                    )}
                </motion.div>

                {/* Stock */}
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                    <label className="block font-medium mb-2" style={{ color: "var(--text-primary)" }}>
                        Tồn kho
                    </label>
                    <input
                        type="number"
                        name="stock"
                        value={formData.stock}
                        onChange={handleInputChange}
                        className="input-field"
                        placeholder="100"
                    />
                </motion.div>
            </div>

            {/* Tags */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <label className="block font-medium mb-2" style={{ color: "var(--text-primary)" }}>
                    Tags (phân cách bằng dấu phẩy)
                </label>
                <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="sinh nhật, tình yêu, hoa hồng"
                />
            </motion.div>

            {/* Existing Images */}
            {product && existingImages.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                    <label className="block font-medium mb-4 mt-6" style={{ color: "var(--text-primary)" }}>
                        Ảnh hiện có
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {existingImages.map((img, idx) => (
                            <motion.div
                                key={img._id}
                                className="relative group rounded-lg overflow-hidden"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.05 }}
                            >
                                <img src={img.url || "/placeholder.svg"} alt="" className="w-full h-32 object-cover" />
                                {img.isPrimary && (
                                    <div className="absolute top-2 left-2 rounded-full p-1" style={{ backgroundColor: "var(--primary)" }}>
                                        <Star size={14} className="text-white fill-current" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    {!img.isPrimary && (
                                        <button
                                            type="button"
                                            onClick={() => handleSetPrimaryImage(img._id)}
                                            className="px-2 py-1 rounded text-xs font-medium text-white"
                                            style={{ backgroundColor: "var(--primary)" }}
                                        >
                                            Chính
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteExistingImage(img._id)}
                                        className="px-2 py-1 rounded text-xs font-medium text-white"
                                        style={{ backgroundColor: "var(--error)" }}
                                    >
                                        Xóa
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Image Upload */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                <label className="block font-medium mb-2 mt-6" style={{ color: "var(--text-primary)" }}>
                    {product ? "Thêm ảnh mới" : "Hình ảnh"} <span style={{ color: "var(--error)" }}>*</span>
                </label>
                <div
                    className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all hover:border-[var(--primary)]"
                    style={{ borderColor: "var(--border-color)" }}
                >
                    <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        multiple
                        onChange={handleImageChange}
                        className="hidden"
                        id="image-input"
                    />
                    <label htmlFor="image-input" className="cursor-pointer flex flex-col items-center gap-2">
                        <Upload size={32} style={{ color: "var(--primary)" }} />
                        <span className="font-medium">Chọn ảnh hoặc kéo thả</span>
                        <span className="text-sm" style={{ color: "var(--text-muted)" }}>
                            JPG, PNG, WEBP. Tối đa 10 ảnh, 5MB/ảnh
                        </span>
                    </label>
                </div>
                {errors.images && (
                    <p className="text-sm mt-2" style={{ color: "var(--error)" }}>
                        {errors.images}
                    </p>
                )}

                {/* Image Previews */}
                {imagePreviews.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        {imagePreviews.map((url, index) => (
                            <motion.div
                                key={index}
                                className="relative rounded-lg overflow-hidden"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <img
                                    src={url || "/placeholder.svg"}
                                    alt={`Preview ${index + 1}`}
                                    className="w-full h-32 object-cover"
                                />
                                <motion.button
                                    type="button"
                                    onClick={() => handleRemoveNewImage(index)}
                                    className="absolute top-2 right-2 rounded-full p-1 text-white"
                                    style={{ backgroundColor: "var(--error)" }}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <X size={16} />
                                </motion.button>
                            </motion.div>
                        ))}
                    </div>
                )}
            </motion.div>

            {/* Video Upload */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                <label className="block font-medium mb-2 mt-6" style={{ color: "var(--text-primary)" }}>
                    {product ? "Thêm video mới" : "Video"}
                </label>
                <div
                    className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all hover:border-[var(--primary)]"
                    style={{ borderColor: "var(--border-color)" }}
                >
                    <input
                        type="file"
                        accept="video/mp4,video/quicktime,video/x-msvideo"
                        multiple
                        onChange={handleVideoChange}
                        className="hidden"
                        id="video-input"
                    />
                    <label htmlFor="video-input" className="cursor-pointer flex flex-col items-center gap-2">
                        <Upload size={32} style={{ color: "var(--primary)" }} />
                        <span className="font-medium">Chọn video hoặc kéo thả</span>
                        <span className="text-sm" style={{ color: "var(--text-muted)" }}>
                            MP4, MOV, AVI. Tối đa 3 video, 10MB/video
                        </span>
                    </label>
                </div>
                {errors.videos && (
                    <p className="text-sm mt-2" style={{ color: "var(--error)" }}>
                        {errors.videos}
                    </p>
                )}

                {/* Video Previews */}
                {videoPreviews.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        {videoPreviews.map((url, index) => (
                            <motion.div
                                key={index}
                                className="relative rounded-lg overflow-hidden"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <video src={url} controls className="w-full h-48 object-cover rounded-lg" />
                                <motion.button
                                    type="button"
                                    onClick={() => handleRemoveNewVideo(index)}
                                    className="absolute top-2 right-2 rounded-full p-1 text-white"
                                    style={{ backgroundColor: "var(--error)" }}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <X size={16} />
                                </motion.button>
                            </motion.div>
                        ))}
                    </div>
                )}
            </motion.div>

            {/* Submit Buttons */}
            <motion.div
                className="flex gap-4 mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
            >
                <motion.button
                    type="submit"
                    disabled={loading}
                    className="flex-1 btn-primary py-3 font-semibold"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    {loading ? "Đang xử lý..." : product ? "Cập nhật" : "Tạo sản phẩm"}
                </motion.button>
                <motion.button
                    type="button"
                    onClick={() => window.history.back()}
                    className="px-6 py-3 btn-secondary font-semibold"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    Hủy
                </motion.button>
            </motion.div>
        </motion.form>
    )
}
