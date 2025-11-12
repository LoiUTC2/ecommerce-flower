"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Flower, ShoppingBag, Users, Star, TrendingUp } from "lucide-react"
import { motion } from "framer-motion"

export default function DashboardPage() {
    const stats = [
        {
            label: "Tổng sản phẩm",
            value: 42,
            icon: <Flower className="w-6 h-6" />,
            color: "--primary",
            trend: "+5%",
        },
        {
            label: "Đơn hàng hôm nay",
            value: 15,
            icon: <ShoppingBag className="w-6 h-6" />,
            color: "--accent-mint",
            trend: "+12%",
        },
        {
            label: "Khách hàng mới",
            value: 8,
            icon: <Users className="w-6 h-6" />,
            color: "--accent-lavender",
            trend: "+3%",
        },
        {
            label: "Đánh giá trung bình",
            value: "4.8",
            icon: <Star className="w-6 h-6" />,
            color: "--accent-peach",
            trend: "+0.2",
        },
    ]

    const recentOrders = [
        {
            id: "ORD001",
            customer: "Nguyễn Văn A",
            product: "Bó hoa hồng đỏ",
            amount: "250,000đ",
            status: "Đã giao",
        },
        {
            id: "ORD002",
            customer: "Trần Thị B",
            product: "Bó hoa tulip",
            amount: "180,000đ",
            status: "Đang chuẩn bị",
        },
        {
            id: "ORD003",
            customer: "Lê Văn C",
            product: "Hoa cắm bình",
            amount: "320,000đ",
            status: "Chờ xác nhận",
        },
    ]

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.2 },
        },
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: "easeOut" },
        },
    }

    return (
        <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible">
            {/* Welcome Banner */}
            <motion.div
                variants={itemVariants}
                className="card-elevated bg-gradient-to-br rounded-2xl p-8 overflow-hidden relative"
                style={{
                    background: `linear-gradient(135deg, var(--primary-lighter) 0%, var(--accent-lavender) 100%)`,
                }}
            >
                <div className="relative z-10">
                    <motion.h1
                        className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-2"
                        style={{ color: "var(--primary-dark)" }}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Flower className="w-8 h-8" />
                        Chào mừng quay lại! 🌷
                    </motion.h1>
                    <p style={{ color: "var(--primary-dark)" }} className="opacity-80">
                        Hôm nay là một ngày tuyệt vời để quản lý shop hoa của bạn
                    </p>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 text-6xl opacity-10">🌸</div>
                <div className="absolute bottom-0 left-1/4 text-5xl opacity-10">🌹</div>
            </motion.div>

            {/* Stats Grid */}
            <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" variants={containerVariants}>
                {stats.map((stat, index) => (
                    <motion.div key={stat.label} variants={itemVariants}>
                        <Card
                            className="card-elevated group cursor-pointer"
                            style={{
                                backgroundColor: "var(--bg-tertiary)",
                            }}
                        >
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                                    {stat.label}
                                </CardTitle>
                                <motion.div
                                    whileHover={{ rotate: 10, scale: 1.1 }}
                                    style={{
                                        color: `var(${stat.color})`,
                                    }}
                                >
                                    {stat.icon}
                                </motion.div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-end justify-between">
                                    <div>
                                        <p className="text-2xl md:text-3xl font-bold" style={{ color: "var(--text-primary)" }}>
                                            {stat.value}
                                        </p>
                                        <p className="text-xs mt-1 flex items-center gap-1" style={{ color: "var(--success)" }}>
                                            <TrendingUp size={12} /> {stat.trend}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </motion.div>

            {/* Recent Orders */}
            <motion.div variants={itemVariants}>
                <Card className="card-elevated" style={{ backgroundColor: "var(--bg-tertiary)" }}>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                            <ShoppingBag size={20} style={{ color: "var(--primary)" }} />
                            Đơn hàng gần đây
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr style={{ borderBottomColor: "var(--border-color)" }} className="border-b">
                                        <th className="text-left py-3 px-2 text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                                            ID đơn
                                        </th>
                                        <th className="text-left py-3 px-2 text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                                            Khách hàng
                                        </th>
                                        <th className="text-left py-3 px-2 text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                                            Sản phẩm
                                        </th>
                                        <th className="text-left py-3 px-2 text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                                            Giá trị
                                        </th>
                                        <th className="text-left py-3 px-2 text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                                            Trạng thái
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentOrders.map((order) => (
                                        <motion.tr
                                            key={order.id}
                                            whileHover={{ backgroundColor: "var(--bg-secondary)" }}
                                            style={{ borderBottomColor: "var(--border-color)" }}
                                            className="border-b transition-colors"
                                        >
                                            <td className="py-3 px-2 text-sm font-medium" style={{ color: "var(--primary)" }}>
                                                {order.id}
                                            </td>
                                            <td className="py-3 px-2 text-sm" style={{ color: "var(--text-primary)" }}>
                                                {order.customer}
                                            </td>
                                            <td className="py-3 px-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                                                {order.product}
                                            </td>
                                            <td className="py-3 px-2 text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                                                {order.amount}
                                            </td>
                                            <td className="py-3 px-2">
                                                <span
                                                    className="badge-primary text-xs"
                                                    style={{
                                                        backgroundColor:
                                                            order.status === "Đã giao"
                                                                ? "rgba(16, 185, 129, 0.1)"
                                                                : order.status === "Đang chuẩn bị"
                                                                    ? "rgba(245, 158, 11, 0.1)"
                                                                    : "rgba(217, 70, 166, 0.1)",
                                                        color:
                                                            order.status === "Đã giao"
                                                                ? "var(--success)"
                                                                : order.status === "Đang chuẩn bị"
                                                                    ? "var(--warning)"
                                                                    : "var(--primary)",
                                                    }}
                                                >
                                                    {order.status}
                                                </span>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    )
}
