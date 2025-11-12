"use client"

import { motion, AnimatePresence } from "framer-motion"
import { NavLink } from "react-router-dom"
import { Home, Package, Folder, ShoppingCart, Users, MessageSquare, Info, LogOut, X, Flower } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "../context/AuthContext"

export default function Sidebar({ isOpen, toggleSidebar }) {
    const { logout } = useAuth()

    const menuItems = [
        { path: "/dashboard", label: "Tổng quan", icon: <Home size={20} /> },
        { path: "/products", label: "Sản phẩm", icon: <Package size={20} /> },
        { path: "/categories", label: "Danh mục", icon: <Folder size={20} /> },
        { path: "/orders", label: "Đơn hàng", icon: <ShoppingCart size={20} /> },
        { path: "/customers", label: "Khách hàng", icon: <Users size={20} /> },
        { path: "/reviews", label: "Đánh giá", icon: <MessageSquare size={20} /> },
        { path: "/shop-info", label: "Giới thiệu shop", icon: <Info size={20} /> },
    ]

    const sidebarVariants = {
        hidden: { x: -280 },
        visible: { x: 0 },
    }

    return (
        <>
            {/* Desktop Sidebar */}
            <aside
                className="hidden md:flex md:flex-col md:w-64 border-r"
                style={{
                    backgroundColor: "var(--bg-tertiary)",
                    borderColor: "var(--border-color)",
                }}
            >
                {/* Brand Section */}
                <motion.div
                    className="p-6 border-b flex items-center justify-center gap-2"
                    style={{ borderColor: "var(--border-color)" }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <Flower size={24} style={{ color: "var(--primary)" }} className="glow-hover" />
                    <span className="text-lg font-bold" style={{ color: "var(--primary)" }}>
                        KiLan Flowers
                    </span>
                </motion.div>

                {/* Navigation Items */}
                <nav className="flex-1 p-4 flex flex-col gap-2">
                    {menuItems.map((item, index) => (
                        <motion.div
                            key={item.path}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05, duration: 0.3 }}
                        >
                            <NavLink
                                to={item.path}
                                className={({ isActive }) => `nav-item group relative ${isActive ? "active" : ""}`}
                            >
                                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                                    {item.icon}
                                </motion.div>
                                <span className="text-sm">{item.label}</span>

                                {/* Active Indicator Dot */}
                                <NavLink
                                    to={item.path}
                                    className={({ isActive }) =>
                                        isActive ? "absolute right-2 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full" : "hidden"
                                    }
                                    style={{
                                        backgroundColor: "var(--primary)",
                                    }}
                                />
                            </NavLink>
                        </motion.div>
                    ))}
                </nav>

                {/* Logout Button */}
                <motion.div
                    className="p-4 border-t"
                    style={{ borderColor: "var(--border-color)" }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <Button onClick={logout} className="w-full btn-secondary flex items-center justify-center gap-2">
                        <LogOut size={16} /> Đăng xuất
                    </Button>
                </motion.div>
            </aside>

            {/* Mobile Sidebar */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.aside
                            variants={sidebarVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="fixed inset-y-0 left-0 z-50 w-64 border-r md:hidden flex flex-col"
                            style={{
                                backgroundColor: "var(--bg-tertiary)",
                                borderColor: "var(--border-color)",
                            }}
                        >
                            {/* Mobile Header */}
                            <div
                                className="p-4 flex items-center justify-between border-b"
                                style={{ borderColor: "var(--border-color)" }}
                            >
                                <div className="flex items-center gap-2">
                                    <Flower size={24} style={{ color: "var(--primary)" }} />
                                    <span className="text-base font-bold" style={{ color: "var(--primary)" }}>
                                        KiLan
                                    </span>
                                </div>
                                <button onClick={toggleSidebar} className="p-2 hover:bg-[var(--bg-secondary)] rounded-lg transition">
                                    <X size={20} style={{ color: "var(--text-primary)" }} />
                                </button>
                            </div>

                            {/* Mobile Nav */}
                            <nav className="flex-1 p-4 flex flex-col gap-1">
                                {menuItems.map((item) => (
                                    <NavLink
                                        key={item.path}
                                        to={item.path}
                                        onClick={toggleSidebar}
                                        className={({ isActive }) => `nav-item text-sm ${isActive ? "active" : ""}`}
                                    >
                                        {item.icon}
                                        {item.label}
                                    </NavLink>
                                ))}
                            </nav>

                            {/* Mobile Logout */}
                            <div className="p-4 border-t" style={{ borderColor: "var(--border-color)" }}>
                                <Button
                                    onClick={() => {
                                        logout()
                                        toggleSidebar()
                                    }}
                                    className="w-full btn-secondary flex items-center justify-center gap-2"
                                >
                                    <LogOut size={16} /> Đăng xuất
                                </Button>
                            </div>
                        </motion.aside>

                        {/* Mobile Overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={toggleSidebar}
                            className="fixed inset-0 z-40 md:hidden bg-black/20"
                        />
                    </>
                )}
            </AnimatePresence>
        </>
    )
}
