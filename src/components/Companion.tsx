"use client";

import { motion, AnimatePresence } from "framer-motion";

type CompanionMood = "resting" | "listening" | "thinking" | "happy";

interface CompanionProps {
  mood: CompanionMood;
}

const MOOD_IMAGES: Record<CompanionMood, string> = {
  resting: "/art/buddy-rest.png",
  listening: "/art/buddy-listen.png",
  thinking: "/art/buddy-think.png",
  happy: "/art/buddy-happy.png",
};

const MOOD_TEXT: Record<CompanionMood, string> = {
  resting: "hey, i'm here",
  listening: "*ears perk up*",
  thinking: "*tilts head*",
  happy: "*tail wagging*",
};

// Each mood has its own idle animation
const MOOD_ANIMATION: Record<CompanionMood, { animate: object; transition: object }> = {
  resting: {
    animate: {
      y: [0, -6, 0],
      scale: [1, 1.03, 1],
      rotate: [0, 1, 0, -1, 0],
    },
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
  listening: {
    animate: {
      y: [0, -3, 0],
      scale: [1, 1.02, 1],
      rotate: [0, 3, 0],
    },
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
  thinking: {
    animate: {
      y: [0, -2, 0],
      rotate: [0, -5, 0, 5, 0],
      scale: [1, 1.01, 1],
    },
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
  happy: {
    animate: {
      y: [0, -8, 0],
      scale: [1, 1.08, 0.95, 1.05, 1],
      rotate: [0, -5, 5, -3, 0],
    },
    transition: {
      duration: 1.2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export function Companion({ mood }: CompanionProps) {
  const anim = MOOD_ANIMATION[mood];

  return (
    <div className="flex flex-col items-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={mood}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{
            opacity: 1,
            scale: 1,
            ...anim.animate,
          }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{
            opacity: { duration: 0.3 },
            scale: { duration: 0.3 },
            ...anim.transition,
          }}
        >
          <motion.img
            src={MOOD_IMAGES[mood]}
            alt={`Buddy - ${mood}`}
            width={220}
            height={220}
            className="drop-shadow-xl"
            draggable={false}
            // Shadow pulse on happy
            style={{
              filter: mood === "happy"
                ? "drop-shadow(0 8px 20px rgba(232, 168, 124, 0.4))"
                : "drop-shadow(0 4px 12px rgba(0,0,0,0.1))",
            }}
          />
        </motion.div>
      </AnimatePresence>

      <motion.p
        key={`text-${mood}`}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-3 text-sm text-warm-muted"
      >
        {MOOD_TEXT[mood]}
      </motion.p>
    </div>
  );
}
