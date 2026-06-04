"use client";

import { useState, useRef, useCallback, useEffect, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SpeechBubble } from "./SpeechBubble";
import { HeartMeter } from "./HeartMeter";
import { QuestList } from "./QuestList";

type AppState = "idle" | "writing" | "loading" | "dialogue" | "quests";

interface ReframeData {
  feeling: string;
  reframe: string;
  actions: string[];
}

interface ApiResponse {
  success: boolean;
  data?: ReframeData;
  error?: string;
}

interface ShopViewProps {
  apiEndpoint: string;
  companion: (mood: "resting" | "listening" | "thinking" | "happy") => ReactNode;
  celebrateImage: string;
  idlePrompt: string;
  inputPlaceholder: string;
  sendLabel: string;
  loadingLabel: string;
  onBack: () => void;
}

export function ShopView({
  apiEndpoint,
  companion,
  celebrateImage,
  idlePrompt,
  inputPlaceholder,
  sendLabel,
  loadingLabel,
  onBack,
}: ShopViewProps) {
  const [appState, setAppState] = useState<AppState>("writing");
  const [input, setInput] = useState("");
  const [responseData, setResponseData] = useState<ReframeData | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [doneQuests, setDoneQuests] = useState<Set<number>>(new Set());
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-focus textarea on mount
  useEffect(() => {
    setTimeout(() => textareaRef.current?.focus(), 300);
  }, []);

  const allQuestsDone =
    responseData !== null &&
    responseData.actions.length > 0 &&
    doneQuests.size >= responseData.actions.length;

  const mood =
    appState === "loading"
      ? "thinking" as const
      : appState === "quests"
        ? "happy" as const
        : appState === "dialogue" || appState === "writing"
          ? "listening" as const
          : "resting" as const;

  const totalHearts = responseData?.actions.length ?? 3;
  const filledHearts = doneQuests.size;

  const handleTap = useCallback(() => {
    if (appState === "idle") {
      setAppState("writing");
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  }, [appState]);

  const handleSend = useCallback(async () => {
    if (!input.trim() || appState === "loading") return;

    setAppState("loading");
    setErrorMsg("");
    const messageToSend = input.trim();
    setInput("");

    try {
      const res = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageToSend }),
      });

      const data: ApiResponse = await res.json();

      if (data.success && data.data) {
        setResponseData(data.data);
        setDoneQuests(new Set());
        setAppState("dialogue");
      } else {
        setErrorMsg(data.error ?? "something went wrong. try again?");
        setAppState("writing");
      }
    } catch {
      setErrorMsg("couldn't connect. check your signal and try again?");
      setAppState("writing");
    }
  }, [input, appState, apiEndpoint]);

  const handleReset = useCallback(() => {
    setInput("");
    setResponseData(null);
    setErrorMsg("");
    setDoneQuests(new Set());
    setAppState("idle");
  }, []);

  const toggleQuest = useCallback((index: number) => {
    setDoneQuests((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }, []);

  const dialogueLines: string[] = [];
  if (responseData) {
    if (responseData.feeling) dialogueLines.push(responseData.feeling);
    if (responseData.reframe) dialogueLines.push(responseData.reframe);
  }

  return (
    <main className="flex-1 flex flex-col items-center px-6 py-8 max-w-lg mx-auto w-full overflow-y-auto">
      {/* Back button */}
      <button
        onClick={onBack}
        className="self-start text-sm text-warm-muted mb-2 animate-fade-in"
      >
        ← town
      </button>

      {/* Heart meter */}
      {appState === "quests" && (
        <div className="w-full flex justify-end mb-2 animate-fade-in">
          <HeartMeter total={totalHearts} filled={filledHearts} />
        </div>
      )}

      {/* Companion — swap to celebrate image when all quests done */}
      <div
        className={`flex items-center justify-center cursor-pointer transition-all duration-500 ${
          appState === "idle" ? "flex-1" : "pt-2 pb-4"
        }`}
        onClick={handleTap}
      >
        <AnimatePresence mode="wait">
          {allQuestsDone ? (
            <motion.div
              key="celebrate"
              initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
              animate={{
                opacity: 1,
                scale: [1, 1.1, 1],
                rotate: [0, -5, 5, -3, 0],
                y: [0, -12, 0],
              }}
              transition={{
                opacity: { duration: 0.3 },
                scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
                rotate: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                y: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
              }}
              className="flex flex-col items-center"
            >
              <img
                src={celebrateImage}
                alt="Celebrating!"
                width={220}
                height={220}
                className="drop-shadow-xl"
                draggable={false}
                style={{
                  filter: "drop-shadow(0 8px 24px rgba(232, 168, 124, 0.5))",
                }}
              />
              <p className="mt-3 text-sm text-accent font-medium">
                all quests done! proud of you.
              </p>
            </motion.div>
          ) : (
            <motion.div key="companion" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {companion(mood)}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Content */}
      <div className="w-full space-y-4 pb-4">
        {appState === "idle" && (
          <button
            onClick={handleTap}
            className="w-full py-4 px-6 rounded-2xl bg-accent-soft/60 text-warm-muted text-center text-base animate-fade-in"
          >
            {idlePrompt}
          </button>
        )}

        {(appState === "writing" || appState === "loading") && (
          <div className="animate-fade-in space-y-3">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={inputPlaceholder}
              rows={3}
              maxLength={1000}
              className="w-full py-4 px-5 rounded-2xl bg-white/70 text-warm-text placeholder:text-warm-muted/40 text-base leading-relaxed shadow-sm border border-accent-soft/30"
              disabled={appState === "loading"}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            {errorMsg && (
              <p className="text-sm text-red-400 px-2">{errorMsg}</p>
            )}
            <button
              onClick={handleSend}
              disabled={!input.trim() || appState === "loading"}
              className="w-full py-3.5 rounded-2xl bg-accent text-white font-medium text-base disabled:opacity-40 transition-opacity duration-200"
            >
              {appState === "loading" ? loadingLabel : sendLabel}
            </button>
          </div>
        )}

        {appState === "dialogue" && dialogueLines.length > 0 && (
          <SpeechBubble
            lines={dialogueLines}
            onComplete={() => setAppState("quests")}
          />
        )}

        {appState === "quests" && responseData && (
          <div className="space-y-4 animate-fade-in">
            <QuestList
              quests={responseData.actions}
              completed={doneQuests}
              onToggle={toggleQuest}
            />

            {/* Always show textarea so user can keep talking */}
            <div className="space-y-3 pt-2">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="want to say more?"
                rows={2}
                maxLength={1000}
                className="w-full py-3 px-4 rounded-2xl bg-white/70 text-warm-text placeholder:text-warm-muted/40 text-sm leading-relaxed shadow-sm border border-accent-soft/30"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />
              {input.trim() && (
                <button
                  onClick={handleSend}
                  className="w-full py-3 rounded-2xl bg-accent text-white font-medium text-sm transition-opacity duration-200"
                >
                  {sendLabel}
                </button>
              )}
            </div>

            <button
              onClick={handleReset}
              className="w-full py-2.5 rounded-2xl bg-accent-soft/60 text-warm-muted text-sm"
            >
              i&apos;m good now
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
