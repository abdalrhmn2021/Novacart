"use client";

import { useEffect, useState, useCallback } from "react";
import { productService } from "@/services/productService";
import ProductImageUpload from "@/components/products/ProductImageUpload";

const emptyForm = {
  name: "",
  price: "",
  oldPrice: "",
  image: "",
  category: "",
  inStock: true,
  isNew: false,
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState(null);

  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await productService.getProducts({ page: 1, limit: 100 });
      setProducts(data.products);
    } catch (err) {
      setError(err.message || "تعذر تحميل المنتجات");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadProducts();
  }, [loadProducts]);

  const openCreateForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormError(null);
    setShowForm(true);
  };

  const openEditForm = (product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      price: product.price,
      oldPrice: product.oldPrice ?? "",
      image: product.image,
      category: product.category,
      inStock: product.inStock,
      isNew: product.isNew,
    });
    setFormError(null);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    setFormError(null);
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.image) {
      setFormError("الرجاء رفع صورة للمنتج");
      return;
    }

    setIsSaving(true);
    setIsSaving(true);
    setFormError(null);

    const payload = {
      name: form.name,
      price: Number(form.price),
      oldPrice: form.oldPrice ? Number(form.oldPrice) : null,
      image: form.image,
      category: form.category,
      inStock: form.inStock,
      isNew: form.isNew,
    };

    try {
      if (editingId) {
        await productService.updateProduct(editingId, payload);
      } else {
        await productService.createProduct(payload);
      }
      closeForm();
      await loadProducts();
    } catch (err) {
      setFormError(err.message || "تعذر حفظ المنتج");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (product) => {
    if (!confirm(`متأكد إنك بدك تحذف "${product.name}"؟`)) return;

    try {
      await productService.deleteProduct(product.id);
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
    } catch (err) {
      alert(err.message || "تعذر حذف المنتج");
    }
  };

  return (
    <main dir="rtl" className="min-h-screen bg-[#1a1613] px-4 py-10 md:px-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl text-[#f2ede4]">
              إدارة المنتجات
            </h1>
            <p className="mt-1 font-body text-sm text-[#a9a196]">
              {products.length} منتج
            </p>
          </div>

          <button
            onClick={openCreateForm}
            className="rounded-md bg-[#c69749] px-5 py-2.5 font-body text-sm text-[#1a1613] hover:bg-[#b08540]"
          >
            + منتج جديد
          </button>
        </header>

        {isLoading && (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-16 animate-pulse rounded-lg bg-[#211c17]"
              />
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
                  <th className="p-4 font-body text-xs text-[#a9a196]">
                    المنتج
                  </th>
                  <th className="p-4 font-body text-xs text-[#a9a196]">
                    التصنيف
                  </th>
                  <th className="p-4 font-body text-xs text-[#a9a196]">
                    السعر
                  </th>
                  <th className="p-4 font-body text-xs text-[#a9a196]">
                    الحالة
                  </th>
                  <th className="p-4 font-body text-xs text-[#a9a196]"></th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-t border-[#2a251f]">
                    <td className="flex items-center gap-3 p-4">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-10 w-10 rounded-md object-cover"
                      />
                      <span className="font-body text-sm text-[#f2ede4]">
                        {product.name}
                      </span>
                    </td>
                    <td className="p-4 font-body text-sm text-[#a9a196]">
                      {product.category}
                    </td>
                    <td className="p-4 font-display text-sm text-[#c69749]">
                      {product.price.toLocaleString("ar")} ₪
                    </td>
                    <td className="p-4 font-body text-xs">
                      <span
                        className={
                          product.inStock ? "text-[#8fae7c]" : "text-[#c96a5a]"
                        }
                      >
                        {product.inStock ? "متوفر" : "نفدت الكمية"}
                      </span>
                    </td>
                    <td className="space-x-2 space-x-reverse p-4 text-left">
                      <button
                        onClick={() => openEditForm(product)}
                        className="rounded-md border border-[#3a342c] px-3 py-1.5 font-body text-xs text-[#a9a196] hover:border-[#c69749]/50"
                      >
                        تعديل
                      </button>
                      <button
                        onClick={() => handleDelete(product)}
                        className="rounded-md border border-[#c96a5a]/40 px-3 py-1.5 font-body text-xs text-[#c96a5a] hover:bg-[#c96a5a]/10"
                      >
                        حذف
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {products.length === 0 && (
              <p className="p-8 text-center font-body text-sm text-[#a9a196]">
                ما في منتجات بعد
              </p>
            )}
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-lg rounded-lg border border-[#2a251f] bg-[#211c17] p-6">
            <h2 className="mb-4 font-display text-xl text-[#f2ede4]">
              {editingId ? "تعديل منتج" : "منتج جديد"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="mb-1 block font-body text-xs text-[#a9a196]">
                  الاسم
                </label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="w-full rounded-md border border-[#3a342c] bg-[#1a1613] px-3 py-2 font-body text-sm text-[#f2ede4] outline-none focus:border-[#c69749]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block font-body text-xs text-[#a9a196]">
                    السعر
                  </label>
                  <input
                    required
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={(e) => handleChange("price", e.target.value)}
                    className="w-full rounded-md border border-[#3a342c] bg-[#1a1613] px-3 py-2 font-body text-sm text-[#f2ede4] outline-none focus:border-[#c69749]"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-body text-xs text-[#a9a196]">
                    السعر قبل الخصم (اختياري)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.oldPrice}
                    onChange={(e) => handleChange("oldPrice", e.target.value)}
                    className="w-full rounded-md border border-[#3a342c] bg-[#1a1613] px-3 py-2 font-body text-sm text-[#f2ede4] outline-none focus:border-[#c69749]"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block font-body text-xs text-[#a9a196]">
                  صورة المنتج
                </label>
                <ProductImageUpload
                  value={form.image}
                  onChange={(url) => handleChange("image", url)}
                />
              </div>

              <div>
                <label className="mb-1 block font-body text-xs text-[#a9a196]">
                  التصنيف
                </label>
                <input
                  required
                  value={form.category}
                  onChange={(e) => handleChange("category", e.target.value)}
                  className="w-full rounded-md border border-[#3a342c] bg-[#1a1613] px-3 py-2 font-body text-sm text-[#f2ede4] outline-none focus:border-[#c69749]"
                />
              </div>

              <div className="flex items-center gap-6 pt-1">
                <label className="flex items-center gap-2 font-body text-sm text-[#a9a196]">
                  <input
                    type="checkbox"
                    checked={form.inStock}
                    onChange={(e) => handleChange("inStock", e.target.checked)}
                  />
                  متوفر بالمخزون
                </label>
                <label className="flex items-center gap-2 font-body text-sm text-[#a9a196]">
                  <input
                    type="checkbox"
                    checked={form.isNew}
                    onChange={(e) => handleChange("isNew", e.target.checked)}
                  />
                  منتج جديد
                </label>
              </div>

              {formError && (
                <p className="font-body text-xs text-[#c96a5a]">{formError}</p>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-md border border-[#3a342c] px-4 py-2 font-body text-sm text-[#a9a196]"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-md bg-[#c69749] px-5 py-2 font-body text-sm text-[#1a1613] disabled:opacity-60"
                >
                  {isSaving ? "جارِ الحفظ..." : "حفظ"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
