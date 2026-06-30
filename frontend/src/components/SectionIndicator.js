import { useEffect, useRef, useState } from "react";

const SECTIONS = [
  { id: "top",      label: "Hero" },
  { id: "meet-me",  label: "Meet" },
  { id: "about",    label: "About" },
  { id: "skills",   label: "Skills" },
  { id: "work",     label: "Work" },
  { id: "career",   label: "Career" },
  { id: "contact",  label: "Contact" },
];

export default function SectionIndicator() {
  const [active, setActive] = useState(0);
  const elsRef = useRef([]);

  useEffect(() => {
    elsRef.current = SECTIONS.map((s) => document.getElementById(s.id));
    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the most-visible section
        let best = -1;
        let bestRatio = 0;
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > bestRatio) {
            const idx = elsRef.current.findIndex((el) => el === entry.target);
            if (idx >= 0) {
              best = idx;
              bestRatio = entry.intersectionRatio;
            }
          }
        });
        if (best >= 0) setActive(best);
      },
      { threshold: [0.2, 0.4, 0.6] }
    );
    elsRef.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const goTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav
      aria-label="Section navigator"
      className="fixed right-4 sm:right-6 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-end gap-3"
      data-testid="section-indicator"
    >
      {SECTIONS.map((s, i) => {
        const isActive = i === active;
        return (
          <button
            key={s.id}
            onClick={() => goTo(s.id)}
            data-testid={`indicator-${s.id}`}
            aria-label={`Go to ${s.label}`}
            className="group flex items-center gap-3"
          >
            <span
              className={`font-mono text-[10px] tracking-[0.3em] uppercase transition-all duration-300 ${
                isActive ? "opacity-100 text-neon-lime translate-x-0" : "opacity-0 -translate-x-2 group-hover:opacity-80 group-hover:translate-x-0 text-white/70"
              }`}
            >
              {s.label}
            </span>
            <span className="relative flex items-center justify-center w-3 h-3">
              <span
                className={`absolute inset-0 border transition-colors duration-300 ${
                  isActive ? "border-neon-lime" : "border-white/30 group-hover:border-white/70"
                }`}
              />
              {isActive && <span className="absolute inset-1 bg-neon-lime" />}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
