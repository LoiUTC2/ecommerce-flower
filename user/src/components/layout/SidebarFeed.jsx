import React from "react";
import { Home, Users, Bookmark, Bell } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function SidebarFeed() {
    const links = [
        { to: "/", icon: <Home size={18} />, label: "Bảng tin" },
        { to: "/friends", icon: <Users size={18} />, label: "Bạn bè" },
        { to: "/notifications", icon: <Bell size={18} />, label: "Thông báo" },
        { to: "/saved", icon: <Bookmark size={18} />, label: "Đã lưu" },
    ];

    return (
        <div className="p-4 space-y-2">
            {links.map((link) => (
                <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium hover:bg-muted ${isActive ? "bg-muted text-primary" : "text-muted-foreground"
                        }`
                    }
                >
                    {link.icon}
                    {link.label}
                </NavLink>
            ))}
        </div>
    );
}
