"use client"

import { useState } from "react"
import { MapPin, Phone, Mail } from "lucide-react"

export default function ShopInfoPage() {
    const [shopInfo, setShopInfo] = useState({
        name: "Bloom Flower Shop",
        description: "Your premium flower delivery service",
        address: "123 Main Street, New York, NY 10001",
        phone: "+1-234-567-8900",
        email: "info@bloomflowers.com",
        openingHours: "9:00 AM - 6:00 PM",
        website: "www.bloomflowers.com",
        rating: "4.8",
        reviews: "1,234",
    })

    const [isEditing, setIsEditing] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target
        setShopInfo((prev) => ({ ...prev, [name]: value }))
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-[--text-primary]">Shop Information</h1>
                    <p className="text-[--text-muted] mt-1">Manage your store details</p>
                </div>
                <button onClick={() => setIsEditing(!isEditing)} className={isEditing ? "btn-primary" : "btn-secondary"}>
                    {isEditing ? "Save" : "Edit"}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="card">
                        <h2 className="text-xl font-bold text-[--text-primary] mb-4">Basic Information</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[--text-secondary] mb-2">Shop Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={shopInfo.name}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className={`input-field ${!isEditing && "opacity-50 cursor-not-allowed"}`}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[--text-secondary] mb-2">Description</label>
                                <textarea
                                    name="description"
                                    value={shopInfo.description}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className={`input-field h-24 ${!isEditing && "opacity-50 cursor-not-allowed"}`}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[--text-secondary] mb-2">Website</label>
                                <input
                                    type="text"
                                    name="website"
                                    value={shopInfo.website}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className={`input-field ${!isEditing && "opacity-50 cursor-not-allowed"}`}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <h2 className="text-xl font-bold text-[--text-primary] mb-4">Contact Information</h2>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <MapPin className="mt-1 text-[--primary]" size={20} />
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-[--text-secondary] mb-2">Address</label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={shopInfo.address}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className={`input-field ${!isEditing && "opacity-50 cursor-not-allowed"}`}
                                    />
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Phone className="mt-1 text-[--primary]" size={20} />
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-[--text-secondary] mb-2">Phone</label>
                                    <input
                                        type="text"
                                        name="phone"
                                        value={shopInfo.phone}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className={`input-field ${!isEditing && "opacity-50 cursor-not-allowed"}`}
                                    />
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Mail className="mt-1 text-[--primary]" size={20} />
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-[--text-secondary] mb-2">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={shopInfo.email}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className={`input-field ${!isEditing && "opacity-50 cursor-not-allowed"}`}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[--text-secondary] mb-2">Opening Hours</label>
                                <input
                                    type="text"
                                    name="openingHours"
                                    value={shopInfo.openingHours}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className={`input-field ${!isEditing && "opacity-50 cursor-not-allowed"}`}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="space-y-6">
                    <div className="card">
                        <h2 className="text-xl font-bold text-[--text-primary] mb-4">Shop Stats</h2>
                        <div className="space-y-4">
                            <div className="p-4 bg-[--surface-light] rounded-lg">
                                <p className="text-[--text-muted] text-sm mb-1">Average Rating</p>
                                <p className="text-3xl font-bold text-[--primary]">{shopInfo.rating}</p>
                                <p className="text-xs text-[--text-muted] mt-1">out of 5 stars</p>
                            </div>
                            <div className="p-4 bg-[--surface-light] rounded-lg">
                                <p className="text-[--text-muted] text-sm mb-1">Total Reviews</p>
                                <p className="text-3xl font-bold text-[--primary]">{shopInfo.reviews}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
