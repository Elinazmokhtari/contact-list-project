export default function getApiHeaders(isFormData = false) {
  const token = localStorage.getItem("token");
  const headers = {
    Accept: "application/json",
    authorization: `Bearer ${token}`,
  };

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
}
