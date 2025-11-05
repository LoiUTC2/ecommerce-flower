"use client"

import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { BarChart3, Package, ShoppingCart, Users, MessageSquare, Settings, Flower2, Menu, X, Tags } from "lucide-react"

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(true)
    const location = useLocation()

    const menuItems = [
        { path: "/", label: "Dashboard", icon: BarChart3 },
        { path: "/products", label: "Products", icon: Package },
        { path: "/categories", label: "Categories", icon: Tags },
        { path: "/orders", label: "Orders", icon: ShoppingCart },
        { path: "/customers", label: "Customers", icon: Users },
        { path: "/reviews", label: "Reviews", icon: MessageSquare },
        { path: "/shop-info", label: "Shop Info", icon: Settings },
    ]

    const isActive = (path) => location.pathname === path

    return (
        <>
            {/* Mobile menu toggle */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed top-4 left-4 z-50 md:hidden p-2 bg-[--surface] border border-[--border] rounded-lg"
            >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Sidebar */}
            <div
                className={`${isOpen ? "w-64" : "w-0"
                    } bg-[--surface] border-r border-[--border] transition-all duration-300 overflow-hidden md:w-64 md:relative md:block fixed h-full z-40`}
            >
                {/* Logo */}
                <div className="p-6 border-b border-[--border] flex items-center gap-3">
                    <Flower2 size={28} className="text-[--primary]" />
                    <div>
                        <h1 className="font-bold text-lg text-[--text-primary]">Bloom</h1>
                        <p className="text-xs text-[--text-muted]">Flower Shop</p>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon
                        const active = isActive(item.path)
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`nav-item ${active ? "active" : ""}`}
                                onClick={() => setIsOpen(false)}
                            >
                                <Icon size={20} />
                                <span>{item.label}</span>
                            </Link>
                        )
                    })}
                </nav>

                {/* Footer */}
                <div className="absolute bottom-0 w-full p-4 border-t border-[--border]">
                    <div className="flex items-center gap-3 p-2">
                        <div className="w-10 h-10 rounded-full bg-[--primary] flex items-center justify-center text-white font-bold">
                            A
                        </div>
                        <div className="text-sm">
                            <p className="font-medium text-[--text-primary]">Admin</p>
                            <p className="text-xs text-[--text-muted]">Manage Store</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
