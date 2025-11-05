import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts"
import StatCard from "../components/StatCard"
import { Package, ShoppingCart, Users, TrendingUp } from "lucide-react"

export default function DashboardPage() {
    // Sample data - replace with API calls
    const chartData = [
        { month: "Jan", sales: 4000, orders: 240 },
        { month: "Feb", sales: 3000, orders: 221 },
        { month: "Mar", sales: 2000, orders: 229 },
        { month: "Apr", sales: 2780, orders: 200 },
        { month: "May", sales: 1890, orders: 229 },
        { month: "Jun", sales: 2390, orders: 200 },
    ]

    const pieData = [
        { name: "Roses", value: 35, color: "#d91e63" },
        { name: "Tulips", value: 25, color: "#ec407a" },
        { name: "Sunflowers", value: 20, color: "#f06292" },
        { name: "Other", value: 20, color: "#ad1457" },
    ]

    const recentOrders = [
        { id: 1, customer: "John Doe", amount: "$250", status: "Completed", date: "2024-01-15" },
        { id: 2, customer: "Jane Smith", amount: "$180", status: "Pending", date: "2024-01-14" },
        { id: 3, customer: "Mike Johnson", amount: "$320", status: "Completed", date: "2024-01-13" },
        { id: 4, customer: "Sarah Wilson", amount: "$95", status: "Processing", date: "2024-01-12" },
    ]

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-bold text-[--text-primary] mb-2">Dashboard</h1>
                <p className="text-[--text-muted]">Welcome back! Here's your business overview.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={ShoppingCart} label="Total Orders" value="1,234" change="+12%" changeType="up" />
                <StatCard icon={Package} label="Total Products" value="156" change="+8%" changeType="up" />
                <StatCard icon={Users} label="Total Customers" value="842" change="+5%" changeType="up" />
                <StatCard icon={TrendingUp} label="Total Revenue" value="$45,230" change="+18%" changeType="up" />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Sales Chart */}
                <div className="lg:col-span-2 card">
                    <h2 className="text-xl font-bold text-[--text-primary] mb-4">Sales Overview</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                            <XAxis stroke="var(--text-muted)" />
                            <YAxis stroke="var(--text-muted)" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "var(--surface)",
                                    border: "1px solid var(--border)",
                                    borderRadius: "8px",
                                }}
                            />
                            <Legend />
                            <Bar dataKey="sales" fill="var(--primary)" radius={[8, 8, 0, 0]} />
                            <Bar dataKey="orders" fill="var(--accent)" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Product Distribution */}
                <div className="card">
                    <h2 className="text-xl font-bold text-[--text-primary] mb-4">Product Mix</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "var(--surface)",
                                    border: "1px solid var(--border)",
                                    borderRadius: "8px",
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Recent Orders */}
            <div className="card">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-[--text-primary]">Recent Orders</h2>
                    <button className="text-[--primary] hover:text-[--primary-light] text-sm font-medium">View All →</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-[--border]">
                                <th className="text-left py-3 px-4 font-semibold text-[--text-secondary]">Customer</th>
                                <th className="text-left py-3 px-4 font-semibold text-[--text-secondary]">Amount</th>
                                <th className="text-left py-3 px-4 font-semibold text-[--text-secondary]">Status</th>
                                <th className="text-left py-3 px-4 font-semibold text-[--text-secondary]">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentOrders.map((order) => (
                                <tr key={order.id} className="border-b border-[--border] hover:bg-[--surface-light] transition-colors">
                                    <td className="py-3 px-4 text-[--text-primary]">{order.customer}</td>
                                    <td className="py-3 px-4 text-[--text-primary] font-semibold">{order.amount}</td>
                                    <td className="py-3 px-4">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-medium ${order.status === "Completed"
                                                    ? "bg-green-900 text-green-200"
                                                    : order.status === "Processing"
                                                        ? "bg-blue-900 text-blue-200"
                                                        : "bg-yellow-900 text-yellow-200"
                                                }`}
                                        >
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-[--text-muted]">{order.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
