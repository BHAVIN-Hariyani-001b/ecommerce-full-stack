import api from "../../middleware";

export const getProduct = async () => {
  const response = await api.get("/product");
  return response.data;
};

export const productAdd = async (formData) => {
  const response = await api.post("/product/add", formData);
  return response.data;
};

export const updateProduct = async (id, formData) => {
  const response = await api.put(`/product/update/${id}`, formData);
  return response.data;
};
