import api from "../middleware/index.js";

export const getReviews = async (productId) => {
  const response = await api.get(`/product_review/${productId}`);
  return response.data;
};

export const addReview = async ({
  user_id,
  product_id,
  product_rating,
  comment,
}) => {
  const response = await api.post("/product_review", {
    user_id,
    product_id,
    product_rating,
    comment,
  });
  return response.data;
};

export const updateReview = async ({ reviewId, reviewData }) => {
  const { comment, product_rating } = reviewData;
  const response = await api.put(`/product_review/${reviewId}`, {
    comment,
    product_rating,
  });
  return response.data;
};

export const deleteReview = async ({ reviewId, user_id }) => {
  const response = await api.delete(`/product_review/${reviewId}`, {
    data: { user_id },
  });
  return response.data;
};
