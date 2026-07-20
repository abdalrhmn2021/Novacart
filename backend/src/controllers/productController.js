const Product = require("../models/Product");

function generateSlug(name) {
  const base = name
    .toLowerCase()
    .trim()
    .replace(/[^\u0600-\u06FFa-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
  return `${base}-${Date.now().toString(36)}`;
} 



const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      oldPrice,
      category,
      brand,
      sku,
      image,
      inStock,
      isNew,
      tags,
      isActive,
    } = req.body;

    const product = new Product({
      name,
      slug: generateSlug(name),
      description,
      price,
      oldPrice,
      category,
      brand,
      sku,
      image,
      inStock,
      isNew,
      tags,
      isActive,
    });

    const saved = await product.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
// Get all products (with search, category filter, sort, pagination)
const getProducts = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;

    const filters = {};

    if (req.query.category) {
      filters.category = req.query.category;
    }

    if (req.query.search) {
      filters.name = { $regex: req.query.search, $options: "i" };
    }

    let sortOption = { createdAt: -1 }; // newest كافتراضي
    switch (req.query.sort) {
      case "oldest":
        sortOption = { createdAt: 1 };
        break;
      case "price_asc":
        sortOption = { price: 1 };
        break;
      case "price_desc":
        sortOption = { price: -1 };
        break;
      case "newest":
      default:
        sortOption = { createdAt: -1 };
    }

    const total = await Product.countDocuments(filters);

    const products = await Product.find(filters)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      products,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single product by id
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a product by id
const updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ message: "Product not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a product by id
const deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get top products (currently: highest priced 4 products)
const getTopProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .sort({ price: -1 }) // عدّلها لـ { rating: -1 } أو حقل مبيعات لو "الأعلى" يعني الأكثر مبيعًا/تقييمًا
      .limit(4);

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getTopProducts,
};