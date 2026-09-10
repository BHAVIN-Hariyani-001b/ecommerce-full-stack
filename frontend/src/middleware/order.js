import api from "./index";

export const createOrder = async ({ user_id, address_id }) => {
  const response = await api.post("/order/create", {
    user_id,
    address_id,
  });
  return response.data;
};

export const changeOrderStatus = async ({ status }) => {
  const response = await api.patch("/order/status/", { status });
  return response.data;
};

export const getOneOrder = async ({ user_id }) => {
  const response = await api.get("/order/get/", { user_id });
  return response.data;
};

export const getOrder = async () => {
  const response = await api.get("/order");
  return response.data;
};
