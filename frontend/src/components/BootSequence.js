import { useEffect, useRef, useState } from "react";

const LINES = [
  { text: "$ booting chandan.os v4.0 …",         delay: 0,   color: "#8B949E" },
  { text: "› loading kernel modules ok",         delay: 320, color: "#8B949E" },
  { text: "› mounting /skills ok",                delay: 520, color: "#8B949E" },
  { text: "› mounting /projects ok",              delay: 680, color: "#8B949E" },
  { text: "› establishing secure transmission …", delay: 880, color: "#00F0FF" },
  { text: "› auth_token: granted",                delay: 1200, color: "#CCFF00" },
  { text: "$ ./run portfolio --mode=cyberpunk",   delay: 1480, color: "#CCFF00" },
];

const TOTAL_MS = 2400;

export default function BootSequence({ onDone }) {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [hide, setHide] = useState(false);
  const startRef = useRef(performance.now());

  useEffect(() => {
    LINES.forEach((l, i) => {
      setTimeout(() => setStep(i + 1), l.delay);
    });
    let raf;
    const tick = () => {
      const p = Math.min((performance.now() - startRef.current) / TOTAL_MS, 1);
      setProgress(p);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const t = setTimeout(() => {
      setHide(true);
      setTimeout(() => onDone && onDone(), 600);
    }, TOTAL_MS);
    return () => { cancelAnimationFrame(raf); clearTimeout(t); };
  }, [onDone]);

  return (
    <div
      className={`fixed inset-0 z-[200] bg-void-900 grid-bg flex items-center justify-center transition-opacity duration-500 ${
        hide ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      data-testid="boot-sequence"
    >
      <div className="grain-overlay" aria-hidden />
      <div className="absolute inset-0 scanlines pointer-events-none" />

      <div className="relative w-full max-w-2xl px-8">
        {/* corner brackets */}
        <span className="absolute -top-6 -left-6 w-6 h-6 border-t-2 border-l-2 border-neon-lime" />
        <span className="absolute -top-6 -right-6 w-6 h-6 border-t-2 border-r-2 border-neon-lime" />
        <span className="absolute -bottom-6 -left-6 w-6 h-6 border-b-2 border-l-2 border-neon-lime" />
        <span className="absolute -bottom-6 -right-6 w-6 h-6 border-b-2 border-r-2 border-neon-lime" />

        <div className="font-mono text-[11px] tracking-[0.35em] uppercase text-neon-lime mb-6 flex items-center gap-3">
          <span className="w-2 h-2 bg-neon-lime animate-pulse" />
          system :: initialising
        </div>

        <div className="font-display uppercase text-white text-3xl sm:text-5xl tracking-tighter leading-none">
          <span className="glitch glow" data-text="CHANDAN.AI">CHANDAN.AI</span>
        </div>

        <div className="mt-10 space-y-1.5 font-mono text-sm min-h-[180px]">
          {LINES.slice(0, step).map((l, i) => (
            <div key={i} style={{ color: l.color }}>
              {l.text}
            </div>
          ))}
          <span className="inline-block w-2 h-4 bg-neon-lime align-middle animate-pulse" />
        </div>

        {/* progress bar */}
        <div className="mt-10">
          <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.3em] uppercase text-white/50 mb-2">
            <span>boot · {Math.round(progress * 100)}%</span>
            <span>{progress < 1 ? "loading" : "ready"}</span>
          </div>
          <div className="h-1 bg-white/10 relative overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-neon-lime transition-[width] duration-75"
              style={{ width: `${progress * 100}%` }}
            />
            <div className="absolute inset-0 scan-sweep" />
          </div>
        </div>
      </div>
    </div>
  );
}
