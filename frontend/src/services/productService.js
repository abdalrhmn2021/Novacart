import api from "@/services/api";
import { getCategories as fetchCategories } from "@/services/category.service";

export async function getTopProducts() {
  try {
    const res = await fetch("http://127.0.0.1:5000/api/products/top", {
      cache: "no-store",
    });

    console.log("STATUS:", res.status);

    return await res.json();
  } catch (error) {
    console.log("FETCH ERROR:", error);
    throw error;
  }
}

function normalizeProduct(raw) {
  const mainImage =
    raw.image ?? raw.thumbnail ?? raw.images?.[0] ?? "/images/placeholder.png";

  return {
    id: raw.id ?? raw._id,
    name: raw.name ?? raw.title ?? "",
    price: Number(raw.price ?? 0),
    oldPrice: raw.oldPrice ?? raw.compareAtPrice ?? null,
    image: mainImage,
    images:
      Array.isArray(raw.images) && raw.images.length > 0
        ? raw.images
        : [mainImage],
    description: raw.description ?? "",
    brand: raw.brand ?? "",
    sku: raw.sku ?? "",
    tags: Array.isArray(raw.tags) ? raw.tags : [],
    category: raw.category?.name ?? raw.category ?? "عام",
    categoryId: raw.category?._id ?? raw.category?.id ?? raw.categoryId ?? null,
    rating: raw.rating ?? 0,
    inStock: raw.inStock ?? (raw.stock ? raw.stock > 0 : true),
    isNew: raw.isNew ?? false,
  };
}

export const productService = {
  async getProducts(params = {}) {
    const query = new URLSearchParams();

    if (params.search) query.set("search", params.search);
    if (params.category) query.set("category", params.category);
    if (params.sort) query.set("sort", params.sort);

    query.set("page", params.page ?? 1);
    query.set("limit", params.limit ?? 12);

    const response = await api.get(`/products?${query.toString()}`);

    const data = response.data;

    return {
      products: (data.products || []).map(normalizeProduct),
      total: data.total || 0,
      page: data.page || 1,
      totalPages: data.totalPages || 1,
    };
  },

  async getProductById(id) {
    const response = await api.get(`/products/${id}`);
    return normalizeProduct(response.data);
  },

  async getTopProducts() {
    const response = await api.get("/products/top");

    return Array.isArray(response.data)
      ? response.data.map(normalizeProduct)
      : [];
  },

  async getCategories() {
    const categories = await fetchCategories();

    return categories.map((c) => ({
      id: c._id ?? c.id,
      name: c.name,
    }));
  },

  async createProduct(payload) {
    const response = await api.post("/products", payload);
    return normalizeProduct(response.data ?? response);
  },

  async updateProduct(id, payload) {
    const response = await api.put(`/products/${id}`, payload);
    return normalizeProduct(response.data ?? response);
  },

  async deleteProduct(id) {
    return api.delete(`/products/${id}`);
  },
};
