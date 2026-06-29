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
          </motion.div>
        </motion.div>

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
