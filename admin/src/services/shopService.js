import api from "../utils/api";

export const getShopInfo = () => api.get("/shop");
export const updateShopInfo = (data) => api.put("/shop", data);
export const toggleShop = () => api.patch("/shop/toggle");
