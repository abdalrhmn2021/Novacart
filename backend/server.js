require("dotenv").config({ path: "./.env" });

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { stripeWebhook } = require("./src/controllers/paymentController");
const errorHandler = require("./src/middleware/errorHandler");

const app = express();
const port = process.env.PORT || 5000;

const routerProdects = require("./src/route/productRoutes");
const routerUsers = require("./src/route/userRoutes");
const routerOrder = require("./src/route/orderRoutes");
const routerAuth = require("./src/route/authRoutes");
const routerCatgory = require("./src/route/categoryRoutes");
const paymentRoutes = require("./src/route/paymentRoutes");
const routerReview = require("./src/route/reviewRoutes");
const uploadRoutes = require("./src/route/uploadRoutes");
const connectDB = require("./src/config/db");

connectDB();

// ⚠️ webhook لازم يبقى أول شي، قبل CORS وقبل express.json()
app.post(
  "/api/payment/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook,
);

// ✅ CORS والـ middlewares العامة لازم تنضاف هون، قبل أي route تاني
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

// ✅ هلأ الـ routes بتستفيد من CORS و express.json() فوق
app.use("/api/payment", paymentRoutes);
app.use("/api/products", routerProdects);
app.use("/api/users", routerUsers);
app.use("/api/orders", routerOrder);
app.use("/api/auth", routerAuth);
app.use("/api/categories", routerCatgory);
app.use("/api/reviews", routerReview);
app.use("/api/upload", uploadRoutes);

// ✅ لازم يكون آخر middleware، بعد كل الـ routes
app.use(errorHandler);

const server = app.listen(port, "0.0.0.0", () => {
  console.log(`Server listening on port ${port}`);
});

server.on("error", (err) => {
  console.error("Server Error:", err);
});
