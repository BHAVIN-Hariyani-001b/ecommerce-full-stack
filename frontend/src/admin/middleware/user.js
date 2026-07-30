import api from "../../middleware";

export const fetchUser = async () => {
  const response = await api.get("/user");
  return response.data;
};

export const createUser = async ({ username, password, role, email }) => {
  const response = await api.post("/user", { username, password, role, email });
  return response.data;
};

export const updateUser = async ({ id, username, password, role, email }) => {
  const response = await api.put(`/user/${id}`, {
    username,
    password,
    role,
    email,
  });

  return response.data;
};

export const deleteUser = async (id) => {
  const response = await api.delete(`/user/${id}`);
  return response.data;
};
