"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/hooks/context/CartContext";

export default function ProductCard({ product }) {
  const { addItem } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.inStock) return;
    addItem(product);
  };

  return (
    <Link
      href={`/products/${product.id}`}
      className="group relative flex flex-col overflow-hidden rounded-lg border border-[#2a251f] bg-[#211c17] transition-colors hover:border-[#c69749]/50"
    >
      {product.isNew && (
        <span className="absolute right-3 top-3 z-10 rounded-full bg-[#c69749] px-2.5 py-1 text-xs font-body text-[#1a1613]">
          جديد
        </span>
      )}

      <div className="relative aspect-square w-full overflow-hidden bg-[#1a1613]">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {!product.inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <span className="font-body text-sm text-white/90">نفدت الكمية</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <span className="font-body text-xs text-[#a9a196]">
          {product.category}
        </span>
        <h3 className="font-display text-base text-[#f2ede4] line-clamp-1">
          {product.name}
        </h3>

        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-lg text-[#c69749]">
              {product.price.toLocaleString("ar")} ₪
            </span>
            {product.oldPrice && (
              <span className="font-body text-xs text-[#7a736a] line-through">
                {product.oldPrice.toLocaleString("ar")} ₪
              </span>
            )}
          </div>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className="relative z-10 mt-2 w-full rounded-md border border-[#c69749] py-2 font-body text-sm text-[#c69749] transition-colors hover:bg-[#c69749] hover:text-[#1a1613] disabled:cursor-not-allowed disabled:border-[#3a342c] disabled:text-[#5a544a] disabled:hover:bg-transparent disabled:hover:text-[#5a544a]"
        >
          أضف إلى السلة
        </button>
      </div>
    </Link>
  );
}