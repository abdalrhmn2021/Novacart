"use client";

import { useState } from "react";
import Link from "next/link";
import api from "@/services/api";
import { useAuth } from "@/context/AuthContext";

export default function ProfilePage() {
  const { user, logout, updateUser, loading: authLoading } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 1) لسا عم يتحقق من تسجيل الدخول (أول تحميل / refresh)
  if (authLoading) {
    return (
      <main className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <div className="text-gray-400">جارِ التحميل...</div>
      </main>
    );
  }

  // 2) خلص التحقق وما في مستخدم مسجل دخول
  if (!user) {
    return (
      <main className="min-h-screen bg-[#0f0f0f] flex items-center justify-center px-4">
        <div
          className="max-w-md w-full text-center bg-white/5 backdrop-blur-md p-10 rounded-2xl shadow-[0_0_40px_-15px_rgba(198,151,73,0.25)] border border-[#c69749]/10"
          dir="rtl"
        >
          <div className="text-6xl mb-4">🔐✨</div>
          <h1 className="text-2xl text-white font-bold">
            ولا خطوة! لسا ما سجّلت دخول
          </h1>
          <p className="text-gray-400 text-sm mt-3 leading-relaxed">
            سجّل دخول أو افتح حساب جديد حتى تشوف معلوماتك وطلباتك،
            وتضل متابع كل شي بسهولة 🛍️
          </p>
          <div className="mt-8 space-y-3">
            <Link
              href="/login"
              className="block w-full bg-[#c69749] text-[#1a1a1a] font-bold py-3 rounded-lg hover:opacity-90 transition"
            >
              تسجيل الدخول
            </Link>
            <Link
              href="/register"
              className="block w-full bg-white/10 border border-white/10 text-white py-3 rounded-lg hover:bg-white/20 transition"
            >
              إنشاء حساب جديد
            </Link>
          </div>
          <p className="text-gray-500 text-xs mt-6">بثانيتين وترجع عالموضوع 🚀</p>
        </div>
      </main>
    );
  }

  // 3) من هون وطالع، مضمون إن user موجود
  const startEditing = () => {
    setFormData({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
    });
    setIsEditing(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.put("/users/profile", formData);
      updateUser(response.data);
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || "فشل تحديث البيانات");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0f0f0f] py-20 px-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#c69749]/10 border border-[#c69749]/30 mb-4">
            <svg className="w-10 h-10 text-[#c69749]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </div>
          <h1 className="text-3xl text-white font-bold">الملف الشخصي</h1>
          <p className="text-gray-400 text-sm mt-2">إدارة معلومات حسابك</p>
        </div>

        <div className="bg-white/5 backdrop-blur-md p-8 rounded-2xl shadow-[0_0_40px_-15px_rgba(198,151,73,0.25)] border border-[#c69749]/10">
          <div className="space-y-5" dir="rtl">
            {error && (
              <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                {error}
              </p>
            )}

            <div>
              <label className="text-gray-400 text-sm">الاسم الأول</label>
              {isEditing ? (
                <input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="mt-1 w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-[#c69749]"
                />
              ) : (
                <div className="mt-1 bg-white/5 border border-white/10 rounded-lg p-3 text-white">
                  {user.firstName} {user.lastName}
                </div>
              )}
            </div>

            {isEditing && (
              <div>
                <label className="text-gray-400 text-sm">الاسم الأخير</label>
                <input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="mt-1 w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-[#c69749]"
                />
              </div>
            )}

            <div>
              <label className="text-gray-400 text-sm">البريد الإلكتروني</label>
              {isEditing ? (
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-[#c69749]"
                />
              ) : (
                <div className="mt-1 bg-white/5 border border-white/10 rounded-lg p-3 text-white">
                  {user.email}
                </div>
              )}
            </div>

            {isEditing ? (
              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex-1 bg-[#c69749] text-[#1a1a1a] font-bold py-3 rounded-lg hover:opacity-90 transition disabled:opacity-50"
                >
                  {loading ? "جارِ الحفظ..." : "حفظ"}
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 bg-white/10 border border-white/10 text-white py-3 rounded-lg hover:bg-white/20 transition"
                >
                  إلغاء
                </button>
              </div>
            ) : (
              <button
                onClick={startEditing}
                className="w-full bg-[#c69749] text-[#1a1a1a] font-bold py-3 rounded-lg hover:opacity-90 transition"
              >
                تعديل البيانات
              </button>
            )}

            <button
              onClick={logout}
              className="w-full bg-white/10 border border-white/10 text-white py-3 rounded-lg hover:bg-white/20 transition"
            >
              تسجيل الخروج
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}