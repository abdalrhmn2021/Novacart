import api from "./api";

export const getCategories = async () => {
  const response = await api.get("/categories");

  return response.data;
};