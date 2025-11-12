"use client"

import { useState } from "react"
import { Outlet, useLocation } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import Sidebar from "./Sidebar"
import Header from "./Header"
import FloatingPetals from "../components/FloatingPetals"

export default function MainLayout() {
    const [isOpen, setIsOpen] = useState(false)
    const toggleSidebar = () => setIsOpen((prev) => !prev)
    const location = useLocation()

    return (
        <div className="flex h-screen overflow-hidden" style={{ backgroundColor: "var(--bg-primary)" }}>
            {/* Floating Petals Background Effect */}
            <FloatingPetals />

            <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col">
                <Header toggleSidebar={toggleSidebar} />

                <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                        >
                            <Outlet />
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    )
}
