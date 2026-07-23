"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { orderService } from "@/services/orderService";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;
    orderService.getOrderById(orderId).then(setOrder).finally(() => setLoading(false));
  }, [orderId]);

  return (
    <div className="max-w-md rounded-lg border border-[#2a251f] bg-[#211c17] p-8 text-center">
      <h1 className="font-display text-2xl text-[#c69749]">تم استلام طلبك بنجاح 🎉</h1>
      {loading && <p className="mt-4 font-body text-sm text-[#a9a196]">...جارِ التحقق</p>}
      {!loading && order && (
        <p className="mt-4 font-body text-sm text-[#a9a196]">
          رقم الطلب #{order.id.slice(-6)} — الحالة: {order.paymentStatus === "paid" ? "مدفوع" : "قيد التأكيد"}
        </p>
      )}
      <Link href="/orders" className="mt-6 inline-block rounded-md bg-[#c69749] px-6 py-2 font-body text-sm text-[#1a1613]">
        عرض طلباتي
      </Link>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <main dir="rtl" className="flex min-h-screen items-center justify-center bg-[#1a1613] px-4">
      <Suspense fallback={<p className="font-body text-sm text-[#a9a196]">...جارِ التحميل</p>}>
        <PaymentSuccessContent />
      </Suspense>
    </main>
  );
}