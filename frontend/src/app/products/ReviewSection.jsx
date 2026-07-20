"use client";

import { useEffect, useState } from "react";
import { reviewService } from "@/services/reviewService";
import { useAuth } from "@/context/AuthContext";
import StarRating from "@/components/ui/StarRating";

export default function ReviewSection({ productId }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [myRating, setMyRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadReviews();
  }, [productId]);

  async function loadReviews() {
    try {
      const data = await reviewService.getProductReviews(productId);
      setReviews(data);

      const mine = data.find((r) => r.user?._id === user?.id);
      if (mine) {
        setMyRating(mine.rating);
        setComment(mine.comment || "");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (myRating < 1) {
      setError("الرجاء اختيار تقييم بالنجوم");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      await reviewService.createReview(productId, myRating, comment);
      await loadReviews();
    } catch (err) {
      setError(err.response?.data?.message || "حدث خطأ، حاول مرة أخرى");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(reviewId) {
    try {
      await reviewService.deleteReview(reviewId);
      await loadReviews();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="mt-10 border-t border-white/10 pt-8">
      <h2 className="font-display text-xl text-white mb-4">التقييمات والمراجعات</h2>

      {user && (
        <form
          onSubmit={handleSubmit}
          className="mb-8 rounded-lg border border-white/10 p-4"
        >
          <p className="text-sm text-white/70 mb-2">تقييمك</p>
          <StarRating
            value={myRating}
            interactive
            size="lg"
            onChange={setMyRating}
          />
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="اكتب رأيك بالمنتج (اختياري)"
            className="mt-3 w-full rounded-md bg-transparent border border-white/10 p-2 text-sm text-white"
            rows={3}
          />
          {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="mt-3 rounded-md bg-[#c69749] px-4 py-2 text-sm text-black disabled:opacity-50"
          >
            {submitting ? "جاري الإرسال..." : "إرسال التقييم"}
          </button>
        </form>
      )}

      {loading ? (
        <p className="text-white/60 text-sm">جاري تحميل التقييمات...</p>
      ) : reviews.length === 0 ? (
        <p className="text-white/60 text-sm">لا توجد تقييمات بعد.</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r._id} className="border-b border-white/5 pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white text-sm">
                    {r.user?.firstName} {r.user?.lastName}
                  </p>
                  <StarRating value={r.rating} size="sm" />
                </div>
                {(r.user?._id === user?.id || user?.role === "admin") && (
                  <button
                    onClick={() => handleDelete(r._id)}
                    className="text-red-400 text-xs"
                  >
                    حذف
                  </button>
                )}
              </div>
              {r.comment && (
                <p className="text-white/70 text-sm mt-1">{r.comment}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}