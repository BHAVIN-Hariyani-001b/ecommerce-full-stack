import api from "../../middleware";

export const productAdd = async ({ formData, token }) => {
  const response = await api.post("/product/add", formData, {
    headers: { 
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
