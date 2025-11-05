import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import DashboardPage from "../pages/DashboardPage"
import ProductsPage from "../pages/ProductsPage"
import CategoriesPage from "../pages/CategoriesPage"
import OrdersPage from "../pages/OrdersPage"
import CustomersPage from "../pages/CustomersPage"
import ReviewsPage from "../pages/ReviewsPage"
import ShopInfoPage from "../pages/ShopInfoPage"
import MainLayout from "../layouts/MainLayout"

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Auth routes */}
                {/* <Route path="/login" element={<AuthLayout><LoginPage /></AuthLayout>} /> */}

                {/* Admin routes */}
                <Route element={<MainLayout />}>
                    <Route index element={<DashboardPage />} />
                    <Route path="products" element={<ProductsPage />} />
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
