"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Plus, Search, Filter } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { getProducts, deleteProduct } from "../../services/productService"
import ProductCard from "../../components/product/ProductCard"
import Dialog from "../../components/dialog/Dialog"

export default function ProductsPage() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [filterCategory, setFilterCategory] = useState("")
    const [page, setPage] = useState(1)
    const [pagination, setPagination] = useState({})
    const [dialog, setDialog] = useState({
        isOpen: false,
        type: "confirm",
        title: "",
        message: "",
        onConfirm: null,
        isLoading: false,
    })

    const navigate = useNavigate()

    useEffect(() => {
        fetchProducts()
    }, [page, searchTerm, filterCategory])

    const fetchProducts = async () => {
        try {
            setLoading(true)
            const response = await getProducts({
                page,
                limit: 12,
                search: searchTerm,
                category: filterCategory,
            })

            if (response.success) {
                setProducts(response.data.products)
                setPagination(response.data.pagination)
            }
        } catch (error) {
            console.error("Error fetching products:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (productId) => {
        setDialog({
            isOpen: true,
            type: "confirm",
            title: "Xóa sản phẩm",
            message: "Bạn chắc chắn muốn xóa sản phẩm này? Hành động này không thể hoàn tác.",
            isDangerous: true,
            isLoading: false,
            onConfirm: async () => {
                try {
                    setDialog((prev) => ({ ...prev, isLoading: true }))
                    await deleteProduct(productId)

                    setDialog({
                        isOpen: true,
                        type: "success",
                        title: "Thành công",
                        message: "Sản phẩm đã được xóa thành công.",
                        isLoading: false,
                    })

                    setTimeout(() => {
                        setDialog((prev) => ({ ...prev, isOpen: false }))
                        fetchProducts()
                    }, 1500)
                } catch (error) {
                    setDialog({
                        isOpen: true,
                        type: "error",
                        title: "Lỗi",
                        message: `Lỗi xóa sản phẩm: ${error.message}`,
                        isLoading: false,
                    })
                }
            },
        })
    }

    const handleEdit = (slug) => {
        navigate(`/products/edit/${slug}`)
    }

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
            >
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <h1 className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>
                            Quản lí sản phẩm
                        </h1>
                        <p style={{ color: "var(--text-secondary)" }}>Tổng cộng: {pagination.total || 0} sản phẩm</p>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                        <Link to="/products/create" className="btn-primary inline-flex items-center gap-2 px-6 py-3 font-semibold">
                            <Plus size={20} />
                            Tạo sản phẩm
                        </Link>
                    </motion.div>
                </div>

                {/* Search & Filter */}
                <motion.div
                    className="card-elevated grid grid-cols-1 md:grid-cols-3 gap-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    {/* Search */}
                    <div className="relative md:col-span-2">
                        <Search
                            size={20}
                            className="absolute left-3 top-1/2 -translate-y-1/2"
                            style={{ color: "var(--text-muted)" }}
                        />
                        <input
                            type="text"
                            placeholder="Tìm kiếm sản phẩm..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value)
                                setPage(1)
                            }}
                            className="input-field pl-10"
                        />
                    </div>

                    {/* Filter */}
                    <div className="relative">
                        <Filter
                            size={20}
                            className="absolute left-3 top-1/2 -translate-y-1/2"
                            style={{ color: "var(--text-muted)" }}
                        />
                        <select
                            value={filterCategory}
                            onChange={(e) => {
                                setFilterCategory(e.target.value)
                                setPage(1)
                            }}
                            className="input-field pl-10 appearance-none cursor-pointer"
                        >
                            <option value="">Tất cả danh mục</option>
                            <option value="roses">Hoa hồng</option>
                            <option value="sunflower">Hướng dương</option>
                            <option value="tulip">Tulip</option>
                        </select>
                    </div>
                </motion.div>

                {/* Products Grid */}
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <motion.div className="shimmer-pulse" style={{ color: "var(--primary)" }}>
                            Đang tải...
                        </motion.div>
                    </div>
                ) : products.length > 0 ? (
                    <>
                        <motion.div
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ staggerChildren: 0.05 }}
                        >
                            {products.map((product, index) => (
                                <ProductCard
                                    key={product._id}
                                    product={product}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                    index={index}
                                />
                            ))}
                        </motion.div>

                        {/* Pagination */}
                        {pagination.totalPages > 1 && (
                            <motion.div
                                className="flex items-center justify-center gap-2"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                            >
                                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNum) => (
                                    <motion.button
                                        key={pageNum}
                                        onClick={() => setPage(pageNum)}
                                        className={`px-4 py-2 rounded-lg font-medium transition ${page === pageNum ? "text-white" : "bg-[var(--bg-secondary)] hover:bg-[var(--border-color)]"
                                            }`}
                                        style={{
                                            backgroundColor: page === pageNum ? "var(--primary)" : undefined,
                                        }}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        {pageNum}
                                    </motion.button>
                                ))}
                            </motion.div>
                        )}
                    </>
                ) : (
                    <motion.div className="card-elevated text-center py-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <p style={{ color: "var(--text-muted)" }}>Không tìm thấy sản phẩm</p>
                    </motion.div>
                )}
            </motion.div>

            {/* Dialog Component */}
            <Dialog
                isOpen={dialog.isOpen}
                onClose={() => setDialog((prev) => ({ ...prev, isOpen: false }))}
                title={dialog.title}
                message={dialog.message}
                type={dialog.type}
                isDangerous={dialog.isDangerous}
                isLoading={dialog.isLoading}
                onConfirm={dialog.onConfirm}
            />
        </>
    )
}
