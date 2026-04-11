import api from "./intanceApi";

export const getCategory = async () => {
  try {
    const response = await api.get("/product/category");
    return response.data.category;
  } catch (error) {
    console.log(error);
  }
};
