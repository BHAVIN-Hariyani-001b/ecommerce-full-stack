import api from "../../middleware/index";

export const getGstOne = async (gst_id) => {
  const response = await api.get(`/gst/${gst_id}`);
  return response.data;
};

export const getGst = async () => {
  const response = await api.get("/gst/get");
  return response.data;
};

export const createGst = async ({ gst_rate }) => {
  const response = await api.post("/create/gst", { gst_rate });
  return response.data;
};

export const updateGst = async ({ gst_id, gst_rate, is_active }) => {
  const response = await api.put(`/edit/gst/${gst_id}`, {
    gst_rate,
    is_active,
  });

  return response;
};

export const deleteGst = async (gst_id) => {
  const response = await api.delete(`/delete/gst/${gst_id}`);
  return response.data;
};
