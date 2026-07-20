"use client";

import { useState } from "react";
import { useCart } from "@/hooks/context/CartContext";
import { orderService } from "@/services/orderService";
import { paymentService } from "@/services/paymentService";

export function useCheckout() {
  const { items, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  // overrideItems: لو بدك تدفعي لقائمة منتجات محسوبة يدوياً (مثلاً سلة + منتج جديد لسا ما انحدث بالـ context)
  // إذا ما انبعتت، بتستخدم items الحالية من الكارت (سلوك الكارت العادي)
  const checkout = async (overrideItems) => {
    const checkoutItems = overrideItems || items;

    if (!checkoutItems || checkoutItems.length === 0) {
      setError("لا يوجد منتجات للشراء");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const order = await orderService.createOrder({
        items: checkoutItems.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
      });

      const payment = await paymentService.createCheckoutSession(order.id);

      clearCart(); // نفضي السلة بس بعد ما نجحت جلسة الدفع فعلياً

      window.location.href = payment.url;
    } catch (err) {
      setError(err.message || "تعذر إنشاء الطلب، حاول مرة أخرى");
      setIsProcessing(false);
    }
  };

  return { checkout, isProcessing, error };
}