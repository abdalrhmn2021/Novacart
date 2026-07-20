const express = require("express");
const router = express.Router();

const {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");


// Create Category
router.post("/", createCategory);


// Get All Categories
router.get("/", getCategories);


// Get Category By ID
router.get("/:id", getCategoryById);


// Update Category
router.put("/:id", updateCategory);


// Delete Category
router.delete("/:id", deleteCategory);


module.exports = router;