// ضع هذا الملف مكان: backend/src/route/categoryRoutes.js
// الفرق عن نسختك الحالية: أضفنا protect + isAdmin على عمليات الإنشاء/التعديل/الحذف
// (كانت هذه الراوتات مفتوحة لأي شخص بدون تسجيل دخول - ثغرة أمنية)

const express = require("express");
const router = express.Router();

const { protect, isAdmin } = require("../middleware/auth");

const {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

// القراءة متاحة للجميع (لازم تظهر الكاتيجوري بالمتجر لأي زائر)
router.get("/", getCategories);
router.get("/:id", getCategoryById);

// الكتابة للأدمن فقط
router.post("/", protect, isAdmin, createCategory);
router.put("/:id", protect, isAdmin, updateCategory);
router.delete("/:id", protect, isAdmin, deleteCategory);

module.exports = router;
