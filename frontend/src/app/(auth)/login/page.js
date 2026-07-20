"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login as loginRequest } from "@/services/authService";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const { login: setAuthUser } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    if (!form.email || !form.password) {
      setError("Please enter both email and password.");
      setLoading(false);
      return;
    }

    try {
      const data = await loginRequest(form);

      // ⚠️ تأكدي إن data.user هو فعلاً الشكل الصحيح لرد الباك اند
      // إذا كان الرد شكله مختلف (مثلاً data مباشرة هو بيانات المستخدم)، عدّلي هالسطر
      setAuthUser(data.user);

      router.push("/");
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen py-20 px-4 bg-[#0f0f0f]">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#c69749]/10 border border-[#c69749]/30 mb-4">
            <svg
              className="w-7 h-7 text-[#c69749]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
              />
            </svg>
          </div>
          <h1 className="text-3xl text-white font-bold">تسجيل الدخول</h1>
          <p className="text-gray-400 text-sm mt-2">
            مرحبًا بعودتك، سجّل دخولك لمتابعة التسوق
          </p>
        </div>

        <div
          className="w-full bg-white/5 backdrop-blur-md p-8 rounded-2xl
          shadow-[0_0_40px_-15px_rgba(198,151,73,0.25)]
          border border-[#c69749]/10"
        >
          <form onSubmit={handleSubmit} dir="rtl" className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="text-gray-300 text-sm mb-1.5 block"
              >
                البريد الإلكتروني
              </label>
              <div className="relative">
                <svg
                  className="w-5 h-5 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                  />
                </svg>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="example@email.com"
                  className="w-full p-3 pr-10 rounded-lg bg-white/5 border border-white/10
                  placeholder:text-gray-500 text-white outline-none transition
                  focus:ring-2 focus:ring-[#c69749] focus:border-transparent"
                  onChange={(e) =>
                    setForm({
                      ...form,
                      email: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="text-gray-300 text-sm mb-1.5 block"
              >
                كلمة المرور
              </label>
              <div className="relative">
                <svg
                  className="w-5 h-5 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                  />
                </svg>
                <input
                  id="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full p-3 pr-10 rounded-lg bg-white/5 border border-white/10
                  placeholder:text-gray-500 text-white outline-none transition
                  focus:ring-2 focus:ring-[#c69749] focus:border-transparent"
                  onChange={(e) =>
                    setForm({
                      ...form,
                      password: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#c69749] text-[#1a1a1a] font-bold px-6 py-3 rounded-lg
              hover:opacity-90 hover:shadow-[0_0_20px_-4px_rgba(198,151,73,0.6)]
              transition-all duration-200 cursor-pointer
              disabled:opacity-60 disabled:cursor-not-allowed
              flex items-center justify-center gap-2"
            >
              {loading && (
                <svg
                  className="animate-spin h-4 w-4 text-[#1a1a1a]"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
              )}
              {loading ? "جارِ الدخول…" : "تسجيل الدخول"}
            </button>

            <div className="w-full text-center pt-1">
              <span className="text-gray-400 text-sm">ليس لديك حساب؟ </span>
              <Link
                href="/register"
                className="text-[#c69749] text-sm font-bold hover:underline"
              >
                إنشاء حساب
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
