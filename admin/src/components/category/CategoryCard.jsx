"use client"

import { motion } from "framer-motion"
import { getCategoryIcon } from "../../services/categoryService"

export default function CategoryCard({ category, onEdit, onDelete, onSelect }) {
    return (
        <motion.div
            className="card-elevated cursor-pointer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect?.(category)}
        >
            {/* Header with Icon */}
            <div className="flex items-start justify-between mb-4">
                <div className="text-3xl">{getCategoryIcon(category.icon)}</div>
                <div className="flex gap-2">{category.isActive && <span className="badge-success">Hoạt động</span>}</div>
            </div>

            {/* Name */}
            <h3 className="font-semibold text-lg mb-2 line-clamp-1" style={{ color: "var(--text-primary)" }}>
                {category.name}
            </h3>

            {/* Description */}
            {category.description && (
                <p className="text-sm mb-4 line-clamp-2" style={{ color: "var(--text-secondary)" }}>
                    {category.description}
                </p>
            )}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-4 p-3 rounded-lg" style={{ backgroundColor: "var(--bg-secondary)" }}>
                <div className="text-center">
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                        Sản phẩm
                    </p>
                    <p className="font-semibold text-lg" style={{ color: "var(--primary)" }}>
                        {category.stats?.productCount || 0}
                    </p>
                </div>
                <div className="text-center">
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                        Lượt xem
                    </p>
                    <p className="font-semibold text-lg" style={{ color: "var(--accent-sky)" }}>
                        {category.stats?.viewCount || 0}
                    </p>
                </div>
                <div className="text-center">
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                        Đơn hàng
                    </p>
                    <p className="font-semibold text-lg" style={{ color: "var(--success)" }}>
                        {category.stats?.orderCount || 0}
                    </p>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4" style={{ borderTop: "1px solid var(--border-color)" }}>
                <motion.button
                    onClick={(e) => {
                        e.stopPropagation()
                        onEdit?.(category)
                    }}
                    className="btn-secondary flex-1 text-sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Chỉnh sửa
                </motion.button>
                <motion.button
                    onClick={(e) => {
                        e.stopPropagation()
                        onDelete?.(category)
                    }}
                    className="flex-1 text-sm font-medium px-3 py-2 rounded transition-all"
                    style={{
                        backgroundColor: "rgba(239, 68, 68, 0.1)",
                        color: "var(--error)",
                        border: "1px solid var(--error)",
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Xóa
                </motion.button>
            </div>
        </motion.div>
    )
}
