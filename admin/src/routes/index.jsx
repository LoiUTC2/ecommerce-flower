import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage"
// import ProductsPage from "../pages//Products/ProductsPage"
// import ProductCreatePage from "@/pages/Products/ProductCreatePage";
// import ProductEditPage from "@/pages/Products/ProductEditPage";

import CategoriesPage from "../pages/CategoriesPage"
import OrdersPage from "../pages/OrdersPage"
import CustomersPage from "../pages/CustomersPage"
import ReviewsPage from "../pages/ReviewsPage"
import ShopInfoPage from "../pages/ShopInfoPage"
import MainLayout from "../layouts/MainLayout"
import AuthLayout from "@/layouts/AuthLayout";

import { useAuth } from "../context/AuthContext";
import ProductRoutes from "./productRoutes";

function ProtectedRoute({ children }) {
    const { admin } = useAuth();
    if (!admin) return <Navigate to="/login" replace />;
    return children;
}


export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Auth routes */}
                <Route index path="/login" element={<AuthLayout><LoginPage /></AuthLayout>} />

                {/* Admin routes */}
                <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
                    {/* <Route index element={<DashboardPage />} /> */}
                    <Route path="/dashboard" element={<DashboardPage />} />
                    
                    <Route path="/*" element={<ProductRoutes />} />
                    {/* <Route path="/products" element={<ProductsPage />} />
                    <Route path="/products/create" element={<ProductCreatePage />} />
                    <Route path="/products/edit" element={<ProductEditPage />} /> */}

                    <Route path="categories" element={<CategoriesPage />} />
                    <Route path="orders" element={<OrdersPage />} />
                    <Route path="customers" element={<CustomersPage />} />
                    <Route path="reviews" element={<ReviewsPage />} />
                    <Route path="shop-info" element={<ShopInfoPage />} />
                </Route>

                {/* 404 */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </BrowserRouter>
    );
}
