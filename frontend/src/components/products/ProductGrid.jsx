// components/products/ProductGrid.jsx
"use client";

import ProductCard from "./ProductCard";

function SkeletonCard() {
  return (
    <div className="animate-pulse overflow-hidden rounded-lg border border-[#2a251f] bg-[#211c17]">
      <div className="aspect-square w-full bg-[#2a251f]" />
      <div className="space-y-2 p-4">
        <div className="h-3 w-1/3 rounded bg-[#2a251f]" />
        <div className="h-4 w-3/4 rounded bg-[#2a251f]" />
        <div className="h-4 w-1/2 rounded bg-[#2a251f]" />
      </div>
    </div>
  );
}

export default function ProductGrid({ products, isLoading, error }) {
  if (error) {
    return (
      <div className="flex flex-col items-center gap-2 py-20 text-center">
        <p className="font-body text-[#f2ede4]">تعذّر تحميل المنتجات</p>
        <p className="font-body text-sm text-[#7a736a]">{error}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-20 text-center">
        <p className="font-display text-lg text-[#f2ede4]">ما في منتجات مطابقة</p>
        <p className="font-body text-sm text-[#7a736a]">جرّب تغيير البحث أو الفلترة</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
