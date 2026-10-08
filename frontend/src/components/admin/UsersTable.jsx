"use client";

import { useState } from "react";

export default function UsersTable({ users, onRoleChange, onToggleStatus, onDelete }) {
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  if (!users || users.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400 font-body">
        لا يوجد مستخدمون لعرضهم
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-[#c69749]/20">
      <table className="w-full text-right font-body">
        <thead className="bg-[#1a1a1a] text-[#c69749] font-display">
          <tr>
            <th className="p-4">الاسم</th>
            <th className="p-4">البريد الإلكتروني</th>
            <th className="p-4">الهاتف</th>
            <th className="p-4">الصلاحية</th>
            <th className="p-4">الحالة</th>
            <th className="p-4">تاريخ الانضمام</th>
            <th className="p-4">إجراءات</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user._id}
              className="border-t border-[#c69749]/10 hover:bg-[#1a1a1a]/60 transition-colors"
            >
              <td className="p-4 text-white">
                {user.firstName} {user.lastName}
              </td>
              <td className="p-4 text-gray-300">{user.email}</td>
              <td className="p-4 text-gray-400">{user.phone || "—"}</td>
              <td className="p-4">
                <select
                  value={user.role}
                  onChange={(e) => onRoleChange(user._id, e.target.value)}
                  className="bg-[#0d0d0d] border border-[#c69749]/30 text-white rounded-md px-2 py-1 focus:outline-none focus:border-[#c69749]"
                >
                  <option value="user">مستخدم</option>
                  <option value="admin">أدمن</option>
                </select>
              </td>
              <td className="p-4">
                <button
                  onClick={() => onToggleStatus(user._id, user.isActive)}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    user.isActive
                      ? "bg-green-900/40 text-green-400 border border-green-600/40"
                      : "bg-red-900/40 text-red-400 border border-red-600/40"
                  }`}
                >
                  {user.isActive ? "مفعّل" : "موقوف"}
                </button>
              </td>
              <td className="p-4 text-gray-400 text-sm">
                {new Date(user.createdAt).toLocaleDateString("ar-EG")}
              </td>
              <td className="p-4">
                {confirmDeleteId === user._id ? (
                  <div className="flex gap-2 items-center">
                    <span className="text-sm text-gray-300">متأكد؟</span>
                    <button
                      onClick={() => {
                        onDelete(user._id);
                        setConfirmDeleteId(null);
                      }}
                      className="text-red-400 hover:text-red-300 text-sm font-semibold"
                    >
                      نعم
                    </button>
                    <button
                      onClick={() => setConfirmDeleteId(null)}
                      className="text-gray-400 hover:text-white text-sm"
                    >
                      إلغاء
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmDeleteId(user._id)}
                    className="text-red-500 hover:text-red-400 text-sm font-semibold"
                  >
                    حذف
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
