import api from "./index";

export const searchProduct = async ({ query, filterData }) => {
  const response = await api.post("/search", { query, filterData });
  return response.data;
};
