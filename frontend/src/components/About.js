import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { STATS, PROFILE } from "@/data/portfolio";

function Counter({ to, suffix = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const dur = 1500;
    const t0 = performance.now();
    let raf;
    const step = (t) => {
      const p = Math.min((t - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(eased * to));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);
  return <span ref={ref}>{val}{suffix}</span>;
}

export default function About() {
  return (
    <section id="about" className="relative py-32 lg:py-48 px-6 sm:px-12 lg:px-24" data-testid="about-section">
      <div className="grid lg:grid-cols-12 gap-16 lg:gap-24">
        <div className="lg:col-span-5">
          <div className="section-label mb-8">// 02 — About</div>
          <h2 className="font-display uppercase tracking-tighter text-white text-4xl sm:text-5xl lg:text-6xl leading-[0.95]">
            Engineering<br/>
            <span className="text-neon-lime glow">intelligence</span><br/>
            that ships.
          </h2>
          <p className="mt-8 font-mono text-sm text-white/60 leading-relaxed max-w-md" data-testid="about-bio">
            Results-driven GenAI Data Engineer with 3 years of experience designing AI-powered
            solutions, building scalable data pipelines, and developing enterprise automation
            platforms. Deep expertise in RAG, local LLMs (Ollama), Copilot Studio agents and
            full-stack AI platforms — certified across AWS, Databricks, Google Cloud and OCI.
          </p>

          <div className="mt-10 flex flex-wrap gap-2" data-testid="about-tags">
            {PROFILE.focusTags.map((t) => (
              <span key={t} className="tag">{t}</span>
            ))}
          </div>
        </div>

        <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 auto-rows-[140px] sm:auto-rows-[180px] gap-3 sm:gap-4">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
              className={`cell cell-corner p-4 sm:p-6 flex flex-col justify-between ${
                i === 0 ? "col-span-2 row-span-1" : i === 2 ? "sm:row-span-2" : ""
              }`}
              data-testid={`stat-${s.label.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/40">
                /{String(i + 1).padStart(2, "0")}
              </div>
              <div>
                <div className="font-display text-5xl sm:text-6xl text-neon-lime glow leading-none">
                  <Counter to={s.value} suffix={s.suffix} />
                </div>
                <div className="mt-3 font-mono text-[11px] tracking-[0.2em] uppercase text-white/60">
                  {s.label}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
