const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const Order = require("../models/Order");
const Product = require("../models/Product");
const { HttpError, assertAvailable, decrementStock } = require("../utils/stock");

const createCheckoutSession = async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId).catch(() => null);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "غير مسموح لك بدفع هذا الطلب" });
    }

    if (order.paymentStatus === "paid") {
      return res.status(400).json({ message: "هذا الطلب مدفوع أصلاً" });
    }

    // Stock may have changed since the order was created: check again before charging.
    for (const item of order.items) {
      const product = await Product.findById(item.product);
      if (!product) {
        throw new HttpError(400, `المنتج لم يعد متوفراً: ${item.name}`);
      }
      assertAvailable(product, item.quantity);
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: order.items.map((item) => ({
        price_data: {
          currency: "ils",
          product_data: {
            name: item.name,
            images: item.image ? [item.image] : [],
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      metadata: { orderId: order._id.toString() },
      success_url: `${process.env.FRONTEND_URL}/payment/success?order=${order._id}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment/cancel?order=${order._id}`,
    });

    order.stripeSessionId = session.id;
    await order.save();

    res.json({ url: session.url });
  } catch (error) {
    if (error instanceof HttpError) {
      return res.status(error.status).json({ message: error.message });
    }
    console.error(error);
    res.status(500).json({ message: "تعذر إنشاء جلسة الدفع" });
  }
};

const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (error) {
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      // Stripe can deliver the same event more than once. The filter on
      // paymentStatus makes this update happen only the first time, so stock
      // is decremented exactly once per order.
      const order = await Order.findOneAndUpdate(
        { _id: session.metadata.orderId, paymentStatus: { $ne: "paid" } },
        { paymentStatus: "paid", status: "processing", paidAt: new Date() },
        { new: true },
      );

      if (order) {
        await decrementStock(order.items);
      }
    }

    res.json({ received: true });
  } catch (error) {
    // A 500 makes Stripe retry the event later.
    console.error("Webhook handling failed:", error);
    res.status(500).json({ message: "Webhook handling failed" });
  }
};

module.exports = { createCheckoutSession, stripeWebhook };
