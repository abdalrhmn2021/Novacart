

"use client";

import { useEffect, useState, useCallback } from "react";
import { categoryService } from "@/services/category.service";
import ProductImageUpload from "@/components/products/ProductImageUpload";

const emptyForm = {
  name: "",
  description: "",
  image: "",
  sortOrder: 0,
  isActive: true,
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState(null);

  const loadCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await categoryService.getCategories();
      setCategories(data);
    } catch (err) {
      setError(err.message || "تعذر تحميل التصنيفات");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadCategories();
  }, [loadCategories]);

  const openCreateForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormError(null);
    setShowForm(true);
  };

  const openEditForm = (category) => {
    setEditingId(category._id);
    setForm({
      name: category.name,
      description: category.description || "",
      image: category.image || "",
      sortOrder: category.sortOrder ?? 0,
      isActive: category.isActive,
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
    setIsSaving(true);
    setFormError(null);

    const payload = {
      name: form.name,
      description: form.description,
      image: form.image,
      sortOrder: Number(form.sortOrder) || 0,
      isActive: form.isActive,
    };

    try {
      if (editingId) {
        await categoryService.updateCategory(editingId, payload);
      } else {
        await categoryService.createCategory(payload);
      }
      closeForm();
      await loadCategories();
    } catch (err) {
      setFormError(err.message || "تعذر حفظ التصنيف");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (category) => {
    if (!confirm(`متأكد إنك بدك تحذف تصنيف "${category.name}"؟`)) return;

    try {
      await categoryService.deleteCategory(category._id);
      setCategories((prev) => prev.filter((c) => c._id !== category._id));
    } catch (err) {
      alert(err.message || "تعذر حذف التصنيف");
    }
  };

  return (
    <main dir="rtl" className="min-h-screen bg-[#1a1613] px-4 py-10 md:px-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl text-[#f2ede4]">
              إدارة التصنيفات
            </h1>
            <p className="mt-1 font-body text-sm text-[#a9a196]">
              {categories.length} تصنيف
            </p>
          </div>

          <button
            onClick={openCreateForm}
            className="rounded-md bg-[#c69749] px-5 py-2.5 font-body text-sm text-[#1a1613] hover:bg-[#b08540]"
          >
            + تصنيف جديد
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
                    التصنيف
                  </th>
                  <th className="p-4 font-body text-xs text-[#a9a196]">
                    الترتيب
                  </th>
                  <th className="p-4 font-body text-xs text-[#a9a196]">
                    الحالة
                  </th>
                  <th className="p-4 font-body text-xs text-[#a9a196]"></th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category._id} className="border-t border-[#2a251f]">
                    <td className="flex items-center gap-3 p-4">
                      {category.image && (
                        <img
                          src={category.image}
                          alt={category.name}
                          className="h-10 w-10 rounded-md object-cover"
                        />
                      )}
                      <span className="font-body text-sm text-[#f2ede4]">
                        {category.name}
                      </span>
                    </td>
                    <td className="p-4 font-body text-sm text-[#a9a196]">
                      {category.sortOrder}
                    </td>
                    <td className="p-4 font-body text-xs">
                      <span
                        className={
                          category.isActive
                            ? "text-[#8fae7c]"
                            : "text-[#c96a5a]"
                        }
                      >
                        {category.isActive ? "فعّال" : "غير فعّال"}
                      </span>
                    </td>
                    <td className="space-x-2 space-x-reverse p-4 text-left">
                      <button
                        onClick={() => openEditForm(category)}
                        className="rounded-md border border-[#3a342c] px-3 py-1.5 font-body text-xs text-[#a9a196] hover:border-[#c69749]/50"
                      >
                        تعديل
                      </button>
                      <button
                        onClick={() => handleDelete(category)}
                        className="rounded-md border border-[#c96a5a]/40 px-3 py-1.5 font-body text-xs text-[#c96a5a] hover:bg-[#c96a5a]/10"
                      >
                        حذف
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {categories.length === 0 && (
              <p className="p-8 text-center font-body text-sm text-[#a9a196]">
                ما في تصنيفات بعد
              </p>
            )}
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-lg rounded-lg border border-[#2a251f] bg-[#211c17] p-6">
            <h2 className="mb-4 font-display text-xl text-[#f2ede4]">
              {editingId ? "تعديل تصنيف" : "تصنيف جديد"}
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

              <div>
                <label className="mb-1 block font-body text-xs text-[#a9a196]">
                  الوصف (اختياري)
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  rows={2}
                  className="w-full rounded-md border border-[#3a342c] bg-[#1a1613] px-3 py-2 font-body text-sm text-[#f2ede4] outline-none focus:border-[#c69749]"
                />
              </div>

              <div>
                <label className="mb-1 block font-body text-xs text-[#a9a196]">
                  صورة التصنيف (اختياري)
                </label>
                <ProductImageUpload
                  value={form.image}
                  onChange={(url) => handleChange("image", url)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block font-body text-xs text-[#a9a196]">
                    الترتيب
                  </label>
                  <input
                    type="number"
                    value={form.sortOrder}
                    onChange={(e) => handleChange("sortOrder", e.target.value)}
                    className="w-full rounded-md border border-[#3a342c] bg-[#1a1613] px-3 py-2 font-body text-sm text-[#f2ede4] outline-none focus:border-[#c69749]"
                  />
                </div>
                <label className="flex items-center gap-2 self-end pb-2 font-body text-sm text-[#a9a196]">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => handleChange("isActive", e.target.checked)}
                  />
                  فعّال
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
