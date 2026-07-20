const Order = require("../models/Order");
const Product = require("../models/Product"); 

const createOrder = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "السلة فارغة" });
    }

    // جيبي تفاصيل كل منتج من قاعدة البيانات، ما تثقي بالسعر القادم من الفرونت
    const orderItems = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item.productId);
        if (!product) {
          throw new Error(`المنتج غير موجود: ${item.productId}`);
        }
        return {
          product: product._id,
          name: product.name,
          price: product.price,
          image: product.image || "",
          quantity: item.quantity,
        };
      })
    );

    const subtotal = orderItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    const shippingFee = 0; // عدّليها لو عندك رسوم شحن ثابتة
    const tax = 0;
    const discount = 0;
    const total = subtotal + shippingFee + tax - discount;

    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      paymentMethod: "card",
      subtotal,
      shippingFee,
      tax,
      discount,
      total,
    });

    res.status(201).json(order);
  } catch (error) {
    console.error("CREATE ORDER ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// GET /api/orders  → طلبات المستخدم الحالي فقط
const getMyOrders = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const orders = await Order.find({ user: req.user.id })
      .populate("items.product", "name price image")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/orders/admin  → كل الطلبات (لازم middleware يتحقق إن req.user.role === "admin")
const getAllOrders = async (req, res) => {
  try {

    console.log("USER:", req.user);

    const orders = await Order.find();

    console.log("ORDERS:", orders);

    res.status(200).json(orders);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};
const getOrderById = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }
    const order = await Order.findById(req.params.id).populate(
      "items.product",
      "name price image",
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const isOwner = order.user.toString() === req.user.id;
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Forbidden" });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateOrder = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Only admin can update orders",
      });
    }
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    Object.assign(order, req.body);

    await order.save();

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteOrder = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const isOwner = order.user.toString() === req.user.id;
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await order.deleteOne();

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/orders  → حذف كل طلبات المستخدم الحالي دفعة وحدة
const deleteMyOrders = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const result = await Order.deleteMany({ user: req.user.id });

    res.status(200).json({
      message: "تم حذف كل الطلبات",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// أضف الدالة دي في backend/src/controllers/orderController.js

// PUT /api/orders/:id/items  → تعديل كمية/حذف عنصر قبل الدفع (المالك فقط)
const updateOrderItems = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const isOwner = order.user.toString() === req.user.id;
    if (!isOwner) {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (order.paymentStatus === "paid") {
      return res
        .status(400)
        .json({ message: "لا يمكن تعديل طلب تم دفعه بالفعل" });
    }

    const { items } = req.body; // [{ product: id, quantity }]

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "السلة فارغة" });
    }

    // نعيد بناء items بنفس منطق createOrder (نثق بالداتابيز مش بالفرونت للسعر)
    const orderItems = await Promise.all(
      items.map(async (item) => {
        const existing = order.items.find(
          (i) => i.product.toString() === item.product,
        );
        if (!existing) {
          throw new Error(`المنتج غير موجود في هذا الطلب: ${item.product}`);
        }
        return { ...existing.toObject(), quantity: item.quantity };
      }),
    );

    order.items = orderItems;
    order.subtotal = orderItems.reduce(
      (acc, i) => acc + i.price * i.quantity,
      0,
    );
    order.total =
      order.subtotal + order.shippingFee + order.tax - order.discount;

    await order.save();

    res.status(200).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// وضيفها في module.exports:
module.exports = {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrder,
  updateOrderItems, // ← جديد
  deleteOrder,
  deleteMyOrders,
};

