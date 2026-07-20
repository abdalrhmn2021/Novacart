"use client";

import { useState } from "react";
import { useCart } from "@/hooks/context/CartContext";
import { useCheckout } from "@/hooks/useCheckout";

export default function BuyNowButton({ product }) {
  const [quantity, setQuantity] = useState(1);
  const { items, addItem } = useCart();
  const { checkout, isProcessing, error } = useCheckout();

  const handleBuyNow = async () => {
    if (product.inStock === false) return;

    // نحسب القائمة يدوياً (السلة الحالية + هالمنتج) بدل الاعتماد
    // على تحديث الـ context اللي ما بيوصل فوراً بنفس اللحظة
    const existing = items.find((item) => item.id === product.id);

    const mergedItems = existing
      ? items.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      : [
          ...items,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity,
          },
        ];

    addItem(product, quantity); // نحدث الـ UI/localStorage عادي
    await checkout(mergedItems); // وندفع فوراً بالقائمة المحسوبة يدوياً
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1 rounded-md border border-[#3a342c]">
        <button
          type="button"
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className="h-8 w-8 font-body text-sm text-[#a9a196] hover:text-[#c69749]"
        >
          −
        </button>
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) =>
            setQuantity(Math.max(1, parseInt(e.target.value) || 1))
          }
          className="h-8 w-10 bg-transparent text-center font-body text-sm text-[#f2ede4] outline-none"
        />
        <button
          type="button"
          onClick={() => setQuantity((q) => q + 1)}
          className="h-8 w-8 font-body text-sm text-[#a9a196] hover:text-[#c69749]"
        >
          +
        </button>
      </div>

      <button
        onClick={handleBuyNow}
        disabled={isProcessing || product.inStock === false}
        className="rounded-md bg-[#c69749] px-5 py-2 font-body text-sm text-[#1a1613] transition-colors hover:bg-[#b08540] disabled:opacity-60"
      >
        {isProcessing ? "جارِ التحويل..." : "اشترِ الآن"}
      </button>

      {error && (
        <p className="font-body text-xs text-[#c96a5a]">{error}</p>
      )}
    </div>
  );
}