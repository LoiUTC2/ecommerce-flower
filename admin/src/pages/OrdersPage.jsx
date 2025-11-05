"use client"

import { useState } from "react"
import { Search, Eye, Download } from "lucide-react"

export default function OrdersPage() {
    const [orders, setOrders] = useState([
        { id: "ORD-001", customer: "John Doe", amount: "$250", status: "Completed", items: 3, date: "2024-01-15" },
        { id: "ORD-002", customer: "Jane Smith", amount: "$180", status: "Pending", items: 2, date: "2024-01-14" },
        { id: "ORD-003", customer: "Mike Johnson", amount: "$320", status: "Completed", items: 5, date: "2024-01-13" },
        { id: "ORD-004", customer: "Sarah Wilson", amount: "$95", status: "Processing", items: 1, date: "2024-01-12" },
        { id: "ORD-005", customer: "Tom Brown", amount: "$450", status: "Completed", items: 4, date: "2024-01-11" },
    ])

    const [searchTerm, setSearchTerm] = useState("")

    const filteredOrders = orders.filter(
        (o) =>
            o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            o.customer.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    const statusColor = (status) => {
        switch (status) {
            case "Completed":
                return "bg-green-900 text-green-200"
            case "Processing":
                return "bg-blue-900 text-blue-200"
            case "Pending":
                return "bg-yellow-900 text-yellow-200"
            default:
                return "bg-gray-900 text-gray-200"
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-[--text-primary]">Orders</h1>
                    <p className="text-[--text-muted] mt-1">Manage customer orders</p>
                </div>
                <button className="btn-primary flex items-center gap-2">
                    <Download size={20} />
                    Export
                </button>
            </div>

            <div className="card">
                <div className="relative mb-6">
                    <Search size={18} className="absolute left-3 top-3 text-[--text-muted]" />
                    <input
                        type="text"
                        placeholder="Search by order ID or customer name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="input-field pl-10"
                    />
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-[--border]">
                                <th className="text-left py-3 px-4 font-semibold text-[--text-secondary]">Order ID</th>
                                <th className="text-left py-3 px-4 font-semibold text-[--text-secondary]">Customer</th>
                                <th className="text-left py-3 px-4 font-semibold text-[--text-secondary]">Items</th>
                                <th className="text-left py-3 px-4 font-semibold text-[--text-secondary]">Amount</th>
                                <th className="text-left py-3 px-4 font-semibold text-[--text-secondary]">Status</th>
                                <th className="text-left py-3 px-4 font-semibold text-[--text-secondary]">Date</th>
                                <th className="text-left py-3 px-4 font-semibold text-[--text-secondary]">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.map((order) => (
                                <tr key={order.id} className="border-b border-[--border] hover:bg-[--surface-light]">
                                    <td className="py-3 px-4 text-[--text-primary] font-semibold">{order.id}</td>
                                    <td className="py-3 px-4 text-[--text-secondary]">{order.customer}</td>
                                    <td className="py-3 px-4 text-[--text-secondary]">{order.items}</td>
                                    <td className="py-3 px-4 text-[--text-primary] font-semibold">{order.amount}</td>
                                    <td className="py-3 px-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-[--text-muted]">{order.date}</td>
                                    <td className="py-3 px-4">
                                        <button className="p-2 hover:bg-[--surface-light] rounded transition-colors">
                                            <Eye size={18} className="text-[--primary]" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
