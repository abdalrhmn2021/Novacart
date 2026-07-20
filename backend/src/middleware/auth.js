const jwt = require("jsonwebtoken");
const User = require("../models/User");

// protect: يتأكد إن فيه توكن صالح (يعني المستخدم مسجل دخول أصلاً)
const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "غير مصرح، الرجاء تسجيل الدخول." });
    }

    // ملاحظة: تأكد إن اسم المتغير هنا (JWT_SECRET) مطابق للي مستخدمه
    // في utils/generateToken.js عندك بالظبط
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "المستخدم غير موجود." });
    }

    req.user = user; // بقى متاح لأي راوت بعد كده
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "جلسة غير صالحة، الرجاء تسجيل الدخول مجدداً." });
  }
};

// isAdmin: لازم يجي بعد protect، بيتأكد إن صلاحية المستخدم admin
const isAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "غير مسموح، هذه العملية للأدمن فقط." });
  }
  next();
};

module.exports = { protect, isAdmin };
