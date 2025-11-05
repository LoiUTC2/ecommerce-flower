"use client"

import { useState } from "react"
import { Search, Trash2, Flag } from "lucide-react"

export default function ReviewsPage() {
    const [reviews, setReviews] = useState([
        {
            id: 1,
            product: "Red Roses Bouquet",
            customer: "John Doe",
            rating: 5,
            comment: "Amazing quality! Will order again.",
            status: "Approved",
        },
        {
            id: 2,
            product: "Sunflower Mix",
            customer: "Jane Smith",
            rating: 4,
            comment: "Good value for money, great delivery.",
            status: "Approved",
        },
        {
            id: 3,
            product: "Tulip Paradise",
            customer: "Mike Johnson",
            rating: 3,
            comment: "Average product, could be better.",
            status: "Pending",
        },
        {
            id: 4,
            product: "Lily Collection",
            customer: "Sarah Wilson",
            rating: 5,
            comment: "Perfect for my wedding! Highly recommended.",
            status: "Approved",
        },
    ])

    const [searchTerm, setSearchTerm] = useState("")

    const filteredReviews = reviews.filter(
        (r) =>
            r.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.customer.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    const renderStars = (rating) => {
        return "★".repeat(rating) + "☆".repeat(5 - rating)
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-[--text-primary]">Customer Reviews</h1>
                <p className="text-[--text-muted] mt-1">Manage product reviews and ratings</p>
            </div>

            <div className="card">
                <div className="relative mb-6">
                    <Search size={18} className="absolute left-3 top-3 text-[--text-muted]" />
                    <input
                        type="text"
                        placeholder="Search reviews..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="input-field pl-10"
                    />
                </div>

                <div className="space-y-4">
                    {filteredReviews.map((review) => (
                        <div
                            key={review.id}
                            className="border border-[--border] rounded-lg p-4 hover:bg-[--surface-light] transition-colors"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                    <h3 className="font-semibold text-[--text-primary] mb-1">{review.product}</h3>
                                    <p className="text-sm text-[--text-muted] mb-2">by {review.customer}</p>
                                    <p className="text-yellow-400 mb-2">{renderStars(review.rating)}</p>
                                </div>
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-medium ${review.status === "Approved" ? "bg-green-900 text-green-200" : "bg-yellow-900 text-yellow-200"
                                        }`}
                                >
                                    {review.status}
                                </span>
                            </div>
                            <p className="text-[--text-secondary] mb-3">{review.comment}</p>
                            <div className="flex gap-2">
                                <button className="p-2 hover:bg-[--surface] rounded transition-colors">
                                    <Flag size={16} className="text-[--warning]" />
                                </button>
                                <button className="p-2 hover:bg-[--surface] rounded transition-colors">
                                    <Trash2 size={16} className="text-[--error]" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
