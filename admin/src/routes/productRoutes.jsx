import { Routes, Route } from "react-router-dom";
import ProductsPage from "@/pages/Products/ProductsPage";
import ProductDetailPage from "@/pages/Products/ProductDetailPage";
import ProductCreatePage from "@/pages/Products/ProductCreatePage";
import ProductEditPage from "@/pages/Products/ProductEditPage";

export default function ProductRoutes() {
    return (
        <Routes>
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:slug" element={<ProductDetailPage />} />
            <Route path="/products/create" element={<ProductCreatePage />} />
            <Route path="/products/edit/:slug" element={<ProductEditPage />} />
        </Routes>
    );
}
