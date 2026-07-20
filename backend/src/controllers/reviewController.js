const Review = require("../models/Review");
const Product = require("../models/Product");

async function recalcProductRating(productId) {
  const stats = await Review.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: "$product",
        avgRating: { $avg: "$rating" },
        count: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      averageRating: Math.round(stats[0].avgRating * 10) / 10,
      numReviews: stats[0].count,
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      averageRating: 0,
      numReviews: 0,
    });
  }
}

// GET /api/reviews/product/:productId
const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate("user", "firstName lastName")
      .sort({ createdAt: -1 });

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/reviews/product/:productId
const createReview = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { rating, comment } = req.body;
    const { productId } = req.params;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "التقييم لازم يكون بين 1 و 5" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "المنتج غير موجود" });
    }

    // لو المستخدم قيّم قبل، عدّل تقييمه بدل ما يعمل واحد جديد
    const existing = await Review.findOne({
      product: productId,
      user: req.user.id,
    });

    let review;
    if (existing) {
      existing.rating = rating;
      existing.comment = comment || "";
      await existing.save();
      review = existing;
    } else {
      review = await Review.create({
        product: productId,
        user: req.user.id,
        rating,
        comment: comment || "",
      });
    }

    await recalcProductRating(productId);
    await review.populate("user", "firstName lastName");

    res.status(existing ? 200 : 201).json(review);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "لقد قيّمت هذا المنتج مسبقاً" });
    }
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/reviews/:id
const deleteReview = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: "التقييم غير موجود" });
    }

    const isOwner = review.user.toString() === req.user.id;
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const productId = review.product;
    await review.deleteOne();
    await recalcProductRating(productId);

    res.status(200).json({ message: "تم حذف التقييم" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProductReviews, createReview, deleteReview };