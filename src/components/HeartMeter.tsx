"use client";

interface HeartMeterProps {
  total: number;
  filled: number;
}

export function HeartMeter({ total, filled }: HeartMeterProps) {
  return (
    <div className="flex gap-1.5 items-center">
      {Array.from({ length: total }).map((_, i) => (
        <svg
          key={i}
          width="20"
          height="20"
          viewBox="0 0 20 20"
          className={`transition-all duration-300 ${
            i < filled ? "animate-heart-pop" : ""
          }`}
          style={i < filled ? { animationDelay: `${i * 150}ms` } : undefined}
        >
          <path
            d="M10 17.5C10 17.5 2 12.5 2 7C2 4.5 4 2.5 6.5 2.5C8 2.5 9.5 3.5 10 4.5C10.5 3.5 12 2.5 13.5 2.5C16 2.5 18 4.5 18 7C18 12.5 10 17.5 10 17.5Z"
            fill={i < filled ? "var(--heart-fill)" : "var(--heart-empty)"}
            className="transition-colors duration-500"
          />
        </svg>
      ))}
    </div>
  );
}
