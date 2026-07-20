"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { orderService } from "@/services/orderService";

const STATUS_LABELS = {
  pending: "قيد الانتظار",
  processing: "قيد المعالجة",
  shipped: "تم الشحن",
  delivered: "تم التوصيل",
  cancelled: "ملغي",
};

const STATUS_COLORS = {
  pending: "text-[#c69749]",
  processing: "text-[#8fa9c6]",
  shipped: "text-[#8fa9c6]",
  delivered: "text-[#8fae7c]",
  cancelled: "text-[#c96a5a]",
};

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [confirmDeleteAll, setConfirmDeleteAll] = useState(false);
  const [isDeletingAll, setIsDeletingAll] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsLoading(false);
      return;
    }

    orderService
      .getMyOrders()
      .then(setOrders)
      .catch((err) => setError(err.message || "تعذر تحميل الطلبات"))
      .finally(() => setIsLoading(false));
  }, [authLoading, user]);

  const openDeleteModal = (e, order) => {
    e.preventDefault();
    e.stopPropagation();
    setOrderToDelete(order);
  };

  const closeDeleteModal = () => setOrderToDelete(null);

  const confirmDelete = async () => {
    if (!orderToDelete) return;
    const orderId = orderToDelete.id;

    setDeletingId(orderId);
    try {
      await orderService.deleteOrder(orderId);
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
      setOrderToDelete(null);
    } catch (err) {
      setError(err.message || "تعذر حذف الطلب");
      setOrderToDelete(null);
    } finally {
      setDeletingId(null);
    }
  };

  const confirmDeleteAllOrders = async () => {
    setIsDeletingAll(true);
    try {
      await orderService.deleteAllOrders();
      setOrders([]);
      setConfirmDeleteAll(false);
    } catch (err) {
      setError(err.message || "تعذر حذف الطلبات");
      setConfirmDeleteAll(false);
    } finally {
      setIsDeletingAll(false);
    }
  };

  return (
    <main dir="rtl" className="min-h-screen bg-[#1a1613] px-4 py-10 md:px-10">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl text-[#f2ede4]">طلباتي</h1>
            <p className="mt-1 font-body text-sm text-[#a9a196]">
              تتبع كل طلباتك السابقة والحالية
            </p>
          </div>

          {!authLoading &&
            user &&
            !isLoading &&
            !error &&
            orders.length > 0 && (
              <button
                onClick={() => setConfirmDeleteAll(true)}
                className="shrink-0 rounded-lg border border-[#c96a5a]/30 bg-[#c96a5a]/10 px-4 py-2 font-body text-xs text-[#c96a5a] transition-colors hover:border-[#c96a5a] hover:bg-[#c96a5a]/20"
              >
                حذف الكل
              </button>
            )}
        </header>

        {(authLoading || isLoading) && user !== null && (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-20 animate-pulse rounded-lg bg-[#211c17]"
              />
            ))}
          </div>
        )}

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
              عشان تشوف طلباتك وتتابع حالتها، لازم يكون عندك حساب مسجل دخول
            </p>
            <Link
              href="/login"
              className="mt-5 inline-block rounded-md bg-[#c69749] px-6 py-2.5 font-body text-sm text-[#1a1613] hover:bg-[#b08540]"
            >
              تسجيل الدخول
            </Link>
          </div>
        )}

        {!authLoading && user && !isLoading && error && (
          <p className="font-body text-sm text-[#c96a5a]">{error}</p>
        )}

        {!authLoading &&
          user &&
          !isLoading &&
          !error &&
          orders.length === 0 && (
            <div className="rounded-lg border border-[#2a251f] bg-[#211c17] p-8 text-center">
              <p className="font-body text-sm text-[#a9a196]">
                ما عندك أي طلبات بعد
              </p>
              <Link
                href="/products"
                className="mt-4 inline-block rounded-md bg-[#c69749] px-6 py-2 font-body text-sm text-[#1a1613]"
              >
                تصفح المنتجات
              </Link>
            </div>
          )}

        {!authLoading && user && !isLoading && !error && orders.length > 0 && (
          <div className="space-y-3">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={"/orders/" + order.id}
                className="group relative flex items-center justify-between rounded-lg border border-[#2a251f] bg-[#211c17] p-5 transition-colors hover:border-[#c69749]/50"
              >
                <div>
                  <p className="font-body text-sm text-[#f2ede4]">
                    طلب #{order.id.slice(-6)}
                  </p>
                  <p className="mt-1 font-body text-xs text-[#a9a196]">
                    {order.items.length} منتج{" "}
                    {order.createdAt &&
                      "- " + new Date(order.createdAt).toLocaleDateString("ar")}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-left">
                    <p className="font-display text-base text-[#c69749]">
                      {order.total.toLocaleString("ar")} NIS
                    </p>
                    <p
                      className={
                        "mt-1 font-body text-xs " +
                        (STATUS_COLORS[order.status] ?? "text-[#a9a196]")
                      }
                    >
                      {STATUS_LABELS[order.status] ?? order.status}
                    </p>
                  </div>

                  <button
                    onClick={(e) => openDeleteModal(e, order)}
                    title="حذف الطلب"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#2a251f] text-[#a9a196] transition-colors hover:border-[#c96a5a]/50 hover:bg-[#c96a5a]/10 hover:text-[#c96a5a]"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className="h-4 w-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      />
                    </svg>
                  </button>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {orderToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in"
          onClick={closeDeleteModal}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl border border-[#2a251f] bg-[#211c17] p-6 text-center shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] animate-scale-in"
          >
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#c96a5a]/10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="h-7 w-7 text-[#c96a5a]"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                />
              </svg>
            </div>

            <h3 className="font-display text-lg text-[#f2ede4]">حذف الطلب؟</h3>
            <p className="mt-2 font-body text-sm text-[#a9a196]">
              رح يتم حذف الطلب{" "}
              <span className="text-[#c69749]">
                #{orderToDelete.id.slice(-6)}
              </span>{" "}
              نهائياً، وما فيك ترجعه بعدين.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                onClick={closeDeleteModal}
                className="flex-1 rounded-lg border border-[#2a251f] py-2.5 font-body text-sm text-[#a9a196] transition-colors hover:border-white/20 hover:text-[#f2ede4]"
              >
                إلغاء
              </button>

              <button
                onClick={confirmDelete}
                disabled={deletingId === orderToDelete.id}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#c96a5a] py-2.5 font-body text-sm text-white transition-colors hover:bg-[#b85a4a] disabled:opacity-60"
              >
                {deletingId === orderToDelete.id ? (
                  <>
                    <svg
                      className="h-4 w-4 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
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
                    جارِ الحذف...
                  </>
                ) : (
                  "نعم، احذف"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmDeleteAll && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in"
          onClick={() => !isDeletingAll && setConfirmDeleteAll(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl border border-[#2a251f] bg-[#211c17] p-6 text-center shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] animate-scale-in"
          >
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#c96a5a]/10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="h-7 w-7 text-[#c96a5a]"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                />
              </svg>
            </div>

            <h3 className="font-display text-lg text-[#f2ede4]">
              حذف كل الطلبات؟
            </h3>
            <p className="mt-2 font-body text-sm text-[#a9a196]">
              رح يتم حذف كل طلباتك ({orders.length}) نهائياً، وما فيك ترجعها
              بعدين.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setConfirmDeleteAll(false)}
                disabled={isDeletingAll}
                className="flex-1 rounded-lg border border-[#2a251f] py-2.5 font-body text-sm text-[#a9a196] transition-colors hover:border-white/20 hover:text-[#f2ede4] disabled:opacity-60"
              >
                إلغاء
              </button>

              <button
                onClick={confirmDeleteAllOrders}
                disabled={isDeletingAll}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#c96a5a] py-2.5 font-body text-sm text-white transition-colors hover:bg-[#b85a4a] disabled:opacity-60"
              >
                {isDeletingAll ? (
                  <>
                    <svg
                      className="h-4 w-4 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
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
                    جارِ الحذف...
                  </>
                ) : (
                  "نعم، احذف الكل"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(8px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-scale-in {
          animation: scaleIn 0.25s ease-out;
        }
      `}</style>
    </main>
  );
}
