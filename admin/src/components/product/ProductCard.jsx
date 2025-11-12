"use client"

import { motion } from "framer-motion"
import { Edit, Trash2, Eye } from "lucide-react"
import { Link } from "react-router-dom"
import { formatPrice, calculateDiscountPercent } from "../../services/productService"

export default function ProductCard({ product, onEdit, onDelete, index }) {
    const primaryImage = product.images?.find((img) => img.isPrimary) || product.images?.[0]
    const discountPercent = calculateDiscountPercent(product.price, product.discountPrice)

    return (
        <motion.div
            className="card-elevated overflow-hidden group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -4 }}
        >
            {/* Image Container */}
            <div className="relative overflow-hidden rounded-lg h-48 bg-gray-200 mb-4">
                {primaryImage ? (
                    <motion.img
                        src={primaryImage.url}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                    />
                ) : (
                    <div
                        className="w-full h-full flex items-center justify-center"
                        style={{ backgroundColor: "var(--bg-secondary)" }}
                    >
                        <span style={{ color: "var(--text-muted)" }}>Không có ảnh</span>
                    </div>
                )}

                {/* Discount Badge */}
                {discountPercent > 0 && (
                    <motion.div
                        className="absolute top-2 right-2 rounded-lg px-3 py-1 text-white font-semibold text-sm"
                        style={{ backgroundColor: "var(--error)" }}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        -{discountPercent}%
                    </motion.div>
                )}

                {/* Stock Status */}
                <motion.div
                    className="absolute bottom-2 left-2 rounded-lg px-3 py-1 text-white font-semibold text-sm"
                    style={{
                        backgroundColor: product.stock > 0 ? "var(--success)" : "var(--error)",
                    }}
                >
                    {product.stock > 0 ? `Còn ${product.stock}` : "Hết hàng"}
                </motion.div>

                {/* Overlay Actions */}
                <motion.div
                    className="absolute inset-0 bg-black/60 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity"
                    initial={false}
                >
                    {onEdit && (
                        <motion.button
                            onClick={() => onEdit(product.slug)}
                            className="p-3 rounded-full bg-white/20 hover:bg-white/40 text-white transition"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            title="Chỉnh sửa"
                        >
                            <Edit size={18} />
                        </motion.button>
                    )}
                    {onDelete && (
                        <motion.button
                            onClick={() => onDelete(product._id)}
                            className="p-3 rounded-full bg-white/20 hover:bg-white/40 text-white transition"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            title="Xóa"
                        >
                            <Trash2 size={18} />
                        </motion.button>
                    )}
                    <Link
                        to={`/products/${product.slug}`}
                        className="p-3 rounded-full bg-white/20 hover:bg-white/40 text-white transition"
                    >
                        <Eye size={18} />
                    </Link>
                </motion.div>
            </div>

            {/* Content */}
            <div className="space-y-2">
                <h3 className="font-semibold line-clamp-2 hover:text-[var(--primary)] transition">{product.name}</h3>

                {/* Price */}
                <div className="flex items-center gap-2">
                    <span className="font-bold text-lg" style={{ color: "var(--primary)" }}>
                        {formatPrice(product.discountPrice || product.price)}
                    </span>
                    {product.discountPrice && (
                        <span className="text-sm line-through" style={{ color: "var(--text-muted)" }}>
                            {formatPrice(product.price)}
                        </span>
                    )}
                </div>

                {/* Tags */}
                {product.tags && product.tags.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                        {product.tags.slice(0, 2).map((tag) => (
                            <span key={tag} className="badge-primary text-xs">
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    )
}
