import api from "./index";

export const productPage = async (ProductId) => {
  const response = await api.get(`/product/${ProductId}`);
  return response.data;
};
