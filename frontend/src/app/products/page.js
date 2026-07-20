"use client";

import { useEffect, useState } from "react";
import { productService } from "@/services/productService";
import ProductFilters from "@/components/products/ProductFilters";
import ProductGrid from "@/components/products/ProductGrid";


export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState(null);
  const [sort, setSort] = useState("newest");
  const [search, setSearch] = useState("");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true);
    productService
      .getProducts({ category, sort, search })
      .then((data) => setProducts(data.products))
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [category, sort, search]);

  useEffect(() => {
    productService.getCategories().then(setCategories).catch(() => {});
  }, []);

  return (
    <main dir="rtl" className="min-h-screen bg-[#1a1613] px-4 py-10 md:px-10">
      <div className="mx-auto max-w-6xl">
        <ProductFilters
          categories={categories}
          activeCategory={category}
          onCategoryChange={setCategory}
          sort={sort}
          onSortChange={setSort}
          search={search}
          onSearchChange={setSearch}
        />
        <div className="mt-8">
          <ProductGrid products={products} isLoading={isLoading} error={error} />
        </div>
      </div>
    </main>
  );
}