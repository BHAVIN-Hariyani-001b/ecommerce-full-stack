import api from "./index";

export const wishProductFetch = async (id) => {
  const response = await api.get(`/wishlist/${id}`);
  return response.data;
};

export const wishListAdd = async ({ user_id, product_id }) => {
  const response = await api.post("/wishlist/add", { user_id, product_id });
  return response.data;
};

export const wishListRemove = async (id) => {
  const response = await api.delete(`/wishlist/remove/${id}`);
  return response.data;
};
