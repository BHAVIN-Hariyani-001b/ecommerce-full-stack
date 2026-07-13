import api from "../../middleware/index";

export const getBrandAPI = async () => {
  const response = await api.get("/brand");
  return response.data;
};

export const addBrandAPI = async (formData) => {
  const response = await api.post("/brand", formData);
  return response.data;
};

export const updateBrandAPI = async (id, formData) => {
  const response = await api.put(`/brand/${id}`, formData);
  return response.data;
};

export const deleteBrandAPI = async (id) => {
  const response = await api.delete(`/brand/${id}`);
  return response.data;
};
