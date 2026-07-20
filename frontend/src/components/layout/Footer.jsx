"use client";

import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-white/10 bg-[#0f0e0c] text-white" dir="rtl">
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          {/* العلامة التجارية */}
          <div className="text-center md:text-right">
            <h2 className="font-display text-2xl font-bold text-white">
              Nova<span className="text-[#c69749]">Cart</span>
            </h2>

            <p className="mt-2 font-body text-sm text-white/60">
              وجهتك الموثوقة للتسوق الإلكتروني.
            </p>
          </div>

          {/* الروابط */}
          <div className="flex gap-8 text-sm">
            <Link
              href="/about"
              className="relative pb-1 font-body text-white transition-colors hover:text-[#c69749]
              after:content-[''] after:absolute after:right-0 after:-bottom-0.5 after:h-[1.5px]
              after:w-0 after:bg-gradient-to-l after:from-[#c69749] after:to-[#e0b975] after:transition-all hover:after:w-full"
            >
              من نحن
            </Link>

            <Link
              href="/terms"
              className="relative pb-1 font-body text-white transition-colors hover:text-[#c69749]
              after:content-[''] after:absolute after:right-0 after:-bottom-0.5 after:h-[1.5px]
              after:w-0 after:bg-gradient-to-l after:from-[#c69749] after:to-[#e0b975] after:transition-all hover:after:w-full"
            >
              الشروط والأحكام
            </Link>

            <Link
              href="/privacy"
              className="relative pb-1 font-body text-white transition-colors hover:text-[#c69749]
              after:content-[''] after:absolute after:right-0 after:-bottom-0.5 after:h-[1.5px]
              after:w-0 after:bg-gradient-to-l after:from-[#c69749] after:to-[#e0b975] after:transition-all hover:after:w-full"
            >
              سياسة الخصوصية
            </Link>
          </div>
        </div>

        {/* الخط السفلي */}
        <div className="mt-8 border-t border-white/10 pt-5 text-center">
          <p className="font-body text-sm text-white/50">
            © {year} <span className="text-[#c69749]">NovaCart</span>. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  );
}