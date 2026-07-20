"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/hooks/context/CartContext";

export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const { totalItems } = useCart();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { href: "/products", label: "المنتجات" },
    { href: "/orders", label: "الطلبات" },
    { href: "/profile", label: "الملف الشخصي" },
  ];

  const adminLinks = [{ href: "/admin", label: "لوحة التحكم" }];

  const links =
    user?.role === "admin" ? [...navLinks, ...adminLinks] : navLinks;

  if (loading) {
    return (
      <nav className="bg-[#0f0e0c] text-white px-6 py-4 border-b border-white/5">
        <div className="max-w-7xl mx-auto animate-pulse text-sm">
          جارِ التحميل...
        </div>
      </nav>
    );
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#0f0e0c]/80 px-6 py-4 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="group relative shrink-0 font-display text-2xl font-extrabold tracking-wide"
        >
          <span className="logo-shimmer">NovaCart</span>
          <span className="absolute -bottom-1 right-0 h-[1px] w-0 bg-gradient-to-l from-[#c69749] to-transparent transition-all duration-300 group-hover:w-full" />
        </Link>

        {/* Center Links (desktop) */}
        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative pb-1 font-body text-sm tracking-wide transition-colors hover:text-[#c69749]
                  ${isActive ? "text-[#c69749]" : "text-white"}
                  after:content-[''] after:absolute after:right-0 after:-bottom-1 after:h-[2px]
                  after:bg-gradient-to-l after:from-[#c69749] after:to-[#e0b975] after:transition-all after:duration-300
                  ${isActive ? "after:w-full" : "after:w-0 hover:after:w-full"}`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Right side (desktop) */}
        <div className="hidden items-center gap-4 md:flex">
          <Link
            href="/cart"
            className="relative flex items-center text-white transition-colors hover:text-[#c69749]"
            aria-label="سلة التسوق"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 1.98-4.716 2.558-7.221.108-.464-.262-.884-.738-.884H5.106M7.5 14.25L5.106 5.272M6 18.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm9.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
              />
            </svg>
            {totalItems > 0 && (
              <span className="absolute -top-2 -left-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#c69749] text-[10px] font-bold text-[#1a1a1a]">
                {totalItems}
              </span>
            )}
          </Link>
          {user ? (
            <>
              <span className="font-body text-sm text-white/80">
                مرحبًا،{" "}
                <span className="font-medium text-white">{user.firstName}</span>
              </span>
              <button
                onClick={logout}
                className="cursor-pointer rounded-md border border-white/10 bg-white/5 px-4 py-2
                text-sm font-medium text-white transition-colors duration-300 hover:border-[#c69749]/40 hover:bg-white/10"
              >
                تسجيل الخروج
              </button>
            </>
          ) : (
            <>
              <Link
                href="/register"
                className="font-body text-sm font-medium text-white transition-colors hover:text-[#c69749]"
              >
                إنشاء حساب
              </Link>
              <Link
                href="/login"
                className="group relative overflow-hidden rounded-md bg-[#c69749] px-5 py-2.5
                text-sm font-bold text-[#1a1a1a] transition-transform duration-300 hover:scale-[1.03]"
              >
                <span className="relative z-10">تسجيل الدخول</span>
                <span className="absolute inset-0 -translate-x-full bg-[#e0b975] transition-transform duration-300 group-hover:translate-x-0" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-white transition-colors hover:text-[#c69749] md:hidden"
          aria-label="القائمة"
        >
          <svg
            className="h-7 w-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="mx-auto mt-4 flex max-w-7xl flex-col gap-4 pb-2 md:hidden"
          dir="rtl"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`font-body text-sm transition-colors hover:text-[#c69749] ${
                pathname === link.href
                  ? "font-medium text-[#c69749]"
                  : "text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}

          <Link
            href="/cart"
            onClick={() => setMenuOpen(false)}
            className="flex items-center justify-between font-body text-sm text-white transition-colors hover:text-[#c69749]"
          >
            <span>سلة التسوق</span>
            {totalItems > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#c69749] text-[10px] font-bold text-[#1a1a1a]">
                {totalItems}
              </span>
            )}
          </Link>

          <div className="my-1 h-px bg-white/10" />

          {user ? (
            <>
              <span className="font-body text-sm text-white/80">
                مرحبًا،{" "}
                <span className="font-medium text-white">{user.firstName}</span>
              </span>
              <button
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
                className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-2
                text-sm font-medium text-white transition-colors hover:bg-white/10"
              >
                تسجيل الخروج
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="rounded-md bg-[#c69749] px-4 py-2.5 text-center text-sm
                font-bold text-[#1a1a1a] transition-opacity hover:opacity-90"
              >
                تسجيل الدخول
              </Link>
              <Link
                href="/register"
                onClick={() => setMenuOpen(false)}
                className="text-center font-body text-sm text-white transition-colors hover:text-[#c69749]"
              >
                إنشاء حساب
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
