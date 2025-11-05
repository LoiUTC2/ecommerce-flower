import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import { successResponse, errorResponse } from "../utils/response.js";

// 🧾 Tổng quan chung (dashboard header), Tổng doanh thu, đơn hàng, sản phẩm, hủy
export const getSummaryStats = async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments();
        const totalRevenue = await Order.aggregate([
            { $match: { status: { $in: ["completed", "delivering"] } } },
            { $group: { _id: null, total: { $sum: "$totalAmount" } } },
        ]);

        const totalProducts = await Product.countDocuments({ isActive: true });

        const completedOrders = await Order.countDocuments({ status: "completed" });
        const cancelledOrders = await Order.countDocuments({ status: "cancelled" });

        return successResponse(res, {
            totalOrders,
            completedOrders,
            cancelledOrders,
            totalRevenue: totalRevenue[0]?.total || 0,
            totalProducts,
        });
    } catch (error) {
        return errorResponse(res, error.message);
    }
};

// 📅 Thống kê doanh thu theo ngày (7 ngày gần nhất)
export const getRevenueByDay = async (req, res) => {
    try {
        const last7Days = await Order.aggregate([
            {
                $match: {
                    status: { $in: ["completed", "delivering"] },
                    createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
                },
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    totalRevenue: { $sum: "$totalAmount" },
                    totalOrders: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        return successResponse(res, last7Days);
    } catch (error) {
        return errorResponse(res, error.message);
    }
};

// 📆 Thống kê doanh thu theo tháng (12 tháng gần nhất)
export const getRevenueByMonth = async (req, res) => {
    try {
        const last12Months = await Order.aggregate([
            {
                $match: {
                    status: { $in: ["completed", "delivering"] },
                    createdAt: {
                        $gte: new Date(new Date().setMonth(new Date().getMonth() - 12)),
                    },
                },
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" },
                    },
                    totalRevenue: { $sum: "$totalAmount" },
                    totalOrders: { $sum: 1 },
                },
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } },
        ]);

        return successResponse(res, last12Months);
    } catch (error) {
        return errorResponse(res, error.message);
    }
};

// 💐 Sản phẩm bán chạy nhất (top 5)
export const getTopProducts = async (req, res) => {
    try {
        const topProducts = await Order.aggregate([
            { $unwind: "$items" },
            {
                $group: {
                    _id: "$items.product",
                    totalSold: { $sum: "$items.quantity" },
                },
            },
            { $sort: { totalSold: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "_id",
                    as: "product",
                },
            },
            { $unwind: "$product" },
            {
                $project: {
                    _id: 0,
                    productId: "$product._id",
                    name: "$product.name",
                    image: { $first: "$product.images" },
                    totalSold: 1,
                },
            },
        ]);

        return successResponse(res, topProducts);
    } catch (error) {
        return errorResponse(res, error.message);
    }
};

// 📊 Thống kê trạng thái đơn hàng
export const getOrderStatusStats = async (req, res) => {
    try {
        const statusStats = await Order.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 },
                },
            },
        ]);

        return successResponse(res, statusStats);
    } catch (error) {
        return errorResponse(res, error.message);
    }
};
