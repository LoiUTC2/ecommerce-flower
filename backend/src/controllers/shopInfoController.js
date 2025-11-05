import ShopInfo from "../models/shopInfoModel.js";
import { successResponse, errorResponse } from "../utils/response.js";

// 🟢 Lấy thông tin shop (hiển thị cho khách)
export const getShopInfo = async (req, res) => {
    try {
        const shop = await ShopInfo.findOne();
        if (!shop) return errorResponse(res, "Chưa có thông tin cửa hàng", 404);
        return successResponse(res, shop);
    } catch (error) {
        return errorResponse(res, error.message);
    }
};

// 🟠 Admin tạo hoặc cập nhật thông tin shop
export const updateShopInfo = async (req, res) => {
    try {
        const data = req.body;

        // Nếu chưa có, tạo mới
        let shop = await ShopInfo.findOne();
        if (!shop) {
            shop = await ShopInfo.create(data);
            return successResponse(res, shop, "Đã tạo thông tin cửa hàng!");
        }

        Object.assign(shop, data);
        await shop.save();

        return successResponse(res, shop, "Cập nhật thông tin cửa hàng thành công!");
    } catch (error) {
        return errorResponse(res, error.message);
    }
};

// 🔴 Admin ẩn/hiện shop trên giao diện
export const toggleShopVisibility = async (req, res) => {
    try {
        const shop = await ShopInfo.findOne();
        if (!shop) return errorResponse(res, "Không tìm thấy thông tin cửa hàng", 404);

        shop.isActive = !shop.isActive;
        await shop.save();

        return successResponse(res, shop, shop.isActive ? "Cửa hàng đã được hiển thị" : "Cửa hàng đã bị ẩn");
    } catch (error) {
        return errorResponse(res, error.message);
    }
};
