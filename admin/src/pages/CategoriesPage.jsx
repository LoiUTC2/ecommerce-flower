"use client"

import { useState } from "react"
import { Plus, Edit, Trash2 } from "lucide-react"

export default function CategoriesPage() {
    const [categories, setCategories] = useState([
        { id: 1, name: "Roses", productCount: 45, image: "/rose-flowers.jpg" },
        { id: 2, name: "Tulips", productCount: 32, image: "/tulip-flowers.jpg" },
        { id: 3, name: "Sunflowers", productCount: 28, image: "/single-sunflower.png" },
        { id: 4, name: "Lilies", productCount: 35, image: "/single-white-lily.png" },
    ])

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-[--text-primary]">Categories</h1>
                    <p className="text-[--text-muted] mt-1">Manage product categories</p>
                </div>
                <button className="btn-primary flex items-center gap-2">
                    <Plus size={20} />
                    Add Category
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category) => (
                    <div key={category.id} className="card">
                        <img
                            src={category.image || "/placeholder.svg"}
                            alt={category.name}
                            className="w-full h-40 object-cover rounded-lg mb-4"
                        />
                        <h3 className="text-lg font-bold text-[--text-primary] mb-2">{category.name}</h3>
                        <p className="text-[--text-muted] mb-4">{category.productCount} products</p>
                        <div className="flex gap-2">
                            <button className="flex-1 btn-secondary flex items-center justify-center gap-2">
                                <Edit size={18} />
                                Edit
                            </button>
                            <button className="btn-secondary p-2">
                                <Trash2 size={18} className="text-[--error]" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
