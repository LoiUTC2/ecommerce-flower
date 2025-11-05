export default function StatCard({ icon: Icon, label, value, change, changeType = "up" }) {
    const isPositive = changeType === "up"

    return (
        <div className="card">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-[--text-muted] text-sm mb-2">{label}</p>
                    <h3 className="text-3xl font-bold text-[--text-primary] mb-3">{value}</h3>
                    <p className={`text-sm ${isPositive ? "text-[--success]" : "text-[--error]"}`}>
                        {change} {isPositive ? "↑" : "↓"} from last month
                    </p>
                </div>
                <div className="p-3 bg-[--surface-light] rounded-lg">
                    <Icon size={24} className="text-[--primary]" />
                </div>
            </div>
        </div>
    )
}
