export function getErrorMessage(error) {
  if (!error) return "Something went wrong.";
  if (typeof error === "string") return error;
  if (error?.status === 0 || error?.message === "Network Error") {
    return "You appear to be offline. Check your connection.";
  }
  if (error?.status >= 500) {
    return "Our servers are having an issue. Please try again shortly.";
  }
  return error?.message || "Something went wrong. Please try again.";
}
