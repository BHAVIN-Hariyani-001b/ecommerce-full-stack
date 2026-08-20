import api from "./index";

export const AddressGet = async (id) => {
  const response = await api.get(`/address/${id}`);
  return response.data;
};

export const AddAddress = async ({ user_id, AddressData }) => {
  const { name, address, city, state, pin, phone } = AddressData;
  const response = await api.post("/address/", {
    user_id,
    username: name,
    streetArea: address,
    city,
    state,
    pin_code: pin,
    phone: phone,
  });

  return response.data;
};

export const UpdateAddress = async ({ id, AddressData }) => {
  const { name, address, city, state, pin, phone } = AddressData;
  const response = await api.put(`/address/${id}`, {
    username: name,
    streetArea: address,
    city,
    state,
    pin_code: pin,
    phone: phone,
  });

  return response.data;
};

export const DeleteAddress = async (id) => {
  const response = await api.delete(`/address/${id}`);
  return response.data;
};
