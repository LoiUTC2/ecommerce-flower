import api from "../utils/api";

export const getShopReviews = () => api.get("/shop/reviews");
export const replyToReview = (id, content) => api.post(`/shop/reviews/${id}/reply`, { content });
