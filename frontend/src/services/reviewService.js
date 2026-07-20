import api from "@/services/api";

export const reviewService = {
  async getProductReviews(productId) {
    const res = await api.get(`/reviews/product/${productId}`);
    return res.data;
  },

  async createReview(productId, rating, comment) {
    const res = await api.post(`/reviews/product/${productId}`, {
      rating,
      comment,
    });
    return res.data;
  },

  async deleteReview(reviewId) {
    return api.delete(`/reviews/${reviewId}`);
  },
};