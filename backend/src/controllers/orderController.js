const Order = require("../models/Order");
const Product = require("../models/Product");
const { HttpError, assertAvailable } = require("../utils/stock");

const MAX_QUANTITY = 99;

function sendError(res, error) {
  if (error instanceof HttpError) {
    return res.status(error.status).json({ message: error.message });
  }
  if (error.name === "ValidationError") {
    return res.status(400).json({ message: error.message });
  }
  console.error(error);
  return res.status(500).json({ message: "حدث خطأ غير متوقع" });
}

function parseQuantity(value) {
  const quantity = Number(value);
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY) {
    throw new HttpError(400, `الكمية يجب أن تكون رقماً صحيحاً بين 1 و ${MAX_QUANTITY}`);
  }
  return quantity;
}

// POST /api/orders
const createOrder = async (req, res) => {
  try {
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      throw new HttpError(400, "السلة فارغة");
    }

    // Merge duplicate products so stock is checked against the total quantity.
    const quantities = new Map();
    for (const item of items) {
      const id = String(item.productId);
      quantities.set(id, (quantities.get(id) || 0) + parseQuantity(item.quantity));
    }

    // Prices always come from the database, never from the client.
    const orderItems = await Promise.all(
      [...quantities].map(async ([productId, quantity]) => {
        const product = await Product.findById(productId).catch(() => null);
        if (!product) {
          throw new HttpError(404, `المنتج غير موجود: ${productId}`);
        }
        assertAvailable(product, quantity);
        return {
          product: product._id,
          name: product.name,
          price: product.price,
          image: product.image || "",
          quantity,
        };
      }),
    );

    const subtotal = orderItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    );
    const shippingFee = 0;
    const tax = 0;
    const discount = 0;

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      paymentMethod: "card",
      subtotal,
      shippingFee,
      tax,
      discount,
      total: subtotal + shippingFee + tax - discount,
    });

    res.status(201).json(order);
  } catch (error) {
    sendError(res, error);
  }
};

// GET /api/orders → current user's orders
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("items.product", "name price image")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    sendError(res, error);
  }
};

// GET /api/orders/admin → all orders (admin only, enforced in the route)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    sendError(res, error);
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("items.product", "name price image")
      .catch(() => null);

    if (!order) {
      throw new HttpError(404, "Order not found");
    }

    const isOwner = order.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      throw new HttpError(403, "Forbidden");
    }

    res.status(200).json(order);
  } catch (error) {
    sendError(res, error);
  }
};

// PUT /api/orders/:id and /api/orders/:id/status → admin updates status / shipping info.
// Only whitelisted fields can change: totals and payment state stay server-controlled.
const ADMIN_EDITABLE_FIELDS = ["status", "shippingAddress"];

const updateOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).catch(() => null);
    if (!order) {
      throw new HttpError(404, "Order not found");
    }

    for (const field of ADMIN_EDITABLE_FIELDS) {
      if (req.body[field] !== undefined) {
        order[field] = req.body[field];
      }
    }

    await order.save();
    res.status(200).json(order);
  } catch (error) {
    sendError(res, error);
  }
};

// DELETE /api/orders/:id → customers can delete their own unpaid orders.
// Paid orders are financial records and are never deleted by customers.
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).catch(() => null);
    if (!order) {
      throw new HttpError(404, "Order not found");
    }

    const isOwner = order.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      throw new HttpError(403, "Forbidden");
    }

    if (order.paymentStatus === "paid" && !isAdmin) {
      throw new HttpError(400, "لا يمكن حذف طلب تم دفعه");
    }

    await order.deleteOne();
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    sendError(res, error);
  }
};

// DELETE /api/orders → delete all of the current user's unpaid orders
const deleteMyOrders = async (req, res) => {
  try {
    const result = await Order.deleteMany({
      user: req.user._id,
      paymentStatus: { $ne: "paid" },
    });

    res.status(200).json({
      message: "تم حذف الطلبات غير المدفوعة",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    sendError(res, error);
  }
};

// PUT /api/orders/:id/items → change quantities / remove items before payment (owner only)
const updateOrderItems = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).catch(() => null);
    if (!order) {
      throw new HttpError(404, "Order not found");
    }

    if (order.user.toString() !== req.user._id.toString()) {
      throw new HttpError(403, "Forbidden");
    }

    if (order.paymentStatus === "paid") {
      throw new HttpError(400, "لا يمكن تعديل طلب تم دفعه بالفعل");
    }

    const { items } = req.body; // [{ product: id, quantity }]

    if (!Array.isArray(items) || items.length === 0) {
      throw new HttpError(400, "السلة فارغة");
    }

    // Items can only be kept or changed, never added: stored prices stay.
    const orderItems = await Promise.all(
      items.map(async (item) => {
        const existing = order.items.find(
          (i) => i.product.toString() === String(item.product),
        );
        if (!existing) {
          throw new HttpError(400, `المنتج غير موجود في هذا الطلب: ${item.product}`);
        }
        const quantity = parseQuantity(item.quantity);
        const product = await Product.findById(existing.product);
        if (!product) {
          throw new HttpError(400, `المنتج لم يعد متوفراً: ${existing.name}`);
        }
        assertAvailable(product, quantity);
        return { ...existing.toObject(), quantity };
      }),
    );

    order.items = orderItems;
    order.subtotal = orderItems.reduce((acc, i) => acc + i.price * i.quantity, 0);
    order.total = order.subtotal + order.shippingFee + order.tax - order.discount;

    await order.save();
    res.status(200).json(order);
  } catch (error) {
    sendError(res, error);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrder,
  updateOrderItems,
  deleteOrder,
  deleteMyOrders,
};
