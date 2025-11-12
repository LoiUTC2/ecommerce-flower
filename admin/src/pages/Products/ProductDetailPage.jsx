"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Edit, Trash2, DollarSign, Tag } from "lucide-react"
import { getProductBySlug, deleteProduct, formatPrice, calculateDiscountPercent } from "../../services/productService"
import ImageGallery from "../../components/product/ImageGallery"

export default function ProductDetailPage() {
    const { slug } = useParams()
    const navigate = useNavigate()
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        fetchProduct()
    }, [slug])

    const fetchProduct = async () => {
        try {
            setLoading(true)
            setError(null)
            const response = await getProductBySlug(slug)

            if (response.success) {
                setProduct(response.data)
            } else {
                setError("Không thể tải sản phẩm")
            }
        } catch (err) {
            setError(err.message || "Lỗi tải sản phẩm")
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!window.confirm("Bạn chắc chắn muốn xóa sản phẩm này?")) return

        try {
            await deleteProduct(product._id)
            navigate("/products")
        } catch (error) {
            alert("Lỗi xóa sản phẩm: " + error.message)
        }
    }

    const handleEdit = () => {
        navigate(`/products/edit/${product.slug}`)
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <motion.div className="shimmer-pulse" style={{ color: "var(--primary)" }}>
                    Đang tải...
                </motion.div>
            </div>
        )
    }

    if (error || !product) {
        return (
            <motion.div className="card-elevated text-center py-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <p style={{ color: "var(--error)" }}>{error || "Không tìm thấy sản phẩm"}</p>
                <motion.button
                    onClick={() => navigate("/products")}
                    className="mt-4 btn-primary"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Quay lại
                </motion.button>
            </motion.div>
        )
    }

    const discountPercent = calculateDiscountPercent(product.price, product.discountPrice)

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
        >
            {/* Header */}
            <motion.div
                className="flex items-center justify-between"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
            >
                <button
                    onClick={() => navigate("/products")}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg transition"
                    style={{ backgroundColor: "var(--bg-secondary)" }}
                >
                    <ArrowLeft size={20} />
                    Quay lại
                </button>

                <div className="flex gap-3">
                    <motion.button
                        onClick={handleEdit}
                        className="btn-primary inline-flex items-center gap-2"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Edit size={18} />
                        Chỉnh sửa
                    </motion.button>
                    <motion.button
                        onClick={handleDelete}
                        className="px-6 py-2 rounded-lg text-white font-medium inline-flex items-center gap-2"
                        style={{ backgroundColor: "var(--error)" }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Trash2 size={18} />
                        Xóa
                    </motion.button>
                </div>
            </motion.div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Gallery */}
                <motion.div
                    className="lg:col-span-2 card-elevated"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <ImageGallery images={product.images || []} />
                </motion.div>

                {/* Product Info */}
                <motion.div
                    className="space-y-4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    {/* Name & Status */}
                    <motion.div
                        className="card-elevated space-y-3"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
                            {product.name}
                        </h1>

                        <div className="flex gap-2">
                            <span
                                className="px-3 py-1 rounded-full text-sm font-medium text-white"
                                style={{
                                    backgroundColor: product.isActive ? "var(--success)" : "var(--error)",
                                }}
                            >
                                {product.isActive ? "Hoạt động" : "Ẩn"}
                            </span>
                            <span
                                className="px-3 py-1 rounded-full text-sm font-medium text-white"
                                style={{
                                    backgroundColor: product.stock > 0 ? "var(--success)" : "var(--error)",
                                }}
                            >
                                {product.stock > 0 ? `Còn ${product.stock}` : "Hết hàng"}
                            </span>
                        </div>
                    </motion.div>

                    {/* Price Card */}
                    <motion.div
                        className="card-elevated space-y-3"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <div className="flex items-center gap-2">
                            <DollarSign size={20} style={{ color: "var(--primary)" }} />
                            <span className="font-medium" style={{ color: "var(--text-secondary)" }}>
                                Giá bán
                            </span>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-bold" style={{ color: "var(--primary)" }}>
                                    {formatPrice(product.discountPrice || product.price)}
                                </span>
                                {product.discountPrice && (
                                    <span className="text-lg line-through" style={{ color: "var(--text-muted)" }}>
                                        {formatPrice(product.price)}
                                    </span>
                                )}
                            </div>
                            {discountPercent > 0 && (
                                <div
                                    className="text-sm font-medium text-white px-2 py-1 rounded inline-block"
                                    style={{ backgroundColor: "var(--error)" }}
                                >
                                    Giảm {discountPercent}%
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Stock & Views */}
                    <motion.div
                        className="card-elevated grid grid-cols-2 gap-4"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <div>
                            <div className="text-sm" style={{ color: "var(--text-muted)" }}>
                                Tồn kho
                            </div>
                            <div className="text-2xl font-bold" style={{ color: "var(--primary)" }}>
                                {product.stock}
                            </div>
                        </div>
                        <div>
                            <div className="text-sm" style={{ color: "var(--text-muted)" }}>
                                Lượt xem
                            </div>
                            <div className="text-2xl font-bold" style={{ color: "var(--primary)" }}>
                                {product.viewCount || 0}
                            </div>
                        </div>
                    </motion.div>

                    {/* Tags */}
                    {product.tags && product.tags.length > 0 && (
                        <motion.div
                            className="card-elevated space-y-3"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <div className="flex items-center gap-2">
                                <Tag size={20} style={{ color: "var(--primary)" }} />
                                <span className="font-medium">Tags</span>
                            </div>
                            <div className="flex gap-2 flex-wrap">
                                {product.tags.map((tag) => (
                                    <span key={tag} className="badge-primary text-sm">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </motion.div>
            </div>

            {/* Description */}
            <motion.div
                className="card-elevated space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
            >
                <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
                    Mô tả sản phẩm
                </h2>
                <p style={{ color: "var(--text-secondary)", whiteSpace: "pre-wrap" }}>{product.description}</p>
            </motion.div>

            {/* Category */}
            {product.category && (
                <motion.div
                    className="card-elevated space-y-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                >
                    <h3 className="font-medium" style={{ color: "var(--text-secondary)" }}>
                        Danh mục
                    </h3>
                    <p className="text-lg font-semibold" style={{ color: "var(--primary)" }}>
                        {product.category.name}
                    </p>
                </motion.div>
            )}

            {/* Videos */}
            {product.videos && product.videos.length > 0 && (
                <motion.div
                    className="card-elevated space-y-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                >
                    <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
                        Video
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {product.videos.map((video, index) => (
                            <motion.div
                                key={video._id}
                                className="rounded-lg overflow-hidden"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <video
                                    src={video.url}
                                    controls
                                    className="w-full h-64 object-cover rounded-lg"
                                    style={{ backgroundColor: "var(--bg-secondary)" }}
                                />
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Metadata */}
            <motion.div
                className="card-elevated space-y-3 text-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
            >
                <div className="flex justify-between">
                    <span style={{ color: "var(--text-muted)" }}>Ngày tạo:</span>
                    <span style={{ color: "var(--text-primary)" }}>
                        {new Date(product.createdAt).toLocaleDateString("vi-VN")}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span style={{ color: "var(--text-muted)" }}>Cập nhật:</span>
                    <span style={{ color: "var(--text-primary)" }}>
                        {new Date(product.updatedAt).toLocaleDateString("vi-VN")}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span style={{ color: "var(--text-muted)" }}>Đã bán:</span>
                    <span style={{ color: "var(--primary)", fontWeight: "bold" }}>{product.soldCount || 0} sản phẩm</span>
                </div>
            </motion.div>
        </motion.div>
    )
}
