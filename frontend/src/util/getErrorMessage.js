export function getErrorMessage(error) {
  if (!error) return "Something went wrong.";
  if (typeof error === "string") return error;

  const data = error?.response?.data;
  if (typeof data === "string" && data.trim()) return data;
  if (data?.error) return data.error;
  if (data?.message) return data.message;
  if (typeof data?.detail === "string" && data.detail.trim()) {
    return data.detail;
  }

  if (error?.code === "ERR_NETWORK" || error?.message === "Network Error") {
    return "You appear to be offline. Check your connection.";
  }

  if (error?.response?.status >= 500) {
    return "Our servers are having an issue. Please try again shortly.";
  }

  return error?.message || "Something went wrong. Please try again.";
}
