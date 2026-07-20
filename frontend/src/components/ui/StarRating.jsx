"use client";

import { useState } from "react";

export default function StarRating({
  value = 0,
  size = "md",
  interactive = false,
  onChange,
}) {
  const [hovered, setHovered] = useState(0);

  const sizes = {
    sm: "h-3.5 w-3.5",
    md: "h-5 w-5",
    lg: "h-7 w-7",
  };

  const displayValue = interactive && hovered > 0 ? hovered : value;

  return (
    <div className="flex items-center gap-0.5" dir="ltr">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= Math.round(displayValue);

        return (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onChange?.(star)}
            onMouseEnter={() => interactive && setHovered(star)}
            onMouseLeave={() => interactive && setHovered(0)}
            className={interactive ? "cursor-pointer" : "cursor-default"}
          >
            <svg
              viewBox="0 0 20 20"
              fill={filled ? "#c69749" : "none"}
              stroke="#c69749"
              strokeWidth="1.2"
              className={`${sizes[size]} transition-colors`}
            >
              <path d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1.99 5.79L10 14.9l-5.2 2.61.99-5.79-4.21-4.1 5.82-.85L10 1.5z" />
            </svg>
          </button>
        );
      })}
    </div>
  );
}