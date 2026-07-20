import api from "@/services/api";

export const uploadService = {
  async uploadImage(file) {
    const formData = new FormData();
    formData.append("image", file);

    const res = await api.post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.url;
  },
};