import React from "react";
import { Outlet } from "react-router-dom";
import HeaderMain from "./Header";
import FooterMain from "./Footer";

export default function LayoutMain() {
    return (
        <div className="flex flex-col min-h-screen">
            <HeaderMain />
            <main className="flex-1">
                <Outlet />
            </main>
            <FooterMain />
        </div>
    );
}
