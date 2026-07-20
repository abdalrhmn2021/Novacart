const express = require("express");
const router = express.Router();

const {
  createCheckoutSession
} = require("../controllers/paymentController");

const { protect } = require("../middleware/auth");


// إنشاء جلسة دفع Stripe Checkout
router.post(
  "/create-checkout-session",
  protect,
  createCheckoutSession
);


module.exports = router;