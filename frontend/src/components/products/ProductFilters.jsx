// components/products/ProductFilters.jsx
"use client";

export default function ProductFilters({
  categories,
  activeCategory,
  onCategoryChange,
  sort,
  onSortChange,
  search,
  onSearchChange,
}) {
  console.log("categories =>", categories);
  return (
    <div className="flex flex-col gap-4 border-b border-[#2a251f] pb-6 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onCategoryChange(null)}
          className={`rounded-full border px-4 py-1.5 font-body text-sm transition-colors ${
            !activeCategory
              ? "border-[#c69749] bg-[#c69749] text-[#1a1613]"
              : "border-[#3a342c] text-[#a9a196] hover:border-[#c69749]/60"
          }`}
        >
          الكل
        </button>
        {Array.isArray(categories) &&
          categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`rounded-full border px-4 py-1.5 font-body text-sm transition-colors ${
                activeCategory === cat.id
                  ? "border-[#c69749] bg-[#c69749] text-[#1a1613]"
                  : "border-[#3a342c] text-[#a9a196] hover:border-[#c69749]/60"
              }`}
            >
              {cat.name}
            </button>
          ))}
      </div>

      <div className="flex gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="ابحث عن منتج..."
          className="w-full rounded-md border border-[#3a342c] bg-[#211c17] px-3 py-2 font-body text-sm text-[#f2ede4] placeholder:text-[#7a736a] focus:border-[#c69749] focus:outline-none md:w-56"
        />

        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className="rounded-md border border-[#3a342c] bg-[#211c17] px-3 py-2 font-body text-sm text-[#f2ede4] focus:border-[#c69749] focus:outline-none"
        >
          <option value="newest">الأحدث</option>
          <option value="price_asc">السعر: من الأقل للأعلى</option>
          <option value="price_desc">السعر: من الأعلى للأقل</option>
          <option value="rating">الأعلى تقييمًا</option>
        </select>
      </div>
    </div>
  );
}
