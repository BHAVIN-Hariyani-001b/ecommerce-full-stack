import api from "../../middleware";

export const addCategoryAPI = async (formData) => {
  const response = await api.post("/product/category/add", formData);
  return response.data;
};

export const updateCategoryAPI = async (id, formData) => {
 const response = await api.put(`/product/category/update/${id}`, formData);
  return response.data;
};

export const deleteCategoryAPI = async (id) => {
 const response = await api.delete(`/product/category/delete/${id}`);
  return response.data;
};
