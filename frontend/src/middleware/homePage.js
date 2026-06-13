import api from "./index";

export const getHomePageProduct = async (limit = 10) => {
    const response = await api.get(`/products/homepage/product-summary?limit=${limit}`);
    return response.data;
}
