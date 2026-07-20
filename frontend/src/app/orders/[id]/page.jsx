"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { orderService } from "@/services/orderService";
import { paymentService } from "@/services/paymentService";

export default function OrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    orderService
      .getOrderById(id)
      .then(setOrder)
      .catch((err) => setError(err.message || "تعذر تحميل الطلب"))
      .finally(() => setIsLoading(false));
  }, [id]);

  const isPending = order?.paymentStatus === "pending";

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;
    setIsSaving(true);
    setError(null);
    try {
      const items = order.items.map((item) => {
        const itemProductId = item.product?._id || item.product;
        return {
          product: itemProductId,
          quantity: itemProductId === productId ? quantity : item.quantity,
        };
      });
      const updated = await orderService.updateOrderItems(id, items);
      setOrder(updated);
    } catch (err) {
      setError(err.response?.data?.message || "تعذر تحديث الكمية");
    } finally {
      setIsSaving(false);
    }
  };

  const removeItem = async (productId) => {
    setIsSaving(true);
    setError(null);
    try {
      const items = order.items
        .filter((item) => (item.product?._id || item.product) !== productId)
        .map((item) => ({
          product: item.product?._id || item.product,
          quantity: item.quantity,
        }));

      if (items.length === 0) {
        setError("لازم يبقى منتج واحد على الأقل بالطلب");
        setIsSaving(false);
        return;
      }

      const updated = await orderService.updateOrderItems(id, items);
      setOrder(updated);
    } catch (err) {
      setError(err.response?.data?.message || "تعذر حذف المنتج");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    setError(null);
    try {
      const { url } = await paymentService.createCheckoutSession(id);
      window.location.href = url;
    } catch (err) {
      setError(err.response?.data?.message || "تعذر بدء عملية الدفع");
      setIsCheckingOut(false);
    }
  };

  if (isLoading) {
    return (
      <main dir="rtl" className="min-h-screen bg-[#1a1613] px-4 py-10 md:px-10">
        <div className="mx-auto max-w-3xl animate-pulse space-y-4">
          <div className="h-8 w-1/3 rounded bg-[#241f1a]" />
          <div className="h-40 rounded bg-[#241f1a]" />
          <div className="h-40 rounded bg-[#241f1a]" />
        </div>
      </main>
    );
  }

  if (error && !order) {
    return (
      <main dir="rtl" className="min-h-screen bg-[#1a1613] px-4 py-10 text-center">
        <p className="font-body text-[#c96a5a]">{error}</p>
        <button
          onClick={() => router.push("/orders")}
          className="mt-4 rounded-md border border-[#3a342c] px-4 py-2 font-body text-sm text-[#a9a196]"
        >
          الرجوع لطلباتي
        </button>
      </main>
    );
  }

  if (!order) return null;

  return (
    <main dir="rtl" className="min-h-screen bg-[#1a1613] px-4 py-10 md:px-10">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/orders"
          className="font-body text-sm text-[#a9a196] hover:text-[#c69749]"
        >
          ← الرجوع لطلباتي
        </Link>

        <div className="mt-4 flex items-center justify-between">
          <h1 className="font-display text-2xl text-[#f2ede4]">
            طلب #{(order.id || order._id)?.slice(-6)}
          </h1>
          <span
            className={`rounded-full px-3 py-1 font-body text-xs ${
              isPending
                ? "bg-[#c69749]/10 text-[#c69749]"
                : "bg-[#8fae7c]/10 text-[#8fae7c]"
            }`}
          >
            {isPending ? "قيد الانتظار - غير مدفوع" : "مدفوع"}
          </span>
        </div>

        {error && (
          <p className="mt-3 font-body text-sm text-[#c96a5a]">{error}</p>
        )}

        <div className="mt-6 space-y-3">
          {order.items.map((item) => {
            const productId = item.product?._id || item.product;
            return (
              <div
                key={productId}
                className="flex items-center justify-between rounded-lg border border-[#2a251f] bg-[#211c17] p-4"
              >
                <div>
                  <p className="font-body text-sm text-[#f2ede4]">
                    {item.name}
                  </p>
                  <p className="mt-1 font-body text-xs text-[#a9a196]">
                    {item.price.toLocaleString()} ₪
                  </p>
                </div>

                {isPending ? (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center rounded-md border border-[#3a342c]">
                      <button
                        disabled={isSaving}
                        onClick={() =>
                          updateQuantity(productId, item.quantity - 1)
                        }
                        className="px-3 py-1.5 font-body text-[#a9a196] disabled:opacity-50"
                      >
                        −
                      </button>
                      <span className="w-8 text-center font-body text-[#f2ede4]">
                        {item.quantity}
                      </span>
                      <button
                        disabled={isSaving}
                        onClick={() =>
                          updateQuantity(productId, item.quantity + 1)
                        }
                        className="px-3 py-1.5 font-body text-[#a9a196] disabled:opacity-50"
                      >
                        +
                      </button>
                    </div>
                    <button
                      disabled={isSaving}
                      onClick={() => removeItem(productId)}
                      className="font-body text-xs text-[#c96a5a] hover:underline disabled:opacity-50"
                    >
                      حذف
                    </button>
                  </div>
                ) : (
                  <span className="font-body text-sm text-[#a9a196]">
                    الكمية: {item.quantity}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-[#2a251f] pt-4">
          <span className="font-body text-sm text-[#a9a196]">الإجمالي</span>
          <span className="font-display text-xl text-[#c69749]">
            {order.total.toLocaleString()} ₪
          </span>
        </div>

        {isPending && (
          <button
            onClick={handleCheckout}
            disabled={isCheckingOut || isSaving}
            className="mt-6 w-full rounded-md bg-[#c69749] py-3 font-body text-sm font-medium text-[#1a1613] transition disabled:opacity-60"
          >
            {isCheckingOut ? "جارِ التحويل..." : "إكمال الشراء"}
          </button>
        )}
      </div>
    </main>
  );
}