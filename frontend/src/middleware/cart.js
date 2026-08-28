import api from "./index";

export const fetchCart = async ({ user_id }) => {
  const response = await api.get(`/cart/${user_id}`);
  return response.data;
};

export const addCart = async ({
  user_id,
  product_id,
  attributes_value_ids,
  qty = 1,
}) => {
      console.log(attributes_value_ids)
  const response = await api.post("/add/cart", {
    user_id,
    product_id,
    attributes_value_ids,
    qty,
  });
  return response.data;
};

export const incrementCartProduct = async ({ cart_id }) => {
  const response = await api.patch(`/cart/increment/${cart_id}`);
  return response.data;
};

export const decrementCartProduct = async ({ cart_id }) => {
  const response = await api.patch(`/cart/decrement/${cart_id}`);
  return response.data;
};
