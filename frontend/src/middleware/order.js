import api from "./index";

export const createOrder = async ({ user_id, address_id, payment_method }) => {
  const response = await api.post("/order/create", {
    user_id,
    address_id,
    payment_method,
  });
  return response.data;
};

export const changeOrderStatus = async ({ order_id, status }) => {
  const response = await api.patch(`/order/status/${order_id}`, { status });
  return response.data;
};

export const getOneOrder = async ({ order_id }) => {
  const response = await api.get(`/order/${order_id}`);
  return response.data;
};

export const getOrder = async ({ user_id }) => {
  const response = await api.get(`/order/get/${user_id}`);
  return response.data;
};

export const getSummary = async () => {
  const response = await api.get("/order/get/summary");
  return response.data;
};

export const generateInvoice = async (order_id) => {
  const response = await api.post(`/order/${order_id}/generate-invoice`);
  return response.data;
};

export const getGenerateInvoice = async (order_id) => {
  const response = await api.get(`/order/${order_id}/invoice/download`,{
    responseType : "blob",
  });
  console.log(response)
  return response.data;
};
