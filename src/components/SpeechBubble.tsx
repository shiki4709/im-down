"use client";

import { useState, useEffect } from "react";

interface SpeechBubbleProps {
  lines: string[];
  onComplete?: () => void;
}

export function SpeechBubble({ lines, onComplete }: SpeechBubbleProps) {
  const [currentLine, setCurrentLine] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  const line = lines[currentLine] ?? "";
  const isLastLine = currentLine >= lines.length - 1;

  // Typewriter effect
  useEffect(() => {
    setDisplayedText("");
    setIsTyping(true);
    let i = 0;
    const interval = setInterval(() => {
      if (i < line.length) {
        setDisplayedText(line.slice(0, i + 1));
        i++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 25);
    return () => clearInterval(interval);
  }, [line, currentLine]);

  const handleTap = () => {
    if (isTyping) {
      // Skip to end of current line
      setDisplayedText(line);
      setIsTyping(false);
      return;
    }

    if (!isLastLine) {
      setCurrentLine((prev) => prev + 1);
    } else {
      onComplete?.();
    }
  };

  return (
    <button
      onClick={handleTap}
      className="w-full text-left animate-fade-in"
    >
      <div className="relative bg-bubble-bg rounded-2xl rounded-bl-md px-5 py-4 shadow-sm border border-accent-soft/40">
        <p className="text-base leading-relaxed text-warm-text min-h-[3rem]">
          {displayedText.split(/(\*[^*]+\*)/).map((part, i) =>
            part.startsWith("*") && part.endsWith("*") ? (
              <em key={i} className="text-warm-muted not-italic text-sm">
                {part.slice(1, -1)}
              </em>
            ) : (
              <span key={i}>{part}</span>
            )
          )}
          {isTyping && (
            <span className="inline-block w-0.5 h-4 bg-warm-text/40 ml-0.5 animate-pulse-soft align-text-bottom" />
          )}
        </p>
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-warm-muted/50">
            {currentLine + 1}/{lines.length}
          </span>
          {!isTyping && (
            <span className="text-xs text-accent animate-pulse-soft">
              {isLastLine ? "tap to continue" : "tap for more ▸"}
            </span>
          )}
        </div>
      </div>
      {/* Speech bubble tail */}
      <div className="ml-6 w-3 h-3 bg-bubble-bg border-l border-b border-accent-soft/40 -rotate-45 -mt-1.5" />
    </button>
  );
}
