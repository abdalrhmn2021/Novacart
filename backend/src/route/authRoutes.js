const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

console.log("AUTH CONTROLLER =>", authController);

const { protect } = require("../middleware/auth");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.post("/refresh-token", authController.refreshToken);
router.get("/verify", protect, authController.verify);

module.exports = router;