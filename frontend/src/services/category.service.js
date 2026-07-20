// ضع هذا الملف مكان: frontend/src/services/category.service.js
// نسختك الحالية فيها getCategories بس. أضفنا باقي عمليات الـ CRUD
// عشان تقدر تبني عليها صفحة إدارة الكاتيجوري بلوحة التحكم.

import api from "./api";

export const getCategories = async () => {
  const response = await api.get("/categories");
  return response.data;
};

export const getCategoryById = async (id) => {
  const response = await api.get(`/categories/${id}`);
  return response.data;
};

export const createCategory = async (payload) => {
  const response = await api.post("/categories", payload);
  return response.data;
};

export const updateCategory = async (id, payload) => {
  const response = await api.put(`/categories/${id}`, payload);
  return response.data;
};

export const deleteCategory = async (id) => {
  const response = await api.delete(`/categories/${id}`);
  return response.data;
};

// اختياري: نفس الأسلوب المستخدم بـ productService (كائن واحد يلم كل الدوال)
export const categoryService = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
