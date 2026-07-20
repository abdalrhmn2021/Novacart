const express = require("express");
const router = express.Router();
const {protect,isAdmin} = require("../middleware/auth");

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getTopProducts
} = require("../controllers/productController");

router.get("/", getProducts);
router.get("/top", getTopProducts);
router.get("/:id", getProductById);
router.post("/", protect,isAdmin, createProduct);
router.put("/:id", protect,isAdmin, updateProduct);
router.delete("/:id",protect, isAdmin, deleteProduct);

module.exports = router;
