"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import CategoryCard from "../components/category/CategoryCard"
import CategoryForm from "../components/category/CategoryForm"

import {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    syncProductCounts,
} from "../services/categoryService"
import Dialog from "@/components/dialog/Dialog"

export default function CategoriesPage() {
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [showForm, setShowForm] = useState(false)
    const [editingCategory, setEditingCategory] = useState(null)
    const [formSubmitting, setFormSubmitting] = useState(false)

    const [deleteDialog, setDeleteDialog] = useState({
        isOpen: false,
        category: null,
    })
    const [moveProductsDialog, setMoveProductsDialog] = useState({
        isOpen: false,
        category: null,
        moveToId: "",
    })
    const [deleteLoading, setDeleteLoading] = useState(false)

    // Filters and Search
    const [searchTerm, setSearchTerm] = useState("")
    const [filterActive, setFilterActive] = useState(null)
    const [sortBy, setSortBy] = useState("displayOrder")
    const [page, setPage] = useState(1)
    const [pagination, setPagination] = useState(null)

    // Fetch categories
    const fetchCategories = async () => {
        setLoading(true)
        setError(null)
        try {
            const params = {
                search: searchTerm,
                sortBy,
                order: sortBy === "displayOrder" ? "asc" : "desc",
                page,
                limit: 12,
            }

            if (filterActive !== null) {
                params.isActive = filterActive
            }

            const response = await getCategories(params)
            setCategories(response.data.categories || [])
            setPagination(response.data.pagination)
        } catch (err) {
            setError(err.response?.data?.message || "Lỗi khi tải danh mục")
            console.error("[v0] Fetch categories error:", err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCategories()
    }, [searchTerm, sortBy, filterActive, page])

    // Handle create
    const handleCreate = async (formData) => {
        setFormSubmitting(true)
        try {
            await createCategory(formData)
            setShowForm(false)
            fetchCategories()
        } catch (err) {
            setError(err.response?.data?.message || "Lỗi khi tạo danh mục")
            console.error("[v0] Create category error:", err)
        } finally {
            setFormSubmitting(false)
        }
    }

    // Handle update
    const handleUpdate = async (formData) => {
        setFormSubmitting(true)
        try {
            await updateCategory(editingCategory._id, formData)
            setEditingCategory(null)
            setShowForm(false)
            fetchCategories()
        } catch (err) {
            setError(err.response?.data?.message || "Lỗi khi cập nhật danh mục")
            console.error("[v0] Update category error:", err)
        } finally {
            setFormSubmitting(false)
        }
    }

    // Handle delete
    const handleDelete = async (category) => {
        if (category.stats?.productCount > 0) {
            setDeleteDialog({
                isOpen: true,
                category,
            })
        } else {
            setDeleteDialog({
                isOpen: true,
                category,
            })
        }
    }

    const handleConfirmDelete = async (forceDelete = false) => {
        if (!deleteDialog.category) return

        setDeleteLoading(true)
        try {
            const deleteParams = {}
            if (forceDelete) {
                deleteParams.forceDelete = true
            } else if (moveProductsDialog.moveToId) {
                deleteParams.moveTo = moveProductsDialog.moveToId
            }

            await deleteCategory(deleteDialog.category._id, deleteParams)

            setDeleteDialog({ isOpen: false, category: null })
            setMoveProductsDialog({ isOpen: false, category: null, moveToId: "" })
            fetchCategories()
        } catch (err) {
            setError(err.response?.data?.message || "Lỗi khi xóa danh mục")
            console.error("[v0] Delete category error:", err)
        } finally {
            setDeleteLoading(false)
        }
    }

    // Handle edit
    const handleEdit = (category) => {
        setEditingCategory(category)
        setShowForm(true)
    }

    const handleFormClose = () => {
        setShowForm(false)
        setEditingCategory(null)
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div>
                    <h1 className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>
                        Quản lí danh mục
                    </h1>
                    <p style={{ color: "var(--text-secondary)" }}>{pagination?.total || 0} danh mục</p>
                </div>

                <motion.button
                    onClick={() => setShowForm(true)}
                    className="btn-primary"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    + Thêm danh mục mới
                </motion.button>
            </motion.div>

            {/* Error Alert */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        className="p-4 rounded-lg"
                        style={{ backgroundColor: "rgba(239, 68, 68, 0.1)", borderLeft: "4px solid var(--error)" }}
                        exit={{ opacity: 0, x: -20 }}
                    >
                        <p style={{ color: "var(--error)" }}>{error}</p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Filters & Search */}
            <div className="card-elevated">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Search */}
                    <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>
                            Tìm kiếm
                        </label>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value)
                                setPage(1)
                            }}
                            placeholder="Tên danh mục..."
                            className="input-field"
                        />
                    </div>

                    {/* Status Filter */}
                    <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>
                            Trạng thái
                        </label>
                        <select
                            value={filterActive === null ? "" : filterActive}
                            onChange={(e) => {
                                setFilterActive(e.target.value === "" ? null : e.target.value === "true")
                                setPage(1)
                            }}
                            className="input-field"
                        >
                            <option value="">Tất cả</option>
                            <option value="true">Hoạt động</option>
                            <option value="false">Không hoạt động</option>
                        </select>
                    </div>

                    {/* Sort */}
                    <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>
                            Sắp xếp
                        </label>
                        <select
                            value={sortBy}
                            onChange={(e) => {
                                setSortBy(e.target.value)
                                setPage(1)
                            }}
                            className="input-field"
                        >
                            <option value="displayOrder">Thứ tự hiển thị</option>
                            <option value="name">Tên</option>
                            <option value="createdAt">Mới nhất</option>
                        </select>
                    </div>

                    {/* Sync Counts */}
                    <div className="flex items-end">
                        <motion.button
                            onClick={async () => {
                                try {
                                    await syncProductCounts()
                                    fetchCategories()
                                } catch (err) {
                                    setError("Lỗi khi đồng bộ")
                                }
                            }}
                            className="btn-secondary w-full"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Đồng bộ dữ liệu
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* Categories Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="card-elevated shimmer-pulse" style={{ height: "300px" }} />
                    ))}
                </div>
            ) : categories.length === 0 ? (
                <div className="card-elevated text-center py-12" style={{ backgroundColor: "var(--bg-secondary)" }}>
                    <p style={{ color: "var(--text-muted)" }}>Không có danh mục nào</p>
                </div>
            ) : (
                <>
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        variants={{
                            hidden: { opacity: 0 },
                            show: {
                                opacity: 1,
                                transition: {
                                    staggerChildren: 0.1,
                                },
                            },
                        }}
                        initial="hidden"
                        animate="show"
                    >
                        {categories.map((category) => (
                            <motion.div
                                key={category._id}
                                variants={{
                                    hidden: { opacity: 0, y: 20 },
                                    show: { opacity: 1, y: 0 },
                                }}
                            >
                                <CategoryCard category={category} onEdit={handleEdit} onDelete={handleDelete} />
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Pagination */}
                    {pagination && pagination.pages > 1 && (
                        <div className="flex justify-center gap-2">
                            {[...Array(pagination.pages)].map((_, i) => (
                                <motion.button
                                    key={i + 1}
                                    onClick={() => setPage(i + 1)}
                                    className="px-3 py-2 rounded-lg font-medium transition-all"
                                    style={{
                                        backgroundColor: page === i + 1 ? "var(--primary)" : "var(--bg-secondary)",
                                        color: page === i + 1 ? "white" : "var(--text-primary)",
                                        border: `1px solid ${page === i + 1 ? "var(--primary)" : "var(--border-color)"}`,
                                    }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {i + 1}
                                </motion.button>
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* Form Modal */}
            <AnimatePresence>
                {showForm && (
                    <motion.div
                        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleFormClose}
                    >
                        <motion.div
                            className="card-elevated max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div
                                className="flex items-center justify-between mb-6"
                                style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "1.5rem" }}
                            >
                                <h2 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
                                    {editingCategory ? "Chỉnh sửa danh mục" : "Tạo danh mục mới"}
                                </h2>
                                <button
                                    onClick={handleFormClose}
                                    className="text-2xl hover:opacity-70"
                                    style={{ color: "var(--text-muted)" }}
                                >
                                    ×
                                </button>
                            </div>

                            <CategoryForm
                                initialData={editingCategory}
                                onSubmit={editingCategory ? handleUpdate : handleCreate}
                                isLoading={formSubmitting}
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Dialog
                isOpen={deleteDialog.isOpen}
                onClose={() => {
                    setDeleteDialog({ isOpen: false, category: null })
                    setMoveProductsDialog({ isOpen: false, category: null, moveToId: "" })
                }}
                type="confirm"
                title="Xác nhận xóa danh mục"
                message={
                    deleteDialog.category
                        ? `Bạn có chắc chắn muốn xóa danh mục "${deleteDialog.category.name}"?${deleteDialog.category.stats?.productCount > 0
                            ? ` Danh mục này có ${deleteDialog.category.stats.productCount} sản phẩm.`
                            : ""
                        }`
                        : ""
                }
                confirmText={deleteDialog.category?.stats?.productCount > 0 ? "Tiếp tục" : "Xóa"}
                isDangerous
                isLoading={deleteLoading}
                onConfirm={() => {
                    if (deleteDialog.category?.stats?.productCount > 0) {
                        setMoveProductsDialog({
                            isOpen: true,
                            category: deleteDialog.category,
                            moveToId: "",
                        })
                    } else {
                        handleConfirmDelete(false)
                    }
                }}
            />

            {moveProductsDialog.isOpen && moveProductsDialog.category && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 flex items-center justify-center p-4">
                    <motion.div
                        className="card-elevated max-w-md w-full shadow-xl"
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                    >
                        <h2 className="text-xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
                            Di chuyển sản phẩm
                        </h2>

                        <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
                            Danh mục này có {moveProductsDialog.category.stats?.productCount} sản phẩm. Chọn danh mục đích để di
                            chuyển chúng:
                        </p>

                        <select
                            value={moveProductsDialog.moveToId}
                            onChange={(e) => setMoveProductsDialog({ ...moveProductsDialog, moveToId: e.target.value })}
                            className="input-field w-full mb-6"
                        >
                            <option value="">-- Chọn danh mục --</option>
                            {categories
                                .filter((cat) => cat._id !== moveProductsDialog.category._id)
                                .map((cat) => (
                                    <option key={cat._id} value={cat._id}>
                                        {cat.name}
                                    </option>
                                ))}
                            <option value="">-- Xóa bắt buộc (xóa tất cả sản phẩm) --</option>
                        </select>

                        <div className="flex gap-3 justify-end">
                            <motion.button
                                onClick={() => setMoveProductsDialog({ isOpen: false, category: null, moveToId: "" })}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="btn-secondary px-6"
                                disabled={deleteLoading}
                            >
                                Hủy bỏ
                            </motion.button>

                            <motion.button
                                onClick={() => handleConfirmDelete(moveProductsDialog.moveToId === "")}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="btn-primary px-6"
                                disabled={deleteLoading}
                            >
                                {deleteLoading ? "Đang xóa..." : "Xác nhận"}
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            )}

        </div>
    )
}
