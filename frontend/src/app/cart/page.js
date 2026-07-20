"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/hooks/context/CartContext";
import { useCheckout } from "@/hooks/useCheckout";

export default function CartPage() {
  const { user, loading: authLoading } = useAuth();
  const { items, removeItem, updateQuantity, clearCart, totalItems, totalPrice } =
    useCart();
  const { checkout, isProcessing, error } = useCheckout();

  return (
    <main dir="rtl" className="min-h-screen bg-[#1a1613] px-4 py-10 md:px-10">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl text-[#f2ede4]">سلة التسوق</h1>
            {user && (
              <p className="mt-1 font-body text-sm text-[#a9a196]">
                {totalItems > 0
                  ? `${totalItems} منتج في سلتك`
                  : "سلتك فارغة حالياً"}
              </p>
            )}
          </div>

          {user && items.length > 0 && (
            <button
              onClick={clearCart}
              className="font-body text-sm text-[#c96a5a] hover:underline"
            >
              إفراغ السلة
            </button>
          )}
        </header>

        {/* لسا عم نتحقق من حالة تسجيل الدخول */}
        {authLoading && (
          <div className="space-y-3">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="h-20 animate-pulse rounded-lg bg-[#211c17]" />
            ))}
          </div>
        )}

        {/* مش مسجل دخول */}
        {!authLoading && !user && (
          <div className="rounded-lg border border-[#2a251f] bg-[#211c17] p-10 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#c69749]/10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="h-7 w-7 text-[#c69749]"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l3 3m0 0l-3 3m3-3H2.25"
                />
              </svg>
            </div>
            <p className="font-display text-lg text-[#f2ede4]">
              لازم تسجل الدخول الأول
            </p>
            <p className="mx-auto mt-2 max-w-xs font-body text-sm text-[#a9a196]">
              عشان تضيف منتجات لسلتك وتكمل عملية الشراء، لازم يكون عندك حساب
              مسجّل دخول
            </p>
            <div className="mt-5 flex justify-center gap-3">
              <Link
                href="/login"
                className="rounded-md bg-[#c69749] px-6 py-2.5 font-body text-sm text-[#1a1613] hover:bg-[#b08540]"
              >
                تسجيل الدخول
              </Link>
              <Link
                href="/register"
                className="rounded-md border border-[#3a342c] px-6 py-2.5 font-body text-sm text-[#a9a196] hover:border-[#c69749]/50"
              >
                إنشاء حساب
              </Link>
            </div>
          </div>
        )}

        {/* مسجل دخول بس السلة فاضية */}
        {!authLoading && user && items.length === 0 && (
          <div className="rounded-lg border border-[#2a251f] bg-[#211c17] p-8 text-center">
            <p className="font-body text-sm text-[#a9a196]">
              ما أضفت أي منتج للسلة بعد
            </p>
            <Link
              href="/products"
              className="mt-4 inline-block rounded-md bg-[#c69749] px-6 py-2 font-body text-sm text-[#1a1613]"
            >
              تصفح المنتجات
            </Link>
          </div>
        )}

        {/* مسجل دخول وفي منتجات بالسلة */}
        {!authLoading && user && items.length > 0 && (
          <>
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 rounded-lg border border-[#2a251f] bg-[#211c17] p-4"
                >
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-[#1a1613]">
                    <Image
                      src={item.image || "/images/placeholder.png"}
                      alt={item.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <p className="font-body text-sm text-[#f2ede4]">{item.name}</p>
                    <p className="mt-1 font-display text-base text-[#c69749]">
                      {item.price.toLocaleString("ar")} ₪
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="h-7 w-7 rounded-md border border-[#3a342c] font-body text-sm text-[#a9a196] hover:border-[#c69749]/50"
                    >
                      −
                    </button>
                    <span className="w-6 text-center font-body text-sm text-[#f2ede4]">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="h-7 w-7 rounded-md border border-[#3a342c] font-body text-sm text-[#a9a196] hover:border-[#c69749]/50"
                    >
                      +
                    </button>
                  </div>

                  <div className="w-24 text-left font-display text-sm text-[#f2ede4]">
                    {(item.price * item.quantity).toLocaleString("ar")} ₪
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="font-body text-xs text-[#c96a5a] hover:underline"
                  >
                    حذف
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-8 flex items-center justify-between rounded-lg border border-[#2a251f] bg-[#211c17] p-6">
              <div>
                <p className="font-body text-sm text-[#a9a196]">المجموع</p>
                <p className="font-display text-2xl text-[#c69749]">
                  {totalPrice.toLocaleString("ar")} ₪
                </p>
                {error && (
                  <p className="mt-2 font-body text-xs text-[#c96a5a]">{error}</p>
                )}
              </div>

              <button
                onClick={() => checkout()}
                disabled={isProcessing}
                className="rounded-md bg-[#c69749] px-8 py-3 font-body text-sm text-[#1a1613] transition-colors hover:bg-[#b08540] disabled:opacity-60"
              >
                {isProcessing ? "جارِ إنشاء الطلب..." : "إتمام الشراء"}
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
