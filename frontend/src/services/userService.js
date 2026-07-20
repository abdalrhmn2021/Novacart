import api from "./api";

export const userService = {
  // جلب كل المستخدمين
  getAllUsers: async (params = {}) => {
    const { data } = await api.get("/users", { params });
    return data;
  },

  // جلب مستخدم واحد بالتفصيل
  getUserById: async (id) => {
    const { data } = await api.get(`/users/${id}`);
    return data;
  },

  // تحديث بيانات مستخدم (يستخدم لتغيير الصلاحية role أو الحالة isActive أو أي حقل آخر)
  updateUser: async (id, updates) => {
    const { data } = await api.put(`/users/${id}`, updates);
    return data;
  },

  // حذف مستخدم نهائياً
  deleteUser: async (id) => {
    const { data } = await api.delete(`/users/${id}`);
    return data;
  },
};

export default userService;
