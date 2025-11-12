"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Upload, X, Star, AlertCircle, Check, Loader } from "lucide-react"
import {
    getProductBySlug,
    updateProduct,
    validateMediaFiles,
    createFilePreview,
    revokeFilePreview,
    deleteProductImage,
    setPrimaryImage,
} from "../../services/productService"
import { getActiveCategories } from "../../services/categoryService"

export default function ProductEditPage() {
    const { slug } = useParams()
    const navigate = useNavigate()

    const [product, setProduct] = useState(null)
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(false)
    const [loadingData, setLoadingData] = useState(true)
    const [successMessage, setSuccessMessage] = useState("")
    const [generalError, setGeneralError] = useState("")

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
    const [errors, setErrors] = useState({})

    // Fetch product and categories
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoadingData(true)
                const [productRes, categoriesRes] = await Promise.all([getProductBySlug(slug), getActiveCategories()])

                if (productRes.data) {
                    const prod = productRes.data
                    setProduct(prod)
                    setFormData({
                        name: prod.name || "",
                        description: prod.description || "",
                        category: prod.category?._id || "",
                        price: prod.price || "",
                        discountPrice: prod.discountPrice || "",
                        stock: prod.stock || "",
                        tags: prod.tags?.join(", ") || "",
                    })
                    setExistingImages(prod.images || [])
                }

                setCategories(categoriesRes.data.categories || [])
            } catch (error) {
                console.error("Error fetching data:", error)
                setGeneralError("Không thể tải dữ liệu sản phẩm. Vui lòng thử lại.")
            } finally {
                setLoadingData(false)
            }
        }

        fetchData()
    }, [slug])

    // Cleanup previews on unmount
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
        const files = Array.from(e.target.files || [])
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
        const files = Array.from(e.target.files || [])
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
            setGeneralError(error.response?.data?.message || "Lỗi khi xóa ảnh")
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
            setGeneralError(error.response?.data?.message || "Lỗi khi cập nhật ảnh chính")
        }
    }

    const handleRemoveImage = (index) => {
        setImages((prev) => prev.filter((_, i) => i !== index))
        revokeFilePreview(imagePreviews[index])
        setImagePreviews((prev) => prev.filter((_, i) => i !== index))
    }

    const handleRemoveVideo = (index) => {
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

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm()) return

        setLoading(true)
        setGeneralError("")
        try {
            const productData = {
                ...formData,
            }

            if (images.length > 0) productData.images = images
            if (videos.length > 0) productData.videos = videos

            await updateProduct(product._id, productData)
            setSuccessMessage("Cập nhật sản phẩm thành công!")
            setImages([])
            setVideos([])
            setImagePreviews([])
            setVideoPreviews([])

            setTimeout(() => {
                navigate(`/products/${slug}`)
            }, 1500)
        } catch (error) {
            setGeneralError(error.response?.data?.message || error.message || "Lỗi khi cập nhật sản phẩm")
        } finally {
            setLoading(false)
        }
    }

    if (loadingData) {
        return (
            <div className="min-h-screen flex items-center justify-center py-8 px-4">
                <motion.div className="flex flex-col items-center gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    >
                        <Loader size={48} style={{ color: "var(--primary)" }} />
                    </motion.div>
                    <p style={{ color: "var(--text-muted)" }}>Đang tải sản phẩm...</p>
                </motion.div>
            </div>
        )
    }

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center py-8 px-4">
                <motion.div
                    className="card-elevated max-w-md text-center py-12"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <AlertCircle size={48} style={{ color: "var(--error)", margin: "0 auto 16px" }} />
                    <p className="text-lg mb-6" style={{ color: "var(--text-primary)" }}>
                        {generalError || "Không tìm thấy sản phẩm"}
                    </p>
                    <motion.button
                        onClick={() => navigate("/products")}
                        className="btn-primary px-6 py-2 rounded-lg"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Quay Lại
                    </motion.button>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="min-h-screen py-8 px-4 md:px-8">
            <motion.div
                className="max-w-4xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                {/* Header */}
                <div className="mb-8">
                    <motion.h1
                        className="text-3xl md:text-4xl font-bold mb-2"
                        style={{ color: "var(--text-primary)" }}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        Cập Nhật Sản Phẩm
                    </motion.h1>
                    <motion.p
                        className="text-lg"
                        style={{ color: "var(--text-muted)" }}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        {formData.name}
                    </motion.p>
                </div>

                {/* Messages */}
                {successMessage && (
                    <motion.div
                        className="mb-6 p-4 rounded-lg flex items-center gap-3 text-white"
                        style={{ backgroundColor: "var(--success)" }}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <Check size={20} />
                        {successMessage}
                    </motion.div>
                )}

                {generalError && (
                    <motion.div
                        className="mb-6 p-4 rounded-lg flex items-center gap-3 text-white"
                        style={{ backgroundColor: "var(--error)" }}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <AlertCircle size={20} />
                        {generalError}
                    </motion.div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="card-elevated">
                    {/* Basic Info Section */}
                    <motion.div
                        className="mb-8 pb-8 border-b"
                        style={{ borderColor: "var(--border-color)" }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <h2 className="text-xl font-semibold mb-6" style={{ color: "var(--text-primary)" }}>
                            Thông Tin Cơ Bản
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Name */}
                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                                <label className="block font-medium mb-2" style={{ color: "var(--text-primary)" }}>
                                    Tên sản phẩm <span style={{ color: "var(--error)" }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className={`input-field w-full ${errors.name ? "border-red-500" : ""}`}
                                    placeholder="VD: Hoa hồng đỏ Valentin"
                                />
                                {errors.name && (
                                    <p className="text-sm mt-1" style={{ color: "var(--error)" }}>
                                        {errors.name}
                                    </p>
                                )}
                            </motion.div>

                            {/* Category */}
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                                <label className="block font-medium mb-2" style={{ color: "var(--text-primary)" }}>
                                    Danh mục <span style={{ color: "var(--error)" }}>*</span>
                                </label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className="input-field w-full"
                                >
                                    <option value="">-- Chọn danh mục --</option>
                                    {Array.isArray(categories) && categories.map((cat) => (
                                        <option key={cat._id} value={cat._id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </motion.div>
                        </div>

                        {/* Description */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="mt-6"
                        >
                            <label className="block font-medium mb-2" style={{ color: "var(--text-primary)" }}>
                                Mô tả chi tiết <span style={{ color: "var(--error)" }}>*</span>
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows="5"
                                className={`input-field w-full ${errors.description ? "border-red-500" : ""}`}
                                placeholder="Mô tả chi tiết về loại hoa, chất lượng, cách chăm sóc..."
                            />
                            {errors.description && (
                                <p className="text-sm mt-1" style={{ color: "var(--error)" }}>
                                    {errors.description}
                                </p>
                            )}
                        </motion.div>
                    </motion.div>

                    {/* Pricing Section */}
                    <motion.div
                        className="mb-8 pb-8 border-b"
                        style={{ borderColor: "var(--border-color)" }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h2 className="text-xl font-semibold mb-6" style={{ color: "var(--text-primary)" }}>
                            Giá & Tồn Kho
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                                    className={`input-field w-full ${errors.price ? "border-red-500" : ""}`}
                                    placeholder="150000"
                                    step="1000"
                                    min="0"
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
                                    className={`input-field w-full ${errors.discountPrice ? "border-red-500" : ""}`}
                                    placeholder="120000"
                                    step="1000"
                                    min="0"
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
                                    className="input-field w-full"
                                    placeholder="100"
                                    min="0"
                                />
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Tags Section */}
                    <motion.div
                        className="mb-8 pb-8 border-b"
                        style={{ borderColor: "var(--border-color)" }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <label className="block font-medium mb-2" style={{ color: "var(--text-primary)" }}>
                            Tags (phân cách bằng dấu phẩy)
                        </label>
                        <input
                            type="text"
                            name="tags"
                            value={formData.tags}
                            onChange={handleInputChange}
                            className="input-field w-full"
                            placeholder="sinh nhật, tình yêu, hoa hồng, tươi"
                        />
                        <p className="text-sm mt-2" style={{ color: "var(--text-muted)" }}>
                            Nhập các tags để giúp khách hàng tìm kiếm sản phẩm dễ hơn
                        </p>
                    </motion.div>

                    {/* Existing Images Section */}
                    {existingImages.length > 0 && (
                        <motion.div
                            className="mb-8 pb-8 border-b"
                            style={{ borderColor: "var(--border-color)" }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <h2 className="text-xl font-semibold mb-6" style={{ color: "var(--text-primary)" }}>
                                Ảnh Hiện Có
                            </h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {existingImages.map((img, idx) => (
                                    <motion.div
                                        key={img._id}
                                        className="relative group rounded-lg overflow-hidden"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: idx * 0.05 }}
                                        whileHover={{ scale: 1.05 }}
                                    >
                                        <img
                                            src={img.url || "/placeholder.svg"}
                                            alt="Product"
                                            className="w-full h-24 md:h-28 object-cover"
                                        />
                                        {img.isPrimary && (
                                            <motion.div
                                                className="absolute top-2 left-2 rounded-full p-1"
                                                style={{ backgroundColor: "var(--primary)" }}
                                            >
                                                <Star size={14} className="text-white fill-current" />
                                            </motion.div>
                                        )}
                                        <motion.div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 flex-wrap p-2">
                                            {!img.isPrimary && (
                                                <motion.button
                                                    type="button"
                                                    onClick={() => handleSetPrimaryImage(img._id)}
                                                    className="px-2 py-1 rounded text-xs font-medium text-white whitespace-nowrap"
                                                    style={{ backgroundColor: "var(--primary)" }}
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    Chính
                                                </motion.button>
                                            )}
                                            <motion.button
                                                type="button"
                                                onClick={() => handleDeleteExistingImage(img._id)}
                                                className="px-2 py-1 rounded text-xs font-medium text-white whitespace-nowrap"
                                                style={{ backgroundColor: "var(--error)" }}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                Xóa
                                            </motion.button>
                                        </motion.div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Add Images Section */}
                    <motion.div
                        className="mb-8 pb-8 border-b"
                        style={{ borderColor: "var(--border-color)" }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <h2 className="text-xl font-semibold mb-6" style={{ color: "var(--text-primary)" }}>
                            Thêm Ảnh Mới
                        </h2>

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
                                <Upload size={40} style={{ color: "var(--primary)" }} />
                                <span className="font-semibold text-lg">Chọn ảnh hoặc kéo thả</span>
                                <span className="text-sm" style={{ color: "var(--text-muted)" }}>
                                    JPG, PNG, WEBP. Tối đa 10 ảnh, 5MB/ảnh
                                </span>
                            </label>
                        </div>

                        {errors.images && (
                            <p className="text-sm mt-3" style={{ color: "var(--error)" }}>
                                {errors.images}
                            </p>
                        )}

                        {/* New Image Previews */}
                        {imagePreviews.length > 0 && (
                            <motion.div
                                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-6"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                {imagePreviews.map((url, index) => (
                                    <motion.div
                                        key={index}
                                        className="relative rounded-lg overflow-hidden group"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: index * 0.05 }}
                                        whileHover={{ scale: 1.05 }}
                                    >
                                        <img
                                            src={url || "/placeholder.svg"}
                                            alt={`New ${index + 1}`}
                                            className="w-full h-24 md:h-28 object-cover"
                                        />
                                        <motion.button
                                            type="button"
                                            onClick={() => handleRemoveImage(index)}
                                            className="absolute top-2 right-2 rounded-full p-1.5 text-white"
                                            style={{ backgroundColor: "var(--error)" }}
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <X size={16} />
                                        </motion.button>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </motion.div>

                    {/* Videos Section */}
                    <motion.div
                        className="mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                    >
                        <h2 className="text-xl font-semibold mb-6" style={{ color: "var(--text-primary)" }}>
                            Thêm Video (Tùy Chọn)
                        </h2>

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
                                <Upload size={40} style={{ color: "var(--primary)" }} />
                                <span className="font-semibold text-lg">Chọn video hoặc kéo thả</span>
                                <span className="text-sm" style={{ color: "var(--text-muted)" }}>
                                    MP4, MOV, AVI. Tối đa 3 video, 10MB/video
                                </span>
                            </label>
                        </div>

                        {errors.videos && (
                            <p className="text-sm mt-3" style={{ color: "var(--error)" }}>
                                {errors.videos}
                            </p>
                        )}

                        {/* Video Previews */}
                        {videoPreviews.length > 0 && (
                            <motion.div
                                className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                {videoPreviews.map((url, index) => (
                                    <motion.div
                                        key={index}
                                        className="relative rounded-lg overflow-hidden"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <video src={url} controls className="w-full h-40 md:h-48 object-cover rounded-lg" />
                                        <motion.button
                                            type="button"
                                            onClick={() => handleRemoveVideo(index)}
                                            className="absolute top-2 right-2 rounded-full p-1.5 text-white"
                                            style={{ backgroundColor: "var(--error)" }}
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <X size={16} />
                                        </motion.button>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </motion.div>

                    {/* Submit Buttons */}
                    <motion.div
                        className="flex flex-col sm:flex-row gap-4 pt-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                    >
                        <motion.button
                            type="submit"
                            disabled={loading}
                            className="flex-1 btn-primary py-3 font-semibold text-lg rounded-lg transition-all"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {loading ? "Đang xử lý..." : "Cập Nhật Sản Phẩm"}
                        </motion.button>
                        <motion.button
                            type="button"
                            onClick={() => navigate("/products")}
                            className="px-6 py-3 btn-secondary font-semibold text-lg rounded-lg"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Hủy
                        </motion.button>
                    </motion.div>
                </form>
            </motion.div>
        </div>
    )
}
