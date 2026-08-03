import api from "../middleware/index.js";

export const getReviews = async (productId) => {
  const response = await api.get(`/product_review/${productId}`);
  return response.data;
};

export const addReview = async (reviewData) => {
  const response = await api.post("/product_review", reviewData);
  return response.data;
};

export const updateReview = async ({ reviewId, reviewData }) => {
  const response = await api.put(`/product_review/${reviewId}`, reviewData);
  return response.data;
};

export const deleteReview = async (reviewId) => {
  const response = await api.delete(`/product_review/${reviewId}`);
  return response.data;
};
