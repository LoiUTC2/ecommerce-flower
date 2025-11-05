"use client"

import { useState } from "react"
import { Plus, Search, Edit, Trash2 } from "lucide-react"

export default function ProductsPage() {
    const [products, setProducts] = useState([
        {
            id: 1,
            name: "Red Roses Bouquet",
            category: "Roses",
            price: "$45",
            stock: 28,
            image: "/red-roses.png",
        },
        {
            id: 2,
            name: "Sunflower Mix",
            category: "Sunflowers",
            price: "$32",
            stock: 15,
            image: "/vibrant-sunflowers.png",
        },
        { id: 3, name: "Tulip Paradise", category: "Tulips", price: "$38", stock: 42, image: "/vibrant-tulip-field.png" },
        {
            id: 4,
            name: "Lily Collection",
            category: "Lilies",
            price: "$50",
            stock: 20,
            image: "/lilies.png",
        },
    ])

    const [searchTerm, setSearchTerm] = useState("")

    const filteredProducts = products.filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()))

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-[--text-primary]">Products</h1>
                    <p className="text-[--text-muted] mt-1">Manage your flower inventory</p>
                </div>
                <button className="btn-primary flex items-center gap-2">
                    <Plus size={20} />
                    Add Product
                </button>
            </div>

            {/* Search & Filter */}
            <div className="card flex items-center gap-4 flex-wrap">
                <div className="flex-1 min-w-[200px] relative">
                    <Search size={18} className="absolute left-3 top-3 text-[--text-muted]" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="input-field pl-10"
                    />
                </div>
                <select className="input-field w-auto">
                    <option>All Categories</option>
                    <option>Roses</option>
                    <option>Tulips</option>
                    <option>Sunflowers</option>
                </select>
            </div>

            {/* Products Table */}
            <div className="card overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-[--border]">
                            <th className="text-left py-3 px-4 font-semibold text-[--text-secondary]">Product</th>
                            <th className="text-left py-3 px-4 font-semibold text-[--text-secondary]">Category</th>
                            <th className="text-left py-3 px-4 font-semibold text-[--text-secondary]">Price</th>
                            <th className="text-left py-3 px-4 font-semibold text-[--text-secondary]">Stock</th>
                            <th className="text-left py-3 px-4 font-semibold text-[--text-secondary]">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map((product) => (
                            <tr key={product.id} className="border-b border-[--border] hover:bg-[--surface-light]">
                                <td className="py-3 px-4">
                                    <div className="flex items-center gap-3">
                                        <img src={product.image || "/placeholder.svg"} alt={product.name} className="w-10 h-10 rounded" />
                                        <span className="text-[--text-primary] font-medium">{product.name}</span>
                                    </div>
                                </td>
                                <td className="py-3 px-4 text-[--text-secondary]">{product.category}</td>
                                <td className="py-3 px-4 text-[--text-primary] font-semibold">{product.price}</td>
                                <td className="py-3 px-4">
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${product.stock > 20 ? "bg-green-900 text-green-200" : "bg-yellow-900 text-yellow-200"
                                            }`}
                                    >
                                        {product.stock} in stock
                                    </span>
                                </td>
                                <td className="py-3 px-4">
                                    <div className="flex items-center gap-2">
                                        <button className="p-2 hover:bg-[--surface-light] rounded transition-colors">
                                            <Edit size={18} className="text-[--primary]" />
                                        </button>
                                        <button className="p-2 hover:bg-[--surface-light] rounded transition-colors">
                                            <Trash2 size={18} className="text-[--error]" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
