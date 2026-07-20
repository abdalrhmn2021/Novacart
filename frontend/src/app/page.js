import Link from "next/link";

import { ArrowLeft, Sparkles } from "lucide-react";

import TopProducts from "@/components/getTopProducts";

export default async function HomePage() {
 

  return (
    <div className="bg-[#0f0e0c]">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/10 bg-arabesque bg-[length:22px_22px]">
        {/* توهج خلفي */}
        <div className="pointer-events-none absolute inset-0 -z-0">
          <div className="absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-[#c69749]/20 blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-6xl px-6 py-28 text-center">
          <span
            className="
              inline-block rounded-full border border-[#c69749]/30
              bg-[#c69749]/10 px-4 py-1
              font-body text-xs tracking-[0.3em] text-[#c69749]
            "
          >
            NOVACART
          </span>

          <h1 className="mt-6 font-display text-4xl font-extrabold leading-tight text-cream sm:text-6xl">
            تسوّق بأناقة،
            <span className="block bg-gradient-to-l from-[#c69749] via-[#e0b975] to-[#c69749] bg-clip-text text-transparent">
              وثق بالجودة
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl font-body text-cream/60">
            اكتشف أفضل المنتجات المختارة بعناية بأسعار وجودة تناسب احتياجاتك.
          </p>

          <div className="mt-10 flex justify-center gap-4">
            <Link
              href="/products"
              className="
                group relative overflow-hidden rounded-lg
                bg-[#c69749] px-7 py-3 font-bold text-[#1a1a1a]
                transition-transform duration-300 hover:scale-[1.03]
              "
            >
              <span className="relative z-10">تصفح المنتجات</span>
              <span className="absolute inset-0 -translate-x-full bg-[#e0b975] transition-transform duration-300 group-hover:translate-x-0" />
            </Link>

            <Link
              href="/categories"
              className="
                rounded-lg border border-[#c69749]/50 px-7 py-3 font-bold
                text-[#c69749] transition-colors duration-300
                hover:border-[#c69749] hover:bg-[#c69749]/10
              "
            >
              التصنيفات
            </Link>
          </div>
        </div>
      </section>

      {/* Top Price Products */}
      {/* Top Price Products */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <span className="flex items-center gap-2 font-body text-xs tracking-[0.3em] text-[#c69749]/70">
              <Sparkles className="h-3.5 w-3.5 animate-pulse" />
              مختارة لك
            </span>
            <h2 className="mt-2 font-display text-3xl font-bold text-white">
              أعلى المنتجات سعراً
            </h2>
          </div>

          <Link
            href="/products"
            className="group relative flex items-center gap-2 font-bold text-sm text-[#c69749]"
          >
            <span className="relative">
              عرض الكل
              <span className="absolute -bottom-1 right-0 h-[1.5px] w-0 bg-[#c69749] transition-all duration-300 group-hover:w-full" />
            </span>
            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[#c69749]/30 bg-[#c69749]/10 transition-all duration-300 group-hover:-translate-x-1 group-hover:bg-[#c69749] group-hover:border-[#c69749]">
              <ArrowLeft className="h-3.5 w-3.5 transition-colors duration-300 group-hover:text-[#1a1a1a]" />
            </span>
          </Link>
        </div>

        <TopProducts />
      </section>
    </div>
  );
}
