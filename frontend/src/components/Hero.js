import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import HeroScene from "./HeroScene";
import { PROFILE } from "@/data/portfolio";

function Typewriter({ text, delay = 0 }) {
  const [out, setOut] = useState("");
  useEffect(() => {
    let i = 0;
    let t;
    const start = setTimeout(() => {
      t = setInterval(() => {
        i++;
        setOut(text.slice(0, i));
        if (i >= text.length) clearInterval(t);
      }, 55);
    }, delay);
    return () => { clearTimeout(start); clearInterval(t); };
  }, [text, delay]);
  return <span data-testid="hero-typewriter">{out}<span className="text-neon-lime animate-pulse">_</span></span>;
}

const reveal = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.8, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] } }),
};

export default function Hero() {
  return (
    <section id="top" className="relative min-h-screen overflow-hidden scanlines grid-bg" data-testid="hero-section">
      <HeroScene />

      {/* radial vignette */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_transparent_30%,_#050505_85%)] pointer-events-none" />

      <div className="relative z-10 px-6 sm:px-12 lg:px-24 pt-32 sm:pt-40 lg:pt-48 pb-24 min-h-screen flex flex-col justify-center">
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.08 } } }}
          className="max-w-6xl"
        >
          <motion.div variants={reveal} className="section-label mb-6" data-testid="hero-status">
            {PROFILE.status}
          </motion.div>

          <motion.p variants={reveal} className="font-mono text-xs tracking-[0.35em] uppercase text-white/50 mb-4">
            <span className="text-neon-lime">/</span> Hello, I am
          </motion.p>

          <motion.h1
            variants={reveal}
            className="font-display font-black uppercase leading-[0.95] tracking-tighter text-white text-[14vw] sm:text-[10vw] lg:text-[8vw]"
            data-testid="hero-name"
          >
            <span className="glitch glow" data-text="CHANDAN">CHANDAN</span>
            <br />
            <span className="text-neon-lime glow">GOWDA</span>
            <span className="text-white">.AH</span>
          </motion.h1>

          <motion.div variants={reveal} className="mt-8 font-mono text-base sm:text-lg text-white/80 max-w-2xl" data-testid="hero-role">
            <span className="text-neon-cyan">&gt; </span>
            <Typewriter text="GenAI Data Engineer · LLM Architect · RAG Specialist" delay={400} />
          </motion.div>

          <motion.p variants={reveal} className="mt-6 max-w-2xl font-mono text-sm sm:text-base text-white/60 leading-relaxed" data-testid="hero-tagline">
            {PROFILE.tagline}
          </motion.p>

          <motion.div variants={reveal} className="mt-12 flex flex-wrap gap-4 items-center">
            <a href="#work" data-testid="hero-cta-work" className="btn-magnetic">
              View Projects
              <span aria-hidden>→</span>
            </a>
            <a href="#contact" data-testid="hero-cta-contact" className="btn-ghost">
              Get In Touch
            </a>
            <a
              href={PROFILE.resumeUrl}
              download
              data-testid="hero-cta-resume"
              className="btn-ghost"
            >
              <span className="text-neon-cyan">↓</span> Resume
            </a>
          </motion.div>

          {/* Mobile-only quick verified badge link */}
          <motion.div variants={reveal} className="lg:hidden mt-6 flex items-center gap-2 font-mono text-[11px]">
            <a
              href="https://www.credly.com/badges/b1be9dc2-43f7-4a92-b194-c61a1b772e7b"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Verify Claude Certified Architect credential on Credly"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 hover:border-amber-400 text-amber-300 transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
              <span className="font-bold tracking-wide">Claude Certified Architect</span>
              <span className="text-white/50 text-[10px]">Credly ↗</span>
            </a>
          </motion.div>
        </motion.div>

        {/* Claude Certified Architect Badge (Desktop Holographic Watermark / Emblem in Blank Space) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85, x: 40 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ delay: 0.8, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="hidden lg:flex absolute right-10 xl:right-20 2xl:right-28 top-1/2 -translate-y-1/2 z-10 flex-col items-center select-none"
          data-testid="hero-claude-architect-badge"
        >
          {/* Gentle continuous float */}
          <motion.div
            animate={{ y: [-8, 8, -8], rotate: [-0.5, 0.5, -0.5] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="relative flex flex-col items-center group cursor-pointer"
          >
            {/* Ambient warm glow in Anthropic terracotta/amber tones */}
            <div className="absolute -inset-16 bg-[radial-gradient(circle,_rgba(217,119,87,0.24)_0%,_rgba(245,158,11,0.08)_45%,_transparent_70%)] blur-3xl pointer-events-none transition-all duration-700 group-hover:bg-[radial-gradient(circle,_rgba(217,119,87,0.42)_0%,_rgba(245,158,11,0.2)_50%,_transparent_70%)]" />

            {/* Orbital tech rings */}
            <div className="absolute -inset-8 rounded-full border border-dashed border-amber-500/20 animate-[spin_60s_linear_infinite] pointer-events-none group-hover:border-amber-400/40 transition-colors" />
            <div className="absolute -inset-4 rounded-full border border-dotted border-white/10 animate-[spin_40s_linear_infinite_reverse] pointer-events-none" />

            {/* Cyber HUD Corner Reticles */}
            <div className="absolute -top-3 -left-3 font-mono text-[10px] text-amber-400/40 select-none pointer-events-none">⌜</div>
            <div className="absolute -top-3 -right-3 font-mono text-[10px] text-amber-400/40 select-none pointer-events-none">⌝</div>
            <div className="absolute -bottom-3 -left-3 font-mono text-[10px] text-amber-400/40 select-none pointer-events-none">⌞</div>
            <div className="absolute -bottom-3 -right-3 font-mono text-[10px] text-amber-400/40 select-none pointer-events-none">⌟</div>

            {/* Top HUD Header */}
            <div className="mb-2.5 flex items-center gap-2 font-mono text-[9px] tracking-[0.25em] uppercase text-amber-300/80 group-hover:text-amber-300 transition-colors">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
              <span>// ANTHROPIC CREDENTIAL</span>
            </div>

            {/* Interactive Link to Credly */}
            <a
              href="https://www.credly.com/badges/b1be9dc2-43f7-4a92-b194-c61a1b772e7b"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Verify Claude Certified Architect credential on Credly"
              className="relative p-3.5 rounded-2xl bg-black/40 backdrop-blur-md border border-amber-500/30 group-hover:border-amber-400/70 shadow-[0_0_35px_rgba(217,119,87,0.22)] group-hover:shadow-[0_0_55px_rgba(217,119,87,0.5)] transition-all duration-500 flex flex-col items-center pointer-events-auto"
            >
              <img
                src="/certificates/claude-architect-badge-cropped.png"
                alt="Claude Certified Architect Badge"
                className="w-48 h-48 xl:w-56 xl:h-56 object-contain drop-shadow-[0_0_25px_rgba(217,119,87,0.45)] group-hover:scale-105 transition-transform duration-500"
              />

              {/* Bottom Badge Tag */}
              <div className="mt-3 text-center">
                <div className="font-display font-bold text-xs tracking-wider text-amber-200 group-hover:text-white transition-colors">
                  CLAUDE CERTIFIED ARCHITECT
                </div>
                <div className="font-mono text-[10px] tracking-widest text-white/50 group-hover:text-amber-300 flex items-center justify-center gap-1.5 mt-1 transition-colors">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>VERIFIED ON CREDLY</span>
                  <span className="text-amber-400">↗</span>
                </div>
              </div>
            </a>
          </motion.div>
        </motion.div>

        {/* Mobile / Tablet subtle background watermark */}
        <div className="lg:hidden absolute right-4 top-1/3 -translate-y-1/2 opacity-15 pointer-events-none z-0">
          <img
            src="/certificates/claude-architect-badge-cropped.png"
            alt=""
            aria-hidden="true"
            className="w-40 h-40 object-contain blur-[0.5px]"
          />
        </div>

        {/* bottom data strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 1 }}
          className="absolute bottom-6 left-0 right-0 px-6 sm:px-12 lg:px-24 flex items-center justify-between font-mono text-[10px] sm:text-xs tracking-[0.3em] uppercase text-white/40"
        >
          <span>// {PROFILE.location} · UTC+5:30</span>
          <span className="hidden sm:inline">scroll to explore ↓</span>
          <span>SYS://v4.0</span>
        </motion.div>
      </div>
    </section>
  );
}
