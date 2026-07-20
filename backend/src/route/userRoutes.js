const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  updateProfile,
} = require("../controllers/userController");
const { protect, isAdmin } = require("../middleware/auth");
// راوت المستخدم العادي لتعديل بياناته هو
router.put("/profile", protect, updateProfile);

router.get("/", protect, isAdmin, getAllUsers);
router.get("/:id", protect, isAdmin, getUser);
router.put("/:id", protect, isAdmin, updateUser);
router.delete("/:id", protect, isAdmin, deleteUser);

module.exports = router;
