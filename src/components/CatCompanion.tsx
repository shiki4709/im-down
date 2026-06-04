"use client";

import { motion, AnimatePresence } from "framer-motion";

type CompanionMood = "resting" | "listening" | "thinking" | "happy";

interface CatCompanionProps {
  mood: CompanionMood;
}

const MOOD_IMAGES: Record<CompanionMood, string> = {
  resting: "/art/nori-rest.png",
  listening: "/art/nori-listen.png",
  thinking: "/art/nori-think.png",
  happy: "/art/nori-happy.png",
};

const MOOD_TEXT: Record<CompanionMood, string> = {
  resting: "...",
  listening: "*ear flick*",
  thinking: "*slow blink*",
  happy: "*purring*",
};

const MOOD_ANIMATION: Record<CompanionMood, { animate: object; transition: object }> = {
  resting: {
    animate: {
      y: [0, -3, 0],
      scale: [1, 1.02, 1],
    },
    transition: {
      duration: 5,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
  listening: {
    animate: {
      y: [0, -2, 0],
      rotate: [0, 2, 0],
      scale: [1, 1.01, 1],
    },
    transition: {
      duration: 2.5,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
  thinking: {
    animate: {
      y: [0, -1, 0],
      rotate: [0, -2, 0, 2, 0],
      scale: [1, 1.01, 1],
    },
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
  happy: {
    animate: {
      y: [0, -4, 0],
      scale: [1, 1.05, 0.98, 1.03, 1],
      rotate: [0, -2, 2, -1, 0],
    },
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export function CatCompanion({ mood }: CatCompanionProps) {
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
            alt={`Nori - ${mood}`}
            width={200}
            height={200}
            className="drop-shadow-xl"
            draggable={false}
            style={{
              filter: mood === "happy"
                ? "drop-shadow(0 8px 20px rgba(150, 150, 200, 0.3))"
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
