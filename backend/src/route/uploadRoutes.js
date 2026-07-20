const express = require("express");
const router = express.Router();
const { protect, isAdmin } = require("../middleware/auth");
const upload = require("../middleware/upload");

router.post("/", protect, isAdmin, upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "لم يتم رفع أي صورة" });
  }
  res.status(200).json({ url: req.file.path });
});

module.exports = router;