

const express = require("express");
const router = express.Router();

const { protect, isAdmin } = require("../middleware/auth");
const {
  createOrder,
  getOrderById,
  updateOrder,
  deleteOrder,
  deleteMyOrders,
  getMyOrders,
  getAllOrders,
  updateOrderItems,
} = require("../controllers/orderController");

router.get("/", protect, getMyOrders);

router.get("/admin", protect, isAdmin, getAllOrders);

router.delete("/", protect, deleteMyOrders); // حذف كل طلبات المستخدم الحالي

router.get("/:id", protect, getOrderById);

router.put("/:id", protect, isAdmin, updateOrder);

router.delete("/:id", protect, deleteOrder); // المستخدم يقدر يحذف طلبه هو (الكونترولر بيتحقق owner/admin)

router.post("/", protect, createOrder);
router.put("/:id/items", protect, updateOrderItems);

module.exports = router;
