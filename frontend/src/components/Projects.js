import { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PROJECTS, PROJECT_FILTERS } from "@/data/portfolio";
import ScrambleText from "@/components/ScrambleText";

function TiltCard({ children, className, ...rest }) {
  const ref = useRef(null);

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${-y * 6}deg) rotateY(${x * 8}deg) translateZ(0)`;
    el.style.setProperty("--mx", `${(x + 0.5) * 100}%`);
    el.style.setProperty("--my", `${(y + 0.5) * 100}%`);
  };
  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "perspective(900px) rotateX(0) rotateY(0)";
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ transformStyle: "preserve-3d", transition: "transform 0.18s ease-out" }}
      className={className}
      {...rest}
    >
      {children}
    </div>
  );
}

export default function Projects() {
  const [filter, setFilter] = useState("All");

  const list = useMemo(
    () => (filter === "All" ? PROJECTS : PROJECTS.filter((p) => p.category === filter)),
    [filter]
  );

  return (
    <section id="work" className="relative py-32 lg:py-48 px-6 sm:px-12 lg:px-24 border-t border-white/5" data-testid="projects-section">
      <div className="flex items-end justify-between flex-wrap gap-8 mb-12">
        <div>
          <div className="section-label mb-6">// 04 — Selected Work</div>
          <h2 className="font-display uppercase tracking-tighter text-white text-4xl sm:text-5xl lg:text-6xl leading-[0.95]">
            <span className="text-neon-lime glow">
              <ScrambleText text="13" testId="projects-count-scramble" />
            </span> Projects.<br/>All shipped.
          </h2>
        </div>
        <div className="flex flex-wrap gap-2" data-testid="project-filters">
          {PROJECT_FILTERS.map((f) => {
            const count = f === "All" ? PROJECTS.length : PROJECTS.filter((p) => p.category === f).length;
            const active = filter === f;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                data-testid={`filter-${f.replace(/\s+/g, '-').toLowerCase()}`}
                className={`font-mono text-[11px] tracking-[0.2em] uppercase px-4 py-2 border transition-colors ${
                  active
                    ? "bg-neon-lime text-black border-neon-lime"
                    : "text-white/70 border-white/15 hover:border-neon-lime hover:text-neon-lime"
                }`}
              >
                {f} <span className={`ml-1 ${active ? "text-black/60" : "text-white/40"}`}>({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <AnimatePresence mode="popLayout">
          {list.map((p, i) => (
            <motion.div
              key={p.id}
              layout
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, delay: (i % 9) * 0.05, ease: [0.16, 1, 0.3, 1] }}
            >
              <TiltCard
                className="cell cell-corner p-6 group relative flex flex-col min-h-[300px] tilt-spotlight"
                data-cursor="hover"
                data-testid={`project-card-${p.id}`}
              >
              <div className="flex items-center justify-between mb-6">
                <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/40">
                  #{String(p.id).padStart(2, "0")} / {p.category}
                </span>
                <span className="flex items-center gap-2 font-mono text-[10px] tracking-[0.25em] uppercase text-neon-lime">
                  <span className="w-1.5 h-1.5 rounded-full bg-neon-lime animate-pulse" />
                  Completed
                </span>
              </div>

              <h3 className="font-display uppercase tracking-tight text-white text-lg sm:text-xl leading-tight group-hover:text-neon-lime transition-colors">
                {p.title}
              </h3>

              <p className="mt-4 font-mono text-xs text-white/60 leading-relaxed flex-1">
                {p.note}
              </p>

              <div className="mt-6 flex flex-wrap gap-1.5">
                {p.tech.slice(0, 4).map((t) => (
                  <span key={t} className="tag text-[10px] px-2 py-1">{t}</span>
                ))}
                {p.tech.length > 4 && (
                  <span className="tag text-[10px] px-2 py-1 text-neon-cyan border-neon-cyan/40">+{p.tech.length - 4}</span>
                )}
              </div>

              {p.components !== "—" && (
                <div className="mt-4 pt-4 border-t border-white/5 font-mono text-[10px] tracking-[0.2em] uppercase text-white/40">
                  Components: <span className="text-neon-lime">{p.components}</span>
                </div>
              )}

              {/* hover corner arrow */}
              <span className="absolute top-4 right-4 font-mono text-white/30 group-hover:text-neon-lime group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">↗</span>
              </TiltCard>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}
