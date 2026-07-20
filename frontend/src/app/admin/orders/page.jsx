"use client";

import { useEffect, useState, useCallback } from "react";
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

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const loadOrders = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await orderService.getAllOrders();
      setOrders(data);
    } catch (err) {
      setError(err.message || "تعذر تحميل الطلبات");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadOrders();
  }, [loadOrders]);

  const handleStatusChange = async (order, status) => {
    setUpdatingId(order.id);
    try {
      const updated = await orderService.updateOrderStatus(order.id, status);
      setOrders((prev) =>
        prev.map((o) => (o.id === order.id ? { ...o, status: updated.status } : o))
      );
      if (selectedOrder?.id === order.id) {
        setSelectedOrder((prev) => ({ ...prev, status: updated.status }));
      }
    } catch (err) {
      alert(err.message || "تعذر تحديث حالة الطلب");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (order) => {
    if (!confirm(`متأكد إنك بدك تحذف الطلب #${order.id.slice(-6)}؟`)) return;

    try {
      await orderService.deleteOrder(order.id);
      setOrders((prev) => prev.filter((o) => o.id !== order.id));
      if (selectedOrder?.id === order.id) setSelectedOrder(null);
    } catch (err) {
      alert(err.message || "تعذر حذف الطلب");
    }
  };

  return (
    <main dir="rtl" className="min-h-screen bg-[#1a1613] px-4 py-10 md:px-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <h1 className="font-display text-3xl text-[#f2ede4]">إدارة الطلبات</h1>
          <p className="mt-1 font-body text-sm text-[#a9a196]">
            {orders.length} طلب
          </p>
        </header>

        {isLoading && (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-16 animate-pulse rounded-lg bg-[#211c17]" />
            ))}
          </div>
        )}

        {!isLoading && error && (
          <p className="font-body text-sm text-[#c96a5a]">{error}</p>
        )}

        {!isLoading && !error && (
          <div className="overflow-hidden rounded-lg border border-[#2a251f]">
            <table className="w-full text-right">
              <thead className="bg-[#211c17]">
                <tr>
                  <th className="p-4 font-body text-xs text-[#a9a196]">الطلب</th>
                  <th className="p-4 font-body text-xs text-[#a9a196]">التاريخ</th>
                  <th className="p-4 font-body text-xs text-[#a9a196]">المجموع</th>
                  <th className="p-4 font-body text-xs text-[#a9a196]">الحالة</th>
                  <th className="p-4 font-body text-xs text-[#a9a196]"></th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-t border-[#2a251f]">
                    <td className="p-4 font-body text-sm text-[#f2ede4]">
                      #{order.id.slice(-6)}
                    </td>
                    <td className="p-4 font-body text-xs text-[#a9a196]">
                      {order.createdAt &&
                        new Date(order.createdAt).toLocaleDateString("ar")}
                    </td>
                    <td className="p-4 font-display text-sm text-[#c69749]">
                      {order.total.toLocaleString("ar")} ₪
                    </td>
                    <td className="p-4">
                      <select
                        value={order.status}
                        disabled={updatingId === order.id}
                        onChange={(e) => handleStatusChange(order, e.target.value)}
                        className={`rounded-md border border-[#3a342c] bg-[#1a1613] px-2 py-1 font-body text-xs outline-none focus:border-[#c69749] ${
                          STATUS_COLORS[order.status] ?? "text-[#a9a196]"
                        }`}
                      >
                        {Object.entries(STATUS_LABELS).map(([value, label]) => (
                          <option key={value} value={value} className="text-[#1a1613]">
                            {label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="space-x-2 space-x-reverse p-4 text-left">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="rounded-md border border-[#3a342c] px-3 py-1.5 font-body text-xs text-[#a9a196] hover:border-[#c69749]/50"
                      >
                        التفاصيل
                      </button>
                      <button
                        onClick={() => handleDelete(order)}
                        className="rounded-md border border-[#c96a5a]/40 px-3 py-1.5 font-body text-xs text-[#c96a5a] hover:bg-[#c96a5a]/10"
                      >
                        حذف
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {orders.length === 0 && (
              <p className="p-8 text-center font-body text-sm text-[#a9a196]">
                ما في طلبات بعد
              </p>
            )}
          </div>
        )}
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-lg rounded-lg border border-[#2a251f] bg-[#211c17] p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-xl text-[#f2ede4]">
                تفاصيل الطلب #{selectedOrder.id.slice(-6)}
              </h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="font-body text-sm text-[#a9a196] hover:text-[#f2ede4]"
              >
                إغلاق
              </button>
            </div>

            <div className="space-y-3">
              {selectedOrder.items.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between border-b border-[#2a251f] pb-2 font-body text-sm"
                >
                  <span className="text-[#f2ede4]">
                    {item.name} × {item.quantity}
                  </span>
                  <span className="text-[#c69749]">
                    {(item.price * item.quantity).toLocaleString("ar")} ₪
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 space-y-1 font-body text-xs text-[#a9a196]">
              <div className="flex justify-between">
                <span>المجموع الفرعي</span>
                <span>{selectedOrder.subtotal.toLocaleString("ar")} ₪</span>
              </div>
              <div className="flex justify-between">
                <span>الشحن</span>
                <span>{selectedOrder.shippingFee.toLocaleString("ar")} ₪</span>
              </div>
              <div className="flex justify-between">
                <span>الضريبة</span>
                <span>{selectedOrder.tax.toLocaleString("ar")} ₪</span>
              </div>
              {selectedOrder.discount > 0 && (
                <div className="flex justify-between">
                  <span>الخصم</span>
                  <span>-{selectedOrder.discount.toLocaleString("ar")} ₪</span>
                </div>
              )}
              <div className="flex justify-between pt-2 font-display text-sm text-[#f2ede4]">
                <span>الإجمالي</span>
                <span>{selectedOrder.total.toLocaleString("ar")} ₪</span>
              </div>
            </div>

            {selectedOrder.shippingAddress && (
              <div className="mt-4 border-t border-[#2a251f] pt-3 font-body text-xs text-[#a9a196]">
                <p className="mb-1 text-[#f2ede4]">عنوان الشحن</p>
                <p>{JSON.stringify(selectedOrder.shippingAddress)}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
