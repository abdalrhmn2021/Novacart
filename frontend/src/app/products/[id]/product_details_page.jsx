"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { productService } from "@/services/productService";
import { useCart } from "@/hooks/context/CartContext";
import ReviewSection from "@/app/products/ReviewSection";

export default function ProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const { addItem } = useCart();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    let isMounted = true;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true);
    setError(null);

    productService
      .getProductById(id)
      .then((data) => {
        if (isMounted) setProduct(data);
      })
      .catch((err) => {
        if (isMounted) setError(err.message || "تعذر تحميل المنتج");
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (isLoading) {
    return (
      <main dir="rtl" className="min-h-screen bg-[#1a1613] px-4 py-10 md:px-10">
        <div className="mx-auto max-w-5xl animate-pulse">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="aspect-square rounded-xl bg-[#241f1a]" />
            <div className="space-y-4">
              <div className="h-8 w-2/3 rounded bg-[#241f1a]" />
              <div className="h-4 w-1/3 rounded bg-[#241f1a]" />
              <div className="h-24 w-full rounded bg-[#241f1a]" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main dir="rtl" className="min-h-screen bg-[#1a1613] px-4 py-10 md:px-10">
        <div className="mx-auto max-w-5xl text-center">
          <p className="font-body text-[#a9a196]">
            {error || "المنتج غير موجود"}
          </p>
          <button
            onClick={() => router.push("/products")}
            className="mt-4 rounded-md border border-[#3a342c] px-4 py-2 font-body text-sm text-[#a9a196]"
          >
            الرجوع للمنتجات
          </button>
        </div>
      </main>
    );
  }

  return (
    <main dir="rtl" className="min-h-screen bg-[#1a1613] px-4 py-10 md:px-10">
      <div className="mx-auto max-w-5xl">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          {/* صورة المنتج */}
          <div className="relative aspect-square overflow-hidden rounded-xl bg-[#241f1a]">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {product.isNew && (
              <span className="absolute right-3 top-3 rounded-full bg-[#c69749] px-3 py-1 font-body text-xs text-[#1a1613]">
                جديد
              </span>
            )}
          </div>

          {/* تفاصيل المنتج */}
          <div>
            <p className="font-body text-sm text-[#c69749]">
              {product.category}
            </p>
            <h1 className="mt-1 font-display text-3xl text-[#f2ede4]">
              {product.name}
            </h1>

            <div className="mt-4 flex items-baseline gap-3">
              <span className="font-display text-2xl text-[#f2ede4]">
                {product.price.toLocaleString()} ₪
              </span>
              {product.oldPrice && (
                <span className="font-body text-sm text-[#6b6459] line-through">
                  {product.oldPrice.toLocaleString()} ₪
                </span>
              )}
            </div>

            <p className="mt-2 font-body text-sm">
              {product.inStock ? (
                <span className="text-[#8fae7c]">متوفر بالمخزون</span>
              ) : (
                <span className="text-[#c96a5a]">غير متوفر حاليًا</span>
              )}
            </p>

            {product.description && (
              <p className="mt-6 font-body text-sm leading-relaxed text-[#a9a196]">
                {product.description}
              </p>
            )}

            {/* اختيار الكمية */}
            <div className="mt-8 flex items-center gap-3">
              <span className="font-body text-sm text-[#a9a196]">الكمية</span>
              <div className="flex items-center rounded-md border border-[#3a342c]">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-1.5 font-body text-[#a9a196]"
                >
                  −
                </button>
                <span className="w-8 text-center font-body text-[#f2ede4]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3 py-1.5 font-body text-[#a9a196]"
                >
                  +
                </button>
              </div>
            </div>

            {/* زر الإضافة للسلة */}
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="mt-8 w-full rounded-md bg-[#c69749] py-3 font-body text-sm font-medium text-[#1a1613] transition disabled:cursor-not-allowed disabled:opacity-40 md:w-auto md:px-10"
            >
              {added ? "تمت الإضافة ✓" : "أضف إلى السلة"}
            </button>
          </div>
          <ReviewSection productId={product.id} />
        </div>
      </div>
    </main>
  );
}
