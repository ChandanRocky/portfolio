import { useEffect, useRef, useState, useMemo } from "react";
import { motion, useInView } from "framer-motion";
import { PROFILE } from "@/data/portfolio";

const DIALOGUE = [
  "Hey, I'm Chandan. I build AI agents, RAG systems and the data pipelines that feed them.",
  "Microsoft Copilot Studio. Google AI Studio. Ollama. I ship GenAI POCs in days, not weeks.",
  "Healthcare. Finance. Internal platforms. I've taken LLMs from prompt to production.",
  "I architect full-stack AI platforms — backend, frontend, RAG, the whole stack.",
  "Certified across AWS, Databricks, Google Cloud and OCI. Always shipping.",
  "Want to build something intelligent? Let's talk — contact section is right below.",
];

const PHOTO = "https://customer-assets.emergentagent.com/job_engineer-portfolio-71/artifacts/3pj26vap_profile.jpeg";

const HUD_LABELS = [
  { top: "12%", text: "ID://CGAH-04" },
  { top: "26%", text: "STATUS: ONLINE" },
  { top: "40%", text: "ROLE: GENAI/ENG" },
  { top: "54%", text: "LOC: IN +5:30" },
  { top: "68%", text: "BAND: 1024.7 THz" },
  { top: "82%", text: "FEED: SECURE" },
];

