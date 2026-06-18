import api from "./index";

export const searchProduct = async (query) => {
  const response = await api.post("/search", { query });
  return response.data;
};
