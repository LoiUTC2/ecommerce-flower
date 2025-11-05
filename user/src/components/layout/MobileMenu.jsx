import React from "react";
import { Home, ShoppingBag, Bell, User } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function MobileMenu() {
    const links = [
        { to: "/", icon: <Home size={20} /> },
        { to: "/shop", icon: <ShoppingBag size={20} /> },
        { to: "/notifications", icon: <Bell size={20} /> },
        { to: "/profile", icon: <User size={20} /> },
    ];

    return (
        <nav className="bg-background border-t flex justify-around py-2">
            {links.map((l) => (
                <NavLink
                    key={l.to}
                    to={l.to}
                    className={({ isActive }) =>
                        `p-2 rounded-lg ${isActive ? "text-primary" : "text-muted-foreground"
                        }`
                    }
                >
                    {l.icon}
                </NavLink>
            ))}
        </nav>
    );
}
