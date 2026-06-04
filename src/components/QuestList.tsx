"use client";

interface QuestListProps {
  quests: string[];
  completed: Set<number>;
  onToggle: (index: number) => void;
}

export function QuestList({ quests, completed, onToggle }: QuestListProps) {
  if (quests.length === 0) return null;

  const allDone = completed.size === quests.length;

  return (
    <div className="animate-slide-up space-y-2">
      <div className="flex items-center gap-2 px-1">
        <span className="text-xs font-bold tracking-wider text-accent uppercase">
          Quests
        </span>
        <div className="flex-1 h-px bg-accent/20" />
      </div>

      {quests.map((quest, i) => {
        const done = completed.has(i);
        return (
          <button
            key={i}
            onClick={() => onToggle(i)}
            className={`w-full text-left flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-300 ${
              done
                ? "bg-quest-done/60 animate-quest-complete"
                : "bg-quest-bg/80 active:scale-[0.98]"
            }`}
            style={{ animationDelay: `${i * 100}ms` }}
          >
            {/* Checkbox */}
            <span
              className={`w-6 h-6 rounded-lg border-2 flex-shrink-0 flex items-center justify-center transition-all duration-300 ${
                done
                  ? "bg-accent border-accent"
                  : "border-accent/30"
              }`}
            >
              {done && (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M3 7L6 10L11 4"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </span>

            {/* Quest text */}
            <span
              className={`text-sm leading-snug transition-all duration-300 ${
                done ? "line-through text-warm-muted/60" : "text-warm-text"
              }`}
            >
              {quest}
            </span>

            {/* XP badge */}
            {done && (
              <span className="ml-auto text-xs font-bold text-accent animate-fade-in flex-shrink-0">
                +1 ♥
              </span>
            )}
          </button>
        );
      })}

      {allDone && (
        <p className="text-center text-sm text-accent py-2 animate-fade-in">
          all quests done. you showed up today.
        </p>
      )}
    </div>
  );
}
