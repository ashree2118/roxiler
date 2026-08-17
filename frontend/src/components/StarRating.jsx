import { useState } from "react";
import { Star } from "lucide-react";

export default function StarRating({
  value = 0,
  onChange,
  disabled = false,
  size = "md",
}) {
  const [hoverValue, setHoverValue] = useState(null);
  const activeValue = hoverValue ?? value ?? 0;
  const sizeClass = size === "sm" ? "h-4 w-4" : "h-5 w-5";

  return (
    <div
      className="flex items-center gap-1"
      onMouseLeave={() => setHoverValue(null)}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= activeValue;

        return (
          <button
            key={star}
            type="button"
            disabled={disabled}
            onMouseEnter={() => !disabled && setHoverValue(star)}
            onClick={() => onChange?.(star)}
            className="rounded transition disabled:cursor-not-allowed disabled:opacity-60"
            aria-label={`Rate ${star} out of 5`}
          >
            <Star
              className={`${sizeClass} ${
                filled
                  ? "fill-amber-400 text-amber-400"
                  : "fill-transparent text-slate-300"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}

export function RatingDisplay({ value, size = "md" }) {
  const sizeClass = size === "sm" ? "h-4 w-4" : "h-5 w-5";

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${sizeClass} ${
            star <= Math.round(value || 0)
              ? "fill-amber-400 text-amber-400"
              : "fill-transparent text-slate-300"
          }`}
        />
      ))}
      <span className="ml-2 text-sm font-medium text-slate-700">
        {value != null ? value.toFixed(1) : "N/A"}
      </span>
    </div>
  );
}
