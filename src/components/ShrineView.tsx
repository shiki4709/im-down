"use client";

import { useState, useCallback } from "react";

type ShrineState = "idle" | "drawing" | "reveal" | "reading" | "tie";

interface OmikujiData {
  tier: string;
  english: string;
  wish: string;
  love: string;
  health: string;
  work: string;
  money: string;
  travel: string;
  advice: string;
}

interface ApiResponse {
  success: boolean;
  data?: OmikujiData;
}

const CATEGORIES = [
  { key: "wish", label: "Wish" },
  { key: "love", label: "Love" },
  { key: "health", label: "Health" },
  { key: "work", label: "Work" },
  { key: "money", label: "Money" },
  { key: "travel", label: "Travel" },
] as const;

interface ShrineViewProps {
  onBack: () => void;
}

export function ShrineView({ onBack }: ShrineViewProps) {
  const [state, setState] = useState<ShrineState>("idle");
  const [data, setData] = useState<OmikujiData | null>(null);
  const [tied, setTied] = useState(false);

  const isBadLuck = data?.english === "Misfortune" || data?.english === "Ending Blessing";

  const handleDraw = useCallback(async () => {
    if (state === "drawing") return;
    setState("drawing");

    try {
      const res = await fetch("/api/omikuji", { method: "POST" });
      const json: ApiResponse = await res.json();

      if (json.success && json.data) {
        setData(json.data);
        setTied(false);
        setTimeout(() => setState("reveal"), 1200);
      } else {
        setState("idle");
      }
    } catch {
      setState("idle");
    }
  }, [state]);

  const handleReset = useCallback(() => {
    setData(null);
    setTied(false);
    setState("idle");
  }, []);

  const tierColor =
    data?.english === "Great Blessing"
      ? "#C0382B"
      : data?.english === "Misfortune"
        ? "#6B6B8B"
        : "#8B5A3C";

  return (
    <main className="flex-1 flex flex-col items-center px-6 py-8 max-w-lg mx-auto w-full overflow-y-auto">
      <button
        onClick={onBack}
        className="self-start text-sm text-warm-muted mb-2 animate-fade-in"
      >
        ← town
      </button>

      <p className="text-xs uppercase tracking-widest text-[#8B3030] mb-4 animate-fade-in">
        The Shrine
      </p>

      {/* Shrine image */}
      <div className={`flex items-center justify-center transition-all duration-500 ${
        state === "idle" ? "flex-1" : "pt-2 pb-3"
      }`}>
        {state === "drawing" ? (
          <div className="flex flex-col items-center animate-fade-in">
            <img
              src="/art/shrine.png"
              alt="Shrine"
              width={180}
              height={180}
              className="drop-shadow-xl"
              draggable={false}
              style={{
                animation: "wiggle 0.3s ease-in-out infinite",
              }}
            />
            <p className="mt-3 text-sm text-warm-muted animate-pulse-soft">
              reaching inside...
            </p>
          </div>
        ) : (
          <img
            src="/art/shrine.png"
            alt="Shrine"
            width={200}
            height={200}
            className="drop-shadow-xl"
            draggable={false}
          />
        )}
      </div>

      {/* Content */}
      <div className="w-full space-y-4 pb-4">
        {state === "idle" && (
          <button
            onClick={handleDraw}
            className="w-full py-4 px-6 rounded-2xl bg-[#C0382B]/10 text-[#8B3030] text-center text-base animate-fade-in"
          >
            draw your fortune
          </button>
        )}

        {state === "drawing" && (
          <p className="text-center text-sm text-warm-muted animate-pulse-soft">
            reaching inside...
          </p>
        )}

        {/* Reveal - the paper unfolds */}
        {state === "reveal" && data && (
          <div className="animate-fade-in space-y-4">
            {/* Fortune paper */}
            <div className="py-6 px-5 rounded-2xl bg-[#FFF8F0] border border-[#E8D8B8] shadow-sm">
              {/* Tier */}
              <div className="text-center mb-4">
                <p
                  className="text-4xl font-bold mb-1"
                  style={{ color: tierColor }}
                >
                  {data.english}
                </p>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex-1 h-px bg-[#E8D8B8]" />
                <span className="text-xs text-[#D0C0A0]">✦</span>
                <div className="flex-1 h-px bg-[#E8D8B8]" />
              </div>

              {/* Categories */}
              <div className="space-y-2.5">
                {CATEGORIES.map(({ key, label }) => (
                  <div key={key} className="flex gap-3 items-start">
                    <div className="flex-shrink-0 w-12 text-right">
                      <span className="text-xs font-bold" style={{ color: tierColor }}>
                        {label}
                      </span>
                    </div>
                    <p className="text-sm text-warm-text leading-relaxed">
                      {data[key as keyof OmikujiData]}
                    </p>
                  </div>
                ))}
              </div>

              {/* Advice - highlighted */}
              <div className="mt-4 pt-3 border-t border-[#E8D8B8]">
                <p className="text-xs font-bold text-[#8B3030] mb-1">Today&apos;s Advice</p>
                <p className="text-sm text-warm-text italic leading-relaxed">
                  {data.advice}
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              {isBadLuck && !tied ? (
                <>
                  <button
                    onClick={onBack}
                    className="flex-1 py-3 rounded-2xl bg-accent-soft/60 text-warm-muted text-sm"
                  >
                    leave
                  </button>
                  <button
                    onClick={() => setTied(true)}
                    className="flex-1 py-3 rounded-2xl bg-[#C0382B]/80 text-white text-sm"
                  >
                    🌳 tie it to the tree
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={onBack}
                    className="flex-1 py-3 rounded-2xl bg-accent-soft/60 text-warm-muted text-sm"
                  >
                    leave shrine
                  </button>
                  <button
                    onClick={handleReset}
                    className="flex-1 py-3 rounded-2xl bg-[#C0382B]/80 text-white text-sm"
                  >
                    draw again
                  </button>
                </>
              )}
            </div>

            {/* Tied to tree message */}
            {tied && (
              <div className="text-center py-3 animate-fade-in">
                <p className="text-sm text-warm-muted">
                  🌳 fortune tied to the sacred tree.
                </p>
                <p className="text-xs text-warm-muted/70 mt-1">
                  the bad luck stays here. you walk away lighter.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
