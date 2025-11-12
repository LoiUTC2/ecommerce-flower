"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, X, Star } from "lucide-react"

export default function ImageGallery({ images = [], onSetPrimary, onDelete }) {
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [showModal, setShowModal] = useState(false)

    const handlePrevious = () => {
        setSelectedIndex((prev) => (prev - 1 + images.length) % images.length)
    }

    const handleNext = () => {
        setSelectedIndex((prev) => (prev + 1) % images.length)
    }

    if (!images || images.length === 0) {
        return (
            <div
                className="flex items-center justify-center h-64 rounded-lg border-2 border-dashed"
                style={{ borderColor: "var(--border-color)", backgroundColor: "var(--bg-secondary)" }}
            >
                <span style={{ color: "var(--text-muted)" }}>Không có ảnh</span>
            </div>
        )
    }

    const primaryImage = images.find((img) => img.isPrimary) || images[0]
    const currentImage = images[selectedIndex]

    return (
        <>
            {/* Main Gallery */}
            <motion.div className="space-y-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                {/* Large Image */}
                <motion.div
                    className="relative rounded-lg overflow-hidden bg-gray-200 h-96 cursor-pointer"
                    onClick={() => setShowModal(true)}
                    whileHover={{ scale: 1.02 }}
                >
                    <img src={currentImage.url || "/placeholder.svg"} alt="Product" className="w-full h-full object-cover" />
                    {currentImage.isPrimary && (
                        <div className="absolute top-4 left-4 rounded-full p-2" style={{ backgroundColor: "var(--primary)" }}>
                            <Star size={16} className="text-white fill-current" />
                        </div>
                    )}
                    <motion.div
                        className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                        initial={false}
                    >
                        <span className="text-white text-sm font-medium">Xem lớn</span>
                    </motion.div>
                </motion.div>

                {/* Image Controls */}
                <div className="flex gap-2">
                    <motion.button
                        onClick={handlePrevious}
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: "var(--bg-secondary)" }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <ChevronLeft size={20} />
                    </motion.button>
                    <motion.button
                        onClick={handleNext}
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: "var(--bg-secondary)" }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <ChevronRight size={20} />
                    </motion.button>
                    {!currentImage.isPrimary && onSetPrimary && (
                        <motion.button
                            onClick={() => onSetPrimary(currentImage._id)}
                            className="flex-1 px-4 py-2 rounded-lg text-white font-medium"
                            style={{ backgroundColor: "var(--primary)" }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Đặt làm ảnh chính
                        </motion.button>
                    )}
                    {onDelete && (
                        <motion.button
                            onClick={() => onDelete(currentImage._id)}
                            className="flex-1 px-4 py-2 rounded-lg text-white font-medium"
                            style={{ backgroundColor: "var(--error)" }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Xóa
                        </motion.button>
                    )}
                </div>

                {/* Thumbnails */}
                <div className="flex gap-3 overflow-x-auto pb-2">
                    {images.map((img, index) => (
                        <motion.button
                            key={img._id}
                            onClick={() => setSelectedIndex(index)}
                            className="relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all"
                            style={{
                                borderColor: selectedIndex === index ? "var(--primary)" : "var(--border-color)",
                            }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <img
                                src={img.url || "/placeholder.svg"}
                                alt={`Thumbnail ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                        </motion.button>
                    ))}
                </div>
            </motion.div>

            {/* Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowModal(false)}
                    >
                        <motion.div
                            className="relative max-w-4xl w-full max-h-[90vh]"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img
                                src={currentImage.url || "/placeholder.svg"}
                                alt="Full size"
                                className="w-full h-full object-contain rounded-lg"
                            />
                            <motion.button
                                onClick={() => setShowModal(false)}
                                className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/40 text-white"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <X size={24} />
                            </motion.button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
