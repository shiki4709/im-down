"use client";

import { useState, useCallback } from "react";

type Shop = "buddy" | "nori" | "shrine" | "fortune";

interface TownMapProps {
  onEnterShop: (shop: Shop) => void;
}

// Tap zones mapped to the image layout (percentages)
const SHOP_ZONES: { shop: Shop; x: number; y: number; w: number; h: number; label: string }[] = [
  { shop: "shrine",  x: 3,  y: 5,  w: 45, h: 45, label: "The Shrine" },
  { shop: "fortune", x: 52, y: 5,  w: 45, h: 45, label: "Fortune Teller" },
  { shop: "buddy",   x: 3,  y: 50, w: 45, h: 45, label: "Buddy's Den" },
  { shop: "nori",    x: 52, y: 50, w: 45, h: 45, label: "Nori's Place" },
];

export function TownMap({ onEnterShop }: TownMapProps) {
  const [entering, setEntering] = useState<Shop | null>(null);

  const handleShopTap = useCallback(
    (shop: Shop) => {
      if (entering) return;
      setEntering(shop);
      setTimeout(() => onEnterShop(shop), 600);
    },
    [entering, onEnterShop]
  );

  return (
    <main className="flex-1 flex flex-col items-center w-full h-full">
      <div className="text-center pt-6 pb-2 animate-fade-in">
        <h1 className="text-xl font-medium text-warm-text" style={{ fontFamily: "system-ui, sans-serif" }}>
          I&apos;m Down
        </h1>
        <p className="text-xs text-warm-muted mt-0.5" style={{ fontFamily: "system-ui, sans-serif" }}>
          tap a place to visit
        </p>
      </div>

      <div className="flex-1 w-full flex items-center justify-center px-2 pb-2 animate-fade-in">
        <div
          className="relative w-full rounded-2xl overflow-hidden shadow-lg"
          style={{ maxHeight: "calc(100dvh - 100px)" }}
        >
          <img
            src="/art/town-map.png"
            alt="Town map"
            className="w-full h-full object-cover block"
            style={{
              opacity: entering ? 0.7 : 1,
              transition: "opacity 0.4s",
            }}
            draggable={false}
          />

          {/* Tap zones */}
          {SHOP_ZONES.map(({ shop, x, y, w, h, label }) => (
            <button
              key={shop}
              onClick={() => handleShopTap(shop)}
              className="absolute"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                width: `${w}%`,
                height: `${h}%`,
                background: "transparent",
                border: "none",
                cursor: "pointer",
              }}
              aria-label={label}
            />
          ))}
        </div>
      </div>

    </main>
  );
}
