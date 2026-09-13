import api from "../../middleware";

export const paymentReportDataGet = async (filters = {}) => {
  const params = {};
  const { start_date, end_date, status, method, limit } = filters;

  if (start_date) params.start_date = start_date;
  if (end_date) params.end_date = end_date;
  if (status) params.status = status;
  if (method) params.method = method;
  if (limit) params.limit = limit;

  const response = await api.get("/report/payments", { params });
  return response.data;
};

export const paymentDataGet = async () => {
  const response = await api.get("/get/payments");
  return response.data;
};

export const paymentStatusChange = async ({ id, status }) => {
  const response = await api.post(`/change/status/payment/${id}`, { status });
  return response.data;
};
