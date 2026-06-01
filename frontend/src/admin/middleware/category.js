import api from "../../middleware";

export const addCategory = async (formData) => {
  const token = localStorage.getItem("token");
  const response = await api.post("/product/category/add", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
