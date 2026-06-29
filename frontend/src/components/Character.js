import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { PROFILE } from "@/data/portfolio";

const DIALOGUE = [
  "Hey, I'm Chandan. I build AI agents, RAG systems and the data pipelines that feed them.",
  "Microsoft Copilot Studio? Google AI Studio? Ollama? Yeah — I ship POCs in days, not weeks.",
  "Healthcare. Finance. Internal platforms. I've taken LLMs from prompt to production.",
  "Need someone to architect your next AI feature? I'm your engineer.",
  "Fun fact: I built a full internal video platform from scratch — TikTok-style 'Shorts' included.",
  "Always up for an interesting problem. Hit the contact section below.",
];

const AVATAR_CLOSED = "https://chandan-ai-engineer.vercel.app/chandan_anime_closed.png";
const AVATAR_OPEN = "https://chandan-ai-engineer.vercel.app/chandan_anime_open.png";

export default function Character() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: false, margin: "-30%" });

  const [lineIdx, setLineIdx] = useState(0);
  const [text, setText] = useState("");
  const [speaking, setSpeaking] = useState(false);
  const [mouthOpen, setMouthOpen] = useState(false);

  // Typewriter for current line
  useEffect(() => {
    if (!inView) return;
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
        // hold then advance
        setTimeout(() => setLineIdx((n) => (n + 1) % DIALOGUE.length), 2800);
      }
    }, 28);
    return () => clearInterval(type);
  }, [lineIdx, inView]);

  // Mouth flap while speaking
  useEffect(() => {
    if (!speaking) {
      setMouthOpen(false);
      return;
    }
    const flap = setInterval(() => setMouthOpen((m) => !m), 130);
    return () => clearInterval(flap);
  }, [speaking]);

  return (
    <section
      ref={sectionRef}
      id="meet-me"
      className="relative py-32 lg:py-48 px-6 sm:px-12 lg:px-24 border-t border-white/5 overflow-hidden"
      data-testid="meetme-section"
    >
      {/* Background terminal grid accent */}
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
      <div className="absolute -top-10 right-0 w-[40rem] h-[40rem] bg-neon-lime/[0.05] blur-3xl pointer-events-none" />

      <div className="relative grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Character */}
        <div className="lg:col-span-5 flex justify-center lg:justify-start" data-testid="meetme-avatar-wrap">
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            {/* glowing aura */}
            <div className="absolute inset-0 -m-8 rounded-full bg-neon-lime/10 blur-3xl animate-pulse" />
            <div className="absolute inset-0 -m-2 border border-neon-lime/30" />

            <div className="relative w-[280px] h-[340px] sm:w-[360px] sm:h-[440px] bg-void-700/40 border border-white/10 overflow-hidden cell-corner">
              {/* scanlines */}
              <div className="absolute inset-0 scanlines pointer-events-none" />
              <img
                src={mouthOpen ? AVATAR_OPEN : AVATAR_CLOSED}
                alt={`${PROFILE.name} avatar`}
                className="w-full h-full object-cover"
                draggable={false}
                data-testid="meetme-avatar-img"
              />
              {/* HUD overlay */}
              <div className="absolute inset-x-0 top-0 px-3 py-2 flex items-center justify-between font-mono text-[10px] tracking-[0.25em] uppercase text-neon-lime z-10">
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-neon-lime animate-pulse" />
                  LIVE
                </span>
                <span className="text-white/40">CHN.AI/v4</span>
              </div>
              <div className="absolute inset-x-0 bottom-0 px-3 py-2 flex items-center justify-between font-mono text-[10px] tracking-[0.25em] uppercase z-10 bg-gradient-to-t from-black/80 to-transparent">
                <span className="text-white/60">{speaking ? "transmitting…" : "idle"}</span>
                <span className="text-neon-cyan">{String(lineIdx + 1).padStart(2, "0")}/{String(DIALOGUE.length).padStart(2, "0")}</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Speech */}
        <div className="lg:col-span-7" data-testid="meetme-speech-wrap">
          <div className="section-label mb-6">// 01 — Meet Me</div>
          <h2 className="font-display uppercase tracking-tighter text-white text-3xl sm:text-4xl lg:text-5xl leading-[0.95] mb-8">
            Say hi to the <span className="text-neon-lime glow">engineer</span> behind the agents.
          </h2>

          {/* Terminal-style speech bubble */}
          <div className="relative cell p-6 sm:p-8 min-h-[200px] sm:min-h-[220px]" data-testid="meetme-bubble">
            {/* speech tail pointing to avatar */}
            <div className="hidden lg:block absolute -left-3 top-12 w-3 h-3 border-l border-b border-white/10 bg-void-700 rotate-45" />

            <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 rounded-full bg-neon-danger/70" />
                <span className="w-2 h-2 rounded-full bg-neon-lime/70" />
                <span className="w-2 h-2 rounded-full bg-neon-cyan/70" />
              </div>
              <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/40">~/chandan@portfolio</span>
            </div>

            <div className="font-mono text-base sm:text-lg leading-relaxed text-white/85 min-h-[5em]">
              <span className="text-neon-cyan">chandan@ai </span>
              <span className="text-white/40">~ $ </span>
              <span data-testid="meetme-line">{text}</span>
              <span className={`inline-block w-2 h-5 bg-neon-lime ml-1 -mb-0.5 ${speaking ? "animate-pulse" : "opacity-50"}`} />
            </div>

            {/* Line indicators */}
            <div className="mt-6 flex items-center gap-2">
              {DIALOGUE.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setLineIdx(i)}
                  data-testid={`meetme-dot-${i}`}
                  aria-label={`Switch to line ${i + 1}`}
                  className={`h-1 transition-all ${
                    i === lineIdx ? "w-8 bg-neon-lime" : "w-3 bg-white/20 hover:bg-white/60"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2 font-mono text-[11px] tracking-[0.2em] uppercase text-white/40">
            <span className="text-neon-lime/70">›</span>
            <span>auto-cycling dialogue</span>
            <span className="text-white/20">·</span>
            <span>click a dot to jump</span>
          </div>
        </div>
      </div>
    </section>
  );
}
