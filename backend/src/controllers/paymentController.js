const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const Order = require("../models/Order");

const createCheckoutSession = async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // تحقق إن الطلب يخص نفس المستخدم المسجل دخول
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "غير مسموح لك بدفع هذا الطلب" });
    }

    if (order.paymentStatus === "paid") {
      return res.status(400).json({ message: "هذا الطلب مدفوع أصلاً" });
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
    res.status(500).json({ message: error.message });
  }
};

const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    await Order.findByIdAndUpdate(session.metadata.orderId, {
      paymentStatus: "paid",
      status: "processing",
      paidAt: new Date(),
    });
  }

  res.json({ received: true });
};

module.exports = { createCheckoutSession, stripeWebhook };