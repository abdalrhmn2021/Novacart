import api from "@/services/api";

function normalizeOrder(raw) {
  return {
    id: raw._id ?? raw.id,
    items: (raw.items || []).map((item) => ({
      productId: item.product?._id ?? item.product,
      name: item.product?.name ?? item.name ?? "",
      price: item.product?.price ?? item.price ?? 0,
      image: item.product?.image ?? item.image ?? null,
      quantity: item.quantity ?? 1,
    })),
    shippingAddress: raw.shippingAddress ?? null,
    paymentMethod: raw.paymentMethod ?? null,
    subtotal: Number(raw.subtotal ?? 0),
    shippingFee: Number(raw.shippingFee ?? 0),
    tax: Number(raw.tax ?? 0),
    discount: Number(raw.discount ?? 0),
    total:
      Number(raw.subtotal ?? 0) +
      Number(raw.shippingFee ?? 0) +
      Number(raw.tax ?? 0) -
      Number(raw.discount ?? 0),
    status: raw.status ?? "pending",
    createdAt: raw.createdAt ?? null,
  };
}
export const orderService = {
  async getMyOrders() {
    const res = await api.get("/orders");
    return Array.isArray(res.data) ? res.data.map(normalizeOrder) : [];
  },

  async getOrderById(id) {
    const res = await api.get(`/orders/${id}`);
    return normalizeOrder(res.data);
  },

  async createOrder(payload) {
    const res = await api.post("/orders", payload);
    return normalizeOrder(res.data);
  },

  async updateOrderStatus(id, status) {
    const res = await api.put(`/orders/${id}/status`, { status });
    return normalizeOrder(res.data);
  },

  async deleteOrder(id) {
    return api.delete(`/orders/${id}`);
  },

  async getAllOrders() {
    const res = await api.get("/orders/admin");

    return Array.isArray(res.data) ? res.data.map(normalizeOrder) : [];
  },
  async deleteAllOrders() {
    return api.delete("/orders");
  },
  async updateOrderItems(orderId, items) {
    const res = await api.put(`/orders/${orderId}/items`, { items });
    return res.data;
  },
};
