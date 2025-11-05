import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
// import ShopPage from "../pages/Shop/ShopPage";
// import ProductDetailPage from "../pages/Product/ProductDetailPage";
// import CartPage from "../pages/Cart/CartPage";
// import FeedPage from "../pages/Feed/FeedPage";
// import LoginPage from "../pages/Auth/LoginPage";
// import RegisterPage from "../pages/Auth/RegisterPage";
// import ForgotPasswordPage from "../pages/Auth/ForgotPasswordPage";
import LayoutMain from "../components/layout/LayoutMain";

export default function AppRoutes() {
    return (
        <Routes>
            <Route element={<LayoutMain />}>
                <Route path="/" element={<HomePage />} />
                {/* <Route path="/shop" element={<ShopPage />} />
                <Route path="/product/:id" element={<ProductDetailPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/feed" element={<FeedPage />} /> */}
            </Route>

            {/* Auth routes tách riêng */}
            {/* <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} /> */}
        </Routes>
    );
}
