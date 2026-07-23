import api from "../../middleware";

export const getAttributes = async () => {
  const response = await api.get("/attributes/get");
  return response.data;
};

export const createAttribute = async ({ name, value, desc }) => {
  console.log({ name, value, desc });
  const response = await api.post("/attributes/add", { name, value, desc });
  return response.data;
};

export const updateAttribute = async ({ id, attribute }) => {
  const { AName, ADesc, AExm } = attribute;
  const response = await api.put(`/attributes/${id}`, {
    name: AName,
    desc: ADesc,
    value: AExm,
  });
  return response.data;
};

export const deleteAttribute = async (id) => {
  const response = await api.delete(`/attributes/${id}`);
  return response.data;
};
