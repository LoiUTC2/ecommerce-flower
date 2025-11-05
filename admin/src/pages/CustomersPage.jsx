"use client"

import { useState } from "react"
import { Search, Mail, Phone, Eye } from "lucide-react"

export default function CustomersPage() {
    const [customers, setCustomers] = useState([
        { id: 1, name: "John Doe", email: "john@example.com", phone: "+1-234-567-8900", orders: 12, spent: "$2,450" },
        { id: 2, name: "Jane Smith", email: "jane@example.com", phone: "+1-234-567-8901", orders: 8, spent: "$1,680" },
        { id: 3, name: "Mike Johnson", email: "mike@example.com", phone: "+1-234-567-8902", orders: 15, spent: "$3,120" },
        { id: 4, name: "Sarah Wilson", email: "sarah@example.com", phone: "+1-234-567-8903", orders: 5, spent: "$890" },
        { id: 5, name: "Tom Brown", email: "tom@example.com", phone: "+1-234-567-8904", orders: 20, spent: "$4,250" },
    ])

    const [searchTerm, setSearchTerm] = useState("")

    const filteredCustomers = customers.filter(
        (c) =>
            c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.email.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-[--text-primary]">Customers</h1>
                <p className="text-[--text-muted] mt-1">Manage customer accounts and orders</p>
            </div>

            <div className="card">
                <div className="relative mb-6">
                    <Search size={18} className="absolute left-3 top-3 text-[--text-muted]" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="input-field pl-10"
                    />
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-[--border]">
                                <th className="text-left py-3 px-4 font-semibold text-[--text-secondary]">Name</th>
                                <th className="text-left py-3 px-4 font-semibold text-[--text-secondary]">Email</th>
                                <th className="text-left py-3 px-4 font-semibold text-[--text-secondary]">Phone</th>
                                <th className="text-left py-3 px-4 font-semibold text-[--text-secondary]">Orders</th>
                                <th className="text-left py-3 px-4 font-semibold text-[--text-secondary]">Total Spent</th>
                                <th className="text-left py-3 px-4 font-semibold text-[--text-secondary]">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCustomers.map((customer) => (
                                <tr key={customer.id} className="border-b border-[--border] hover:bg-[--surface-light]">
                                    <td className="py-3 px-4 text-[--text-primary] font-medium">{customer.name}</td>
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-2 text-[--text-secondary]">
                                            <Mail size={16} />
                                            {customer.email}
                                        </div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-2 text-[--text-secondary]">
                                            <Phone size={16} />
                                            {customer.phone}
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 text-[--text-secondary]">{customer.orders}</td>
                                    <td className="py-3 px-4 text-[--text-primary] font-semibold">{customer.spent}</td>
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
