"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, AlertCircle, CheckCircle, Info } from "lucide-react"

export default function Dialog({
    isOpen,
    onClose,
    title,
    message,
    type = "confirm", // confirm, success, error, info, alert
    confirmText = "Xác nhận",
    cancelText = "Hủy bỏ",
    onConfirm,
    onCancel,
    isDangerous = false,
    isLoading = false,
}) {
    const handleConfirm = () => {
        if (onConfirm) {
            onConfirm()
        }
        if (type !== "confirm") {
            onClose()
        }
    }

    const handleCancel = () => {
        if (onCancel) {
            onCancel()
        }
        onClose()
    }

    // Type mapping for icons and colors
    const typeConfig = {
        confirm: {
            icon: AlertCircle,
            iconColor: "var(--primary)",
            bgColor: "var(--primary-lighter)",
            borderColor: "var(--primary-light)",
        },
        success: {
            icon: CheckCircle,
            iconColor: "var(--success)",
            bgColor: "rgba(16, 185, 129, 0.1)",
            borderColor: "rgba(16, 185, 129, 0.3)",
        },
        error: {
            icon: AlertCircle,
            iconColor: "var(--error)",
            bgColor: "rgba(239, 68, 68, 0.1)",
            borderColor: "rgba(239, 68, 68, 0.3)",
        },
        info: {
            icon: Info,
            iconColor: "var(--accent-sky)",
            bgColor: "rgba(186, 230, 253, 0.1)",
            borderColor: "rgba(186, 230, 253, 0.3)",
        },
        alert: {
            icon: AlertCircle,
            iconColor: "var(--warning)",
            bgColor: "rgba(245, 158, 11, 0.1)",
            borderColor: "rgba(245, 158, 11, 0.3)",
        },
    }

    const config = typeConfig[type]
    const IconComponent = config.icon

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleCancel}
                        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
                    />

                    {/* Dialog */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", damping: 20, stiffness: 300 }}
                        className="fixed inset-0 flex items-center justify-center z-50 p-4"
                    >
                        <div className="card-elevated max-w-md w-full shadow-xl">
                            {/* Close Button */}
                            <motion.button
                                onClick={handleCancel}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                className="absolute top-4 right-4 p-1 hover:bg-[var(--bg-secondary)] rounded-lg transition"
                            >
                                <X size={20} style={{ color: "var(--text-muted)" }} />
                            </motion.button>

                            {/* Icon & Title */}
                            <motion.div
                                className="flex items-start gap-4 mb-4"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                <motion.div
                                    className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
                                    style={{
                                        backgroundColor: config.bgColor,
                                        borderColor: config.borderColor,
                                        borderWidth: "2px",
                                    }}
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ duration: 0.6 }}
                                >
                                    <IconComponent size={24} style={{ color: config.iconColor }} />
                                </motion.div>

                                <div className="flex-1">
                                    <h2 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
                                        {title}
                                    </h2>
                                </div>
                            </motion.div>

                            {/* Message */}
                            <motion.p
                                className="mb-6 text-sm"
                                style={{ color: "var(--text-secondary)" }}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                {message}
                            </motion.p>

                            {/* Actions */}
                            {(type === "confirm" || type === "alert") && (
                                <motion.div
                                    className="flex gap-3 justify-end"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <motion.button
                                        onClick={handleCancel}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="btn-secondary px-6"
                                        disabled={isLoading}
                                    >
                                        {cancelText}
                                    </motion.button>

                                    <motion.button
                                        onClick={handleConfirm}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        disabled={isLoading}
                                        className={`px-6 py-2 rounded-[var(--radius)] font-medium text-white transition-all duration-200 ${isDangerous
                                                ? "bg-[var(--error)] hover:bg-red-600"
                                                : "bg-[var(--primary)] hover:bg-[var(--primary-dark)]"
                                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                                    >
                                        {isLoading ? (
                                            <motion.span
                                                animate={{ rotate: 360 }}
                                                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1 }}
                                                className="inline-block"
                                            >
                                                ⏳
                                            </motion.span>
                                        ) : (
                                            confirmText
                                        )}
                                    </motion.button>
                                </motion.div>
                            )}

                            {/* Success/Error/Info Only Actions */}
                            {(type === "success" || type === "error" || type === "info") && (
                                <motion.button
                                    onClick={handleCancel}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="btn-primary w-full"
                                >
                                    Đóng
                                </motion.button>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
