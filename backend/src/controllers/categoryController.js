const Category = require("../models/Category");

// Create Category
const createCategory = async (req, res) => {
  try {
    const { name, slug, description, parent, image, isActive, sortOrder } =
      req.body;

    const category = await Category.create({
      name,
      slug,
      description,
      parent,
      image,
      isActive,
      sortOrder,
    });

    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};


// Get All Categories
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find()
      .populate("parent", "name slug")
      .sort({ sortOrder: 1 });

    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// Get Category By ID
const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id)
      .populate("parent", "name slug");

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// Update Category
const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    res.status(200).json(category);

  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};


// Delete Category
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    res.status(200).json({
      message: "Category deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};