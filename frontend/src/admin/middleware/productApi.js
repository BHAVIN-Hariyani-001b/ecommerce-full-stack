import api from "../../middleware";

export const getProductRequest = async () => {
  const response = await api.get("/product");
  return response.data;
};

export const addProductRequest = async (formData) => {
  const response = await api.post("/product/add", formData);
  return response.data;
};

export const updateProductRequest = async (id, formData) => {
  const response = await api.put(`/product/update/${id}`, formData);
  return response.data;
};

export const deleteProductRequest = async (id) => {
  const response = await api.delete(`/product/delete/${id}`);
  return response.data;
};
