import { Outlet } from "react-router-dom"
import Sidebar from "../components/Sidebar"

export default function MainLayout() {
    return (
        <div className="flex h-screen bg-[--background]">
            <Sidebar />
            <div className="flex-1 overflow-auto">
                <div className="p-8">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}
