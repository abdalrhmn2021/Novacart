const express = require("express");
const router = express.Router();

const { protect , isAdmin } = require("../middleware/auth");
const requireAdmin = require("../middleware/auth");
const { /* ... */ updateOrderItems } = require("../controllers/orderController");

const {
  createOrder,
  getOrderById,
  updateOrder,
  deleteOrder,
  deleteMyOrders,
  getMyOrders,
  getAllOrders,
} = require("../controllers/orderController");

router.get("/", protect, getMyOrders);

router.get("/admin", protect, isAdmin, getAllOrders);

router.delete("/", protect, deleteMyOrders); // حذف كل طلبات المستخدم الحالي

router.get("/:id", protect, getOrderById);

router.put("/:id", protect, isAdmin, updateOrder);

router.delete("/:id", protect, deleteOrder); // شلت requireAdmin — المستخدم يقدر يحذف طلبه هو

  
router.post("/", protect, createOrder);
router.put("/:id/items", protect, updateOrderItems);
module.exports = router;
