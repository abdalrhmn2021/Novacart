"use client";

import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <main dir="rtl" className="min-h-screen bg-[#1a1613] px-4 py-10 md:px-10">
      <div className="mx-auto max-w-4xl">
        <header className="mb-10">
          <h1 className="font-display text-3xl text-[#f2ede4]">لوحة التحكم</h1>
          <p className="mt-1 font-body text-sm text-[#a9a196]">
            إدارة المنتجات والطلبات والمستخدمين من مكان واحد
          </p>
        </header>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/admin/products"
            className="group rounded-lg border border-[#2a251f] bg-[#211c17] p-6 transition-colors hover:border-[#c69749]/50"
          >
            <h2 className="font-display text-xl text-[#f2ede4] group-hover:text-[#c69749]">
              المنتجات
            </h2>
            <p className="mt-2 font-body text-sm text-[#a9a196]">
              إضافة، تعديل، وحذف المنتجات
            </p>
          </Link>

          <Link
            href="/admin/orders"
            className="group rounded-lg border border-[#2a251f] bg-[#211c17] p-6 transition-colors hover:border-[#c69749]/50"
          >
            <h2 className="font-display text-xl text-[#f2ede4] group-hover:text-[#c69749]">
              الطلبات
            </h2>
            <p className="mt-2 font-body text-sm text-[#a9a196]">
              متابعة الطلبات وتغيير حالتها
            </p>
          </Link>

          <Link
            href="/admin/users"
            className="group rounded-lg border border-[#2a251f] bg-[#211c17] p-6 transition-colors hover:border-[#c69749]/50"
          >
            <h2 className="font-display text-xl text-[#f2ede4] group-hover:text-[#c69749]">
              المستخدمون
            </h2>
            <p className="mt-2 font-body text-sm text-[#a9a196]">
              إدارة الحسابات والصلاحيات
            </p>
          </Link>
        </div>
      </div>
    </main>
  );
}
