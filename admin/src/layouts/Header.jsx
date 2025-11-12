"use client"

import { motion } from "framer-motion"
import { Menu, Sun, Moon } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { useAuth } from "../context/AuthContext"
import { useState, useEffect } from "react"

export default function Header({ toggleSidebar }) {
    const { admin } = useAuth()
    const [isDark, setIsDark] = useState(() => {
        // Kiểm tra localStorage hoặc system preference
        const saved = localStorage.getItem('theme')
        if (saved) return saved === 'dark'
        return window.matchMedia('(prefers-color-scheme: dark)').matches
    })

    useEffect(() => {
        // Áp dụng theme vào document
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
        localStorage.setItem('theme', isDark ? 'dark' : 'light')
    }, [isDark])

    const toggleTheme = () => {
        setIsDark(!isDark)
    }

    return (
        <motion.header
            className="flex items-center justify-between px-4 md:px-6 py-4 border-b sticky top-0 z-40"
            style={{
                backgroundColor: "var(--bg-tertiary)",
                borderColor: "var(--border-color)",
            }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <div className="flex items-center gap-3">
                <motion.button
                    onClick={toggleSidebar}
                    className="md:hidden p-2 hover:bg-[var(--bg-secondary)] rounded-lg transition"
                    whileTap={{ scale: 0.95 }}
                >
                    <Menu size={22} style={{ color: "var(--primary)" }} />
                </motion.button>

                <h2 className="text-lg md:text-xl font-bold hidden sm:block" style={{ color: "var(--primary)" }}>
                    Bảng quản trị Shop Hoa
                </h2>
            </div>

            <div className="flex items-center gap-4">
                <motion.button
                    onClick={toggleTheme}
                    className="p-2 hover:bg-[var(--bg-secondary)] rounded-lg transition"
                    whileTap={{ scale: 0.95 }}
                    aria-label="Toggle theme"
                >
                    {isDark ? (
                        <Sun size={20} style={{ color: "var(--primary)" }} />
                    ) : (
                        <Moon size={20} style={{ color: "var(--primary)" }} />
                    )}
                </motion.button>

                <motion.div className="flex items-center gap-2" whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
                    <div className="hidden sm:block text-right">
                        <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                            {admin?.name || "Admin"}
                        </p>
                        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                            Quản trị viên
                        </p>
                    </div>
                    <Avatar className="h-10 w-10 border-2" style={{ borderColor: "var(--primary-light)" }}>
                        <AvatarImage src={admin?.avatar || "/placeholder.svg"} alt={admin?.name} />
                        <AvatarFallback style={{ backgroundColor: "var(--primary-lighter)", color: "var(--primary-dark)" }}>
                            {admin?.name?.[0] || "A"}
                        </AvatarFallback>
                    </Avatar>
                </motion.div>
            </div>
        </motion.header>
    )
}