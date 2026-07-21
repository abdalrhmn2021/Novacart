<!-- ضع هذا الملف بجذر المشروع: README.md (نفس مستوى backend/ وfrontend/) -->
 
# Novacart
 
متجر إلكتروني كامل (full-stack) مبني بـ Express.js / MongoDB بالباك اند، وNext.js / React بالفرونت اند.
 
## المميزات
 
- تسجيل دخول وإنشاء حساب مع صلاحيات (user / admin) عبر JWT بكوكي httpOnly
- إدارة منتجات وتصنيفات (Categories) من لوحة تحكم مخصصة للأدمن
- سلة تسوق وطلبات، مع دفع إلكتروني عبر Stripe Checkout
- رفع صور المنتجات عبر Cloudinary
- تقييمات ومراجعات للمنتجات (Reviews) مع حساب متوسط تلقائي
## التقنيات المستخدمة
 
**الباك اند:** Express.js، Mongoose (MongoDB)، JWT، bcrypt، Stripe، Cloudinary
**الفرونت اند:** Next.js (App Router)، React، Tailwind CSS، axios، react-hook-form + zod
 
## هيكلية المشروع
 
```
Novacart/
├── backend/
│   ├── server.js
│   └── src/
│       ├── config/       # اتصال قاعدة البيانات وCloudinary
│       ├── controllers/  # منطق كل route
│       ├── middleware/   # auth, upload, errorHandler
│       ├── models/       # موديلات Mongoose
│       └── route/        # تعريف الـ API routes
└── frontend/
    └── src/
        ├── app/          # صفحات Next.js (App Router)
        ├── components/   # مكوّنات UI قابلة لإعادة الاستخدام
        ├── context/       # AuthContext (حالة تسجيل الدخول)
        ├── hooks/        # useCheckout, CartContext
        └── services/     # طبقة الاتصال بالـ API
```
 
## التشغيل محلياً
 
### المتطلبات
 
- Node.js 18 أو أحدث
- قاعدة بيانات MongoDB (محلية أو حساب MongoDB Atlas مجاني)
- حساب Stripe (وضع الاختبار كافي للتطوير)
- حساب Cloudinary (للـ tier المجاني)
### 1) الباك اند
 
```bash
npm install
cp .env.example .env   # ثم عبّي القيم الحقيقية بملف .env
npm run dev
```
 
السيرفر رح يشتغل افتراضياً على `http://localhost:5000`.
 
### 2) الفرونت اند
 
```bash
cd frontend
npm install
cp .env.example .env.local   # ثم عبّي القيمة الحقيقية
npm run dev
```
 
الموقع رح يشتغل افتراضياً على `http://localhost:3000`.
 
### 3) صلاحية الأدمن
 
ما في حالياً واجهة لترقية مستخدم لـ admin. بعد ما تسجل حساب عادي، روح على قاعدة البيانات (MongoDB Compass أو Atlas) لمجموعة `users`، ولاقي المستخدم، وغيّر حقل `role` من `user` إلى `admin` يدوياً. بعدها رح تظهرلك لوحة التحكم `/admin`.
 
## ملاحظات مهمة
 
- متغيرات البيئة (`.env`, `.env.local`) غير مرفوعة على GitHub لأسباب أمنية — استخدم ملفات `.env.example` كمرجع فقط.
- Stripe webhook (`/api/payment/webhook`) لازم يكون قابل للوصول من الإنترنت وقت الاختبار — استخدم [Stripe CLI](https://stripe.com/docs/stripe-cli) (`stripe listen --forward-to localhost:5000/api/payment/webhook`) للتجربة المحلية.
