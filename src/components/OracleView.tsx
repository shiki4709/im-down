"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { SpeechBubble } from "./SpeechBubble";

type ViewState =
  | "birth-input"
  | "loading-chart"
  | "chart-reading"
  | "ask"
  | "loading-answer"
  | "answer";

interface ChartData {
  chart: string;
  year: string;
  advice: string;
}

interface AnswerData {
  answer: string;
  action: string;
}

interface SavedData {
  birthDate: string;
  birthTime: string;
  birthLocation: string;
  chartSummary: string;
  year: number;
}

interface OracleViewProps {
  onBack: () => void;
}

const STORAGE_KEY = "imdown-ahma";

export function OracleView({ onBack }: OracleViewProps) {
  const [state, setState] = useState<ViewState>("birth-input");
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [birthLocation, setBirthLocation] = useState("");
  const [chartSummary, setChartSummary] = useState("");
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [answerData, setAnswerData] = useState<AnswerData | null>(null);
  const [question, setQuestion] = useState("");
  const [hasChart, setHasChart] = useState(false);
  const [dialogueDone, setDialogueDone] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load saved chart on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;

      const saved: SavedData = JSON.parse(raw);
      const currentYear = new Date().getFullYear();

      if (saved.year === currentYear && saved.chartSummary) {
        setBirthDate(saved.birthDate);
        setBirthTime(saved.birthTime);
        setBirthLocation(saved.birthLocation || "");
        setChartSummary(saved.chartSummary);
        setHasChart(true);
        setState("ask");
      }
    } catch {
      // ignore
    }
  }, []);

  const handleReadChart = useCallback(async () => {
    if (state === "loading-chart" || !birthDate) return;
    setState("loading-chart");

    try {
      const res = await fetch("/api/oracle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ birthDate, birthTime: birthTime || undefined, birthLocation: birthLocation || undefined }),
      });

      const json = await res.json();

      if (json.success && json.type === "first") {
        const data: ChartData = json.data;
        setChartData(data);
        setDialogueDone(false);

        // Save chart summary to localStorage
        const summary = `${data.chart} ${data.year}`;
        setChartSummary(summary);

        const toSave: SavedData = {
          birthDate,
          birthTime,
          birthLocation,
          chartSummary: summary,
          year: new Date().getFullYear(),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
        setHasChart(true);

        setState("chart-reading");
      } else {
        setState("birth-input");
      }
    } catch {
      setState("birth-input");
    }
  }, [state, birthDate, birthTime]);

  const handleAskQuestion = useCallback(async () => {
    if (state === "loading-answer" || !question.trim()) return;
    setState("loading-answer");

    try {
      const res = await fetch("/api/oracle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          birthDate,
          birthTime: birthTime || undefined,
          birthLocation: birthLocation || undefined,
          chartSummary,
          question: question.trim(),
        }),
      });

      const json = await res.json();

      if (json.success && json.type === "question") {
        setAnswerData(json.data);
        setDialogueDone(false);
        setState("answer");
      } else {
        setState("ask");
      }
    } catch {
      setState("ask");
    }
  }, [state, question, birthDate, birthTime, chartSummary]);

  const handleNewChart = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setHasChart(false);
    setChartData(null);
    setAnswerData(null);
    setChartSummary("");
    setQuestion("");
    setBirthDate("");
    setBirthTime("");
    setBirthLocation("");
    setState("birth-input");
  }, []);

  // Ah-Ma companion — using AI-generated image
  const AhMa = ({ speaking }: { speaking: boolean }) => (
    <div
      className="flex flex-col items-center"
      style={{
        transform: speaking ? "scale(1.03)" : "scale(1)",
        transition: "transform 0.5s ease-in-out",
      }}
    >
      <img
        src="/art/ahma.png"
        alt="Ah-Ma"
        width={200}
        height={200}
        className="drop-shadow-xl"
        draggable={false}
        style={{
          filter: speaking
            ? "drop-shadow(0 8px 20px rgba(139, 107, 139, 0.4))"
            : "drop-shadow(0 4px 12px rgba(0,0,0,0.1))",
        }}
      />
    </div>
  );

  const isLoading = state === "loading-chart" || state === "loading-answer";

  return (
    <main className="flex-1 flex flex-col items-center px-6 py-8 max-w-lg mx-auto w-full overflow-y-auto">
      <button
        onClick={onBack}
        className="self-start text-sm text-warm-muted mb-2 animate-fade-in"
      >
        ← town
      </button>

      <p className="text-xs uppercase tracking-widest text-[#8B6B8B] mb-3 animate-fade-in">
        Fortune Teller
      </p>

      {/* Ah-Ma */}
      <div className={`flex items-center justify-center transition-all duration-500 ${
        state === "birth-input" ? "flex-1" : "pt-2 pb-3"
      }`}>
        <AhMa speaking={isLoading} />
      </div>

      {/* Content */}
      <div className="w-full space-y-4 pb-4">
        {/* First time: birth input */}
        {state === "birth-input" && (
          <div className="animate-fade-in space-y-4">
            <div className="py-4 px-5 rounded-2xl bg-white/60 space-y-3">
              <p className="text-sm text-warm-muted text-center mb-3">
                *adjusts glasses* sit, sit. tell Ah-Ma when you were born.
              </p>
              <div className="space-y-2">
                <label className="block">
                  <span className="text-xs text-warm-muted">date of birth</span>
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full mt-1 py-3 px-4 rounded-xl bg-accent-soft/30 text-warm-text text-base border border-accent-soft/30"
                  />
                </label>
                <label className="block">
                  <span className="text-xs text-warm-muted">birth time <span className="opacity-50">(optional)</span></span>
                  <input
                    type="time"
                    value={birthTime}
                    onChange={(e) => setBirthTime(e.target.value)}
                    className="w-full mt-1 py-3 px-4 rounded-xl bg-accent-soft/30 text-warm-text text-base border border-accent-soft/30"
                  />
                </label>
                <label className="block">
                  <span className="text-xs text-warm-muted">birth location <span className="opacity-50">(city, country)</span></span>
                  <input
                    type="text"
                    value={birthLocation}
                    onChange={(e) => setBirthLocation(e.target.value)}
                    placeholder="e.g. Taipei, Taiwan"
                    className="w-full mt-1 py-3 px-4 rounded-xl bg-accent-soft/30 text-warm-text placeholder:text-warm-muted/40 text-base border border-accent-soft/30"
                  />
                </label>
              </div>
            </div>
            <button
              onClick={handleReadChart}
              disabled={!birthDate}
              className="w-full py-3.5 rounded-2xl bg-[#8B6B8B] text-white font-medium text-base disabled:opacity-40 transition-opacity duration-200"
            >
              read my chart
            </button>
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <p className="text-center text-sm text-warm-muted animate-pulse-soft">
            *looks at chart closely* hmm, hmm...
          </p>
        )}

        {/* Chart reading - first time dialogue */}
        {state === "chart-reading" && chartData && !dialogueDone && (
          <SpeechBubble
            lines={[chartData.chart, chartData.year, chartData.advice]}
            onComplete={() => setDialogueDone(true)}
          />
        )}

        {state === "chart-reading" && chartData && dialogueDone && (
          <div className="animate-fade-in space-y-4">
            <div className="py-4 px-5 rounded-2xl bg-[#F0E8F8]/60">
              <p className="text-sm text-warm-text leading-relaxed italic">
                {chartData.advice}
              </p>
            </div>
            <button
              onClick={() => {
                setState("ask");
                setTimeout(() => textareaRef.current?.focus(), 100);
              }}
              className="w-full py-3.5 rounded-2xl bg-[#8B6B8B] text-white font-medium text-base"
            >
              ask Ah-Ma a question
            </button>
            <button
              onClick={onBack}
              className="w-full py-2 text-sm text-warm-muted text-center"
            >
              leave for now
            </button>
          </div>
        )}

        {/* Ask a question */}
        {state === "ask" && (
          <div className="animate-fade-in space-y-3">
            <p className="text-sm text-warm-muted text-center">
              *sips tea* what do you want to know?
            </p>
            <textarea
              ref={textareaRef}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="when will I get a job offer? what kind of company suits me? should I take this opportunity?"
              rows={3}
              maxLength={500}
              className="w-full py-4 px-5 rounded-2xl bg-white/70 text-warm-text placeholder:text-warm-muted/40 text-base leading-relaxed shadow-sm border border-[#8B6B8B]/20"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleAskQuestion();
                }
              }}
            />
            <button
              onClick={handleAskQuestion}
              disabled={!question.trim()}
              className="w-full py-3.5 rounded-2xl bg-[#8B6B8B] text-white font-medium text-base disabled:opacity-40 transition-opacity duration-200"
            >
              ask Ah-Ma
            </button>
            <button
              onClick={handleNewChart}
              className="w-full py-2 text-xs text-warm-muted/50 text-center"
            >
              start fresh (new birth chart)
            </button>
          </div>
        )}

        {/* Answer */}
        {state === "answer" && answerData && !dialogueDone && (
          <SpeechBubble
            lines={[answerData.answer]}
            onComplete={() => setDialogueDone(true)}
          />
        )}

        {state === "answer" && answerData && dialogueDone && (
          <div className="animate-fade-in space-y-4">
            {/* Action */}
            {answerData.action && (
              <div className="py-4 px-5 rounded-2xl bg-[#F0E8F8]/60">
                <p className="text-xs font-bold text-[#8B6B8B] uppercase tracking-wider mb-2">
                  Ah-Ma says do this
                </p>
                <p className="text-sm text-warm-text leading-relaxed">
                  {answerData.action}
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={onBack}
                className="flex-1 py-3 rounded-2xl bg-accent-soft/60 text-warm-muted text-sm"
              >
                leave shop
              </button>
              <button
                onClick={() => {
                  setAnswerData(null);
                  setQuestion("");
                  setDialogueDone(false);
                  setState("ask");
                  setTimeout(() => textareaRef.current?.focus(), 100);
                }}
                className="flex-1 py-3 rounded-2xl bg-[#8B6B8B]/80 text-white text-sm"
              >
                ask another question
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
