import api from "./api";

export const paymentService = {
  createCheckoutSession: async (orderId) => {
    const res = await api.post("/payment/create-checkout-session", { orderId });
    return res.data;
  },
};

export default paymentService;