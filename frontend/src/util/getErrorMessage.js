export function getErrorMessage(error) {
  if (!error) return "Something went wrong.";

  const errorText = typeof error === "string" ? error : error?.message;
  const status = error?.response?.status;

  if (
    error?.code === "ECONNABORTED" ||
    error?.code === "ETIMEDOUT" ||
    /timeout|timed out/i.test(errorText || "")
  ) {
    return "The request took too long. Please check your connection and try again.";
  }

  if (error?.code === "ERR_NETWORK" || errorText === "Network Error") {
    return "You appear to be offline. Check your connection and try again.";
  }

  if (status === 408) {
    return "The server took too long to respond. Please try again.";
  }

  if (status === 429) {
    return "Too many requests. Please wait a moment and try again.";
  }

  if (status >= 500) {
    return "Our servers are temporarily unavailable. Please try again shortly.";
  }

  if (status === 401) {
    return "Your session has expired. Please login again.";
  }

  if (status === 403) {
    return "You do not have permission to complete this request.";
  }

  if (status === 404) {
    return "The requested service could not be found. Please try again later.";
  }

  if (typeof error === "string") return error;

  const data = error?.response?.data;
  if (data?.error) return data.error;
  if (data?.message) return data.message;
  if (typeof data?.detail === "string" && data.detail.trim()) {
    return data.detail;
  }

  return errorText || "Something went wrong. Please try again.";
}
