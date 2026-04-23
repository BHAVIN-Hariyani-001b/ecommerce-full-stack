import api from "./index.js";

export const getCategory = async () => {
  const response = await api.get("/product/category");
  return response?.data?.category ?? [];
};

