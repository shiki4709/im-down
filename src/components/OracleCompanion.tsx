"use client";

import { useEffect, useState } from "react";

type CompanionMood = "resting" | "listening" | "thinking" | "happy";

interface OracleCompanionProps {
  mood: CompanionMood;
}

export function OracleCompanion({ mood }: OracleCompanionProps) {
  const [glow, setGlow] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlow((prev) => !prev);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`flex flex-col items-center transition-all duration-700 ${
        mood === "resting" ? "animate-float" : ""
      }`}
    >
      <svg
        width="140"
        height="160"
        viewBox="0 0 100 120"
        className="drop-shadow-lg overflow-visible"
      >
        {/* Crystal ball glow */}
        <circle
          cx="50"
          cy="45"
          r={glow ? 32 : 28}
          fill="none"
          stroke="#B8A9E8"
          strokeWidth="0.5"
          opacity={glow ? 0.3 : 0.1}
          className="transition-all duration-1000"
        />

        {/* Crystal ball */}
        <circle cx="50" cy="45" r="22" fill="#E8E0F8" opacity={0.8} />
        <circle cx="50" cy="45" r="22" fill="url(#orbGradient)" />

        {/* Inner glow */}
        <circle
          cx="50"
          cy="45"
          r="14"
          fill="#C8B8E8"
          opacity={mood === "thinking" ? 0.8 : glow ? 0.4 : 0.2}
          className="transition-all duration-1000"
        />

        {/* Sparkles inside */}
        <circle cx="43" cy="38" r="1.5" fill="white" opacity={glow ? 0.9 : 0.3} className="transition-opacity duration-1000" />
        <circle cx="55" cy="42" r="1" fill="white" opacity={glow ? 0.3 : 0.9} className="transition-opacity duration-1000" />
        <circle cx="48" cy="50" r="1.2" fill="white" opacity={glow ? 0.6 : 0.4} className="transition-opacity duration-1000" />

        {/* Ball shine */}
        <ellipse cx="43" cy="36" rx="6" ry="4" fill="white" opacity={0.25} />

        {/* Base */}
        <path d="M 32 65 Q 50 72 68 65 L 65 68 Q 50 75 35 68 Z" fill="#8B7355" />
        <ellipse cx="50" cy="65" rx="18" ry="4" fill="#A08060" />

        {/* Cloth drape */}
        <path
          d="M 20 75 Q 30 68 40 72 Q 50 76 60 72 Q 70 68 80 75 L 78 85 Q 60 78 50 82 Q 40 78 22 85 Z"
          fill="#6B4E9B"
          opacity={0.8}
        />
        <path
          d="M 22 85 Q 40 78 50 82 Q 60 78 78 85 L 76 92 Q 60 85 50 88 Q 40 85 24 92 Z"
          fill="#5A3D8A"
          opacity={0.8}
        />

        {/* Stars on cloth */}
        <circle cx="35" cy="80" r="1" fill="#E8D070" opacity={0.7} />
        <circle cx="65" cy="80" r="1" fill="#E8D070" opacity={0.7} />
        <circle cx="50" cy="86" r="1.2" fill="#E8D070" opacity={0.7} />

        {/* Moon symbol on cloth */}
        <path d="M 48 78 Q 52 76 52 80 Q 52 84 48 82 Q 50 80 48 78" fill="#E8D070" opacity={0.5} />

        {/* Thinking sparkles around ball */}
        {mood === "thinking" && (
          <>
            <circle cx="28" cy="35" r="2" fill="#B8A9E8" className="animate-pulse-soft" />
            <circle cx="72" cy="35" r="2" fill="#B8A9E8" className="animate-pulse-soft" style={{ animationDelay: "0.3s" }} />
            <circle cx="50" cy="20" r="2" fill="#B8A9E8" className="animate-pulse-soft" style={{ animationDelay: "0.6s" }} />
          </>
        )}

        {/* Happy: extra stars */}
        {mood === "happy" && (
          <>
            <circle cx="25" cy="30" r="1.5" fill="#E8D070" className="animate-pulse-soft" />
            <circle cx="75" cy="30" r="1.5" fill="#E8D070" className="animate-pulse-soft" style={{ animationDelay: "0.2s" }} />
            <circle cx="30" cy="55" r="1" fill="#E8D070" className="animate-pulse-soft" style={{ animationDelay: "0.4s" }} />
            <circle cx="70" cy="55" r="1" fill="#E8D070" className="animate-pulse-soft" style={{ animationDelay: "0.6s" }} />
          </>
        )}

        <defs>
          <radialGradient id="orbGradient" cx="50%" cy="40%" r="50%">
            <stop offset="0%" stopColor="#D8C8F8" stopOpacity={0.6} />
            <stop offset="100%" stopColor="#9880C8" stopOpacity={0.3} />
          </radialGradient>
        </defs>
      </svg>

      <p className="mt-1 text-sm text-warm-muted transition-opacity duration-500">
        {mood === "resting" && "the orb hums softly..."}
        {mood === "listening" && "the mist stirs..."}
        {mood === "thinking" && "the orb glows bright..."}
        {mood === "happy" && "✧ a vision appears ✧"}
      </p>
    </div>
  );
}
