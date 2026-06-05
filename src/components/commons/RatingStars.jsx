
import { useState } from "react";


const SIZE_CLASSES = {
  sm: "text-[14px]",
  md: "text-[20px]",
  lg: "text-[28px]",
};

export function RatingStars({
  value = 0,
  max = 5,
  onChange,
  size = "md",
  className = "",
}) {
  const [hover, setHover] = useState(null);
  const display = hover !== null ? hover : value;
  const interactive = !!onChange;

  return (
    <div className={`inline-flex gap-[3px] ${className}`}>
      {Array.from({ length: max }).map((_, i) => (
        <span
          key={i}
          onClick={() => interactive && onChange(i + 1)}
          onMouseEnter={() => interactive && setHover(i + 1)}
          onMouseLeave={() => interactive && setHover(null)}
          className={`
            ${SIZE_CLASSES[size]} transition-colors duration-100 leading-none
            ${interactive ? "cursor-pointer" : "cursor-default"}
            ${i < display ? "text-accent" : "text-sl-200"}
          `}
        >
          ★
        </span>
      ))}
    </div>
  );
}