export default function Character() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: false, margin: "-30%" });

  const [lineIdx, setLineIdx] = useState(0);
  const [text, setText] = useState("");
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);

  // Typewriter
  useEffect(() => {
    if (!inView || paused) return;
    const line = DIALOGUE[lineIdx];
    setText("");
    setSpeaking(true);
    let i = 0;
    const type = setInterval(() => {
      i++;
      setText(line.slice(0, i));
      if (i >= line.length) {
        clearInterval(type);
        setSpeaking(false);
        setTimeout(() => setLineIdx((n) => (n + 1) % DIALOGUE.length), 3000);
      }
    }, 28);
    return () => clearInterval(type);
  }, [lineIdx, inView, paused]);

  // 16 equalizer bar heights — randomized but stable across renders during a single "speaking" cycle
  const eqDelays = useMemo(
    () => Array.from({ length: 22 }, () => (Math.random() * 0.6).toFixed(2)),
    []
  );

  return (
    <section
      ref={sectionRef}
      id="meet-me"
      className="relative py-32 lg:py-48 px-6 sm:px-12 lg:px-24 border-t border-white/5 overflow-hidden"
      data-testid="meetme-section"
    >
      {/* Background ambient */}
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
      <div className="absolute -top-32 -left-20 w-[34rem] h-[34rem] bg-neon-lime/[0.06] blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 right-0 w-[34rem] h-[34rem] bg-neon-cyan/[0.05] blur-3xl pointer-events-none" />

      <div className="relative grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
        {/* Hologram portrait */}
        <div className="lg:col-span-5 flex justify-center lg:justify-start">
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className={`relative ${speaking ? "is-speaking" : ""}`}
            data-testid="meetme-avatar-wrap"
          >
            {/* Outer ping rings (only while speaking) */}
            {speaking && (
              <>
                <div className="absolute inset-0 -m-6 border border-neon-lime/40 rounded-sm ping-ring" />
                <div className="absolute inset-0 -m-6 border border-neon-cyan/30 rounded-sm ping-ring" style={{ animationDelay: "0.8s" }} />
              </>
            )}

            {/* Orbiting corner brackets ring */}
            <div className="absolute inset-0 -m-10 pointer-events-none orbit-slow">
              <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-neon-lime/60" />
              <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-neon-lime/60" />
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b border-l border-neon-lime/60" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-neon-lime/60" />
            </div>
            <div className="absolute inset-0 -m-16 pointer-events-none orbit-rev">
              <div className="absolute top-1/2 left-0 w-2 h-2 bg-neon-cyan/70" />
              <div className="absolute top-1/2 right-0 w-2 h-2 bg-neon-cyan/70" />
            </div>

            {/* Frame */}
            <div className="relative w-[300px] h-[380px] sm:w-[380px] sm:h-[480px] bg-void-700/40 border border-neon-lime/40 overflow-hidden flicker">
              {/* RGB-split layers — only visible when speaking */}
              <div className="absolute inset-0 layer-cyan opacity-0 pointer-events-none" style={{ opacity: speaking ? 0.55 : 0 }}>
                <img
                  src={PHOTO}
                  alt=""
                  className="w-full h-full object-cover"
                  style={{ filter: "hue-rotate(180deg) saturate(2) contrast(1.1) brightness(0.7)", mixBlendMode: "screen" }}
                  draggable={false}
                />
              </div>
              <div className="absolute inset-0 layer-magenta opacity-0 pointer-events-none" style={{ opacity: speaking ? 0.55 : 0 }}>
                <img
                  src={PHOTO}
                  alt=""
                  className="w-full h-full object-cover"
                  style={{ filter: "hue-rotate(-50deg) saturate(2) contrast(1.1) brightness(0.7)", mixBlendMode: "screen" }}
                  draggable={false}
                />
              </div>

              {/* Main photo — tinted toward lime/green */}
              <img
                src={PHOTO}
                alt={`${PROFILE.name} portrait`}
                draggable={false}
                data-testid="meetme-avatar-img"
                className="absolute inset-0 w-full h-full object-cover"
                style={{
                  filter: "contrast(1.15) saturate(0.6) brightness(0.95) sepia(0.15) hue-rotate(40deg)",
                }}
              />

              {/* Lime tint overlay */}
              <div className="absolute inset-0 mix-blend-color pointer-events-none"
                   style={{ background: "linear-gradient(180deg, rgba(204,255,0,0.35), rgba(0,240,255,0.18))" }} />

              {/* Vignette */}
              <div className="absolute inset-0 pointer-events-none"
                   style={{ background: "radial-gradient(ellipse at center, transparent 50%, rgba(5,5,5,0.85) 100%)" }} />

              {/* Scanlines */}
              <div className="absolute inset-0 scanlines pointer-events-none" />

              {/* Moving scan sweep */}
              <div className="scan-sweep" />

              {/* Corner targeting brackets */}
              <span className="absolute top-2 left-2 w-4 h-4 border-t border-l border-neon-lime" />
              <span className="absolute top-2 right-2 w-4 h-4 border-t border-r border-neon-lime" />
              <span className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-neon-lime" />
              <span className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-neon-lime" />

              {/* Top HUD */}
              <div className="absolute inset-x-0 top-0 px-3 py-2 flex items-center justify-between font-mono text-[10px] tracking-[0.25em] uppercase z-10 bg-gradient-to-b from-black/80 to-transparent">
                <span className="flex items-center gap-2 text-neon-lime">
                  <span className="w-1.5 h-1.5 rounded-full bg-neon-lime animate-pulse" />
                  REC · LIVE
                </span>
                <span className="text-white/50">CHN.AI/v4.0</span>
              </div>

              {/* Bottom HUD with equalizer */}
              <div className="absolute inset-x-0 bottom-0 px-3 pt-3 pb-2 z-10 bg-gradient-to-t from-black/90 to-transparent">
                <div className="flex items-end justify-between mb-2 h-8 gap-[3px]" data-testid="meetme-eq">
                  {eqDelays.map((d, i) => (
                    <span
                      key={i}
                      className="eq-bar"
                      style={{ animationDelay: `${d}s` }}
                    />
                  ))}
                </div>
                <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.25em] uppercase">
                  <span className="text-white/60">{speaking ? "transmitting…" : "standby"}</span>
                  <span className="text-neon-cyan">{String(lineIdx + 1).padStart(2, "0")}/{String(DIALOGUE.length).padStart(2, "0")}</span>
                </div>
              </div>
            </div>

            {/* Floating HUD tags around the frame */}
            {HUD_LABELS.map((l, i) => (
              <span
                key={i}
                className="absolute hidden xl:block font-mono text-[9px] tracking-[0.25em] uppercase text-neon-lime/80 float-y whitespace-nowrap"
                style={{ left: "calc(100% + 18px)", top: l.top, animationDelay: `${i * 0.4}s` }}
              >
                <span className="text-white/30 mr-1">┄┄</span>{l.text}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Speech panel */}
        <div className="lg:col-span-7">
          <div className="section-label mb-6">// 01 — Meet Me</div>
          <h2 className="font-display uppercase tracking-tighter text-white text-3xl sm:text-4xl lg:text-5xl leading-[0.95] mb-8">
            Say hi to the <span className="text-neon-lime glow">engineer</span><br/>
            behind the agents.
          </h2>

          <div
            className="relative cell p-6 sm:p-8 min-h-[240px]"
            data-testid="meetme-bubble"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <div className="hidden lg:block absolute -left-3 top-12 w-3 h-3 border-l border-b border-white/10 bg-void-700 rotate-45" />

            <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 rounded-full bg-neon-danger/70" />
                <span className="w-2 h-2 rounded-full bg-neon-lime/70" />
                <span className="w-2 h-2 rounded-full bg-neon-cyan/70" />
              </div>
              <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/40">~/chandan@portfolio · transmission.log</span>
            </div>

            <div className="font-mono text-base sm:text-lg leading-relaxed text-white/90 min-h-[5.5em]">
              <span className="text-neon-cyan">chandan@ai </span>
              <span className="text-white/40">~ $ </span>
              <span data-testid="meetme-line">{text}</span>
              <span className={`inline-block w-2 h-5 bg-neon-lime ml-1 -mb-0.5 ${speaking ? "" : "animate-pulse"}`} />
            </div>

            <div className="mt-6 flex items-center gap-2 flex-wrap">
              {DIALOGUE.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setLineIdx(i)}
                  data-testid={`meetme-dot-${i}`}
                  aria-label={`Switch to line ${i + 1}`}
                  className={`h-1 transition-all ${
                    i === lineIdx ? "w-10 bg-neon-lime" : "w-3 bg-white/15 hover:bg-white/60"
                  }`}
                />
              ))}
              <span className="ml-auto font-mono text-[10px] tracking-[0.25em] uppercase text-white/30">
                {paused ? "paused · hover off to resume" : "auto-cycle"}
              </span>
            </div>
          </div>

          {/* Tags row */}
          <div className="mt-8 flex flex-wrap gap-2" data-testid="meetme-tags">
            {["3 yrs", "GenAI", "RAG", "Copilot Studio", "Databricks", "Full-Stack AI"].map((t) => (
              <span key={t} className="tag">{t}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
