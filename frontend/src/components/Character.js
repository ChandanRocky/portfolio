import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { PROFILE } from "@/data/portfolio";

const PHOTO = "https://customer-assets.emergentagent.com/job_engineer-portfolio-71/artifacts/3pj26vap_profile.jpeg";
const AUDIO_SRC = "/audio/meet-me.mp3";

const SCRIPT_LINES = [
  "Hey, I'm Chandan Gowda.",
  "GenAI Data Engineer · 3 years shipping production AI systems.",
  "I design AI agents in Microsoft Copilot Studio and Google AI Studio.",
  "I architect RAG pipelines with local LLMs and Groq.",
  "And I build the data pipelines that feed them.",
  "Healthcare AI agents. Full internal video platforms. From prompt to production.",
  "Certified across AWS, Databricks, Google Cloud and Oracle Cloud.",
  "If you're building something intelligent — let's talk.",
];

const HUD_LABELS = [
  { top: "12%", text: "ID://CGAH-04" },
  { top: "26%", text: "STATUS: ONLINE" },
  { top: "40%", text: "ROLE: GENAI/ENG" },
  { top: "54%", text: "LOC: IN +5:30" },
  { top: "68%", text: "BAND: 1024.7 THz" },
  { top: "82%", text: "FEED: SECURE" },
];

const BAR_COUNT = 22;

function fmtTime(s) {
  if (!Number.isFinite(s)) return "00:00";
  const m = Math.floor(s / 60).toString().padStart(2, "0");
  const r = Math.floor(s % 60).toString().padStart(2, "0");
  return `${m}:${r}`;
}

export default function Character() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: false, margin: "-30%" });

  const audioRef = useRef(null);
  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const sourceNodeRef = useRef(null);
  const rafRef = useRef(null);
  const barsRef = useRef([]);

  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentLine, setCurrentLine] = useState(0);

  // Wire Web Audio analyser once when first played (autoplay-safe gesture)
  const ensureAudioGraph = () => {
    if (audioCtxRef.current) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    const ctx = new AC();
    const source = ctx.createMediaElementSource(audioRef.current);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 128;
    analyser.smoothingTimeConstant = 0.75;
    source.connect(analyser);
    analyser.connect(ctx.destination);
    audioCtxRef.current = ctx;
    analyserRef.current = analyser;
    sourceNodeRef.current = source;
    dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);
  };

  const animate = () => {
    const analyser = analyserRef.current;
    const data = dataArrayRef.current;
    if (analyser && data) {
      analyser.getByteFrequencyData(data);
      // Map FFT bins to BAR_COUNT visual bars (sample evenly, weighted toward lows)
      const step = Math.floor(data.length / BAR_COUNT);
      for (let i = 0; i < BAR_COUNT; i++) {
        const v = data[i * step] / 255;
        const el = barsRef.current[i];
        if (el) el.style.transform = `scaleY(${Math.max(0.06, v * 1.2)})`;
      }
    }
    rafRef.current = requestAnimationFrame(animate);
  };

  const handlePlay = async () => {
    try {
      ensureAudioGraph();
      if (audioCtxRef.current.state === "suspended") {
        await audioCtxRef.current.resume();
      }
      await audioRef.current.play();
    } catch (e) {
      console.warn("Audio play blocked:", e);
    }
  };

  const handlePause = () => audioRef.current && audioRef.current.pause();
  const togglePlay = () => (playing ? handlePause() : handlePlay());
  const handleSeek = (pct) => {
    if (!audioRef.current || !duration) return;
    audioRef.current.currentTime = duration * pct;
  };
  const handleRestart = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    handlePlay();
  };

  // Attach audio events
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onPlay = () => { setPlaying(true); rafRef.current = requestAnimationFrame(animate); };
    const onPause = () => { setPlaying(false); cancelAnimationFrame(rafRef.current); };
    const onEnded = () => { setPlaying(false); cancelAnimationFrame(rafRef.current); };
    const onMeta = () => setDuration(a.duration || 0);
    const onTime = () => {
      if (!a.duration) return;
      const t = a.currentTime;
      setProgress(t / a.duration);
      // Map time → current line for caption display
      const idx = Math.min(SCRIPT_LINES.length - 1, Math.floor((t / a.duration) * SCRIPT_LINES.length));
      setCurrentLine(idx);
    };
    a.addEventListener("play", onPlay);
    a.addEventListener("pause", onPause);
    a.addEventListener("ended", onEnded);
    a.addEventListener("loadedmetadata", onMeta);
    a.addEventListener("timeupdate", onTime);
    return () => {
      a.removeEventListener("play", onPlay);
      a.removeEventListener("pause", onPause);
      a.removeEventListener("ended", onEnded);
      a.removeEventListener("loadedmetadata", onMeta);
      a.removeEventListener("timeupdate", onTime);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Pause when section is fully out of view
  useEffect(() => {
    if (!inView && playing) handlePause();
  }, [inView, playing]);

  return (
    <section
      ref={sectionRef}
      id="meet-me"
      className="relative py-32 lg:py-48 px-6 sm:px-12 lg:px-24 border-t border-white/5 overflow-hidden"
      data-testid="meetme-section"
    >
      {/* Hidden audio element */}
      <audio ref={audioRef} src={AUDIO_SRC} preload="auto" crossOrigin="anonymous" data-testid="meetme-audio" />

      {/* Ambient blobs */}
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
      <div className="absolute -top-32 -left-20 w-[34rem] h-[34rem] bg-neon-lime/[0.06] blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 right-0 w-[34rem] h-[34rem] bg-neon-cyan/[0.05] blur-3xl pointer-events-none" />

      <div className="relative grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
        {/* Hologram */}
        <div className="lg:col-span-5 flex justify-center lg:justify-start">
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className={`relative ${playing ? "is-speaking" : ""}`}
            data-testid="meetme-avatar-wrap"
          >
            {/* Ping rings while speaking */}
            {playing && (
              <>
                <div className="absolute inset-0 -m-6 border border-neon-lime/40 rounded-sm ping-ring" />
                <div className="absolute inset-0 -m-6 border border-neon-cyan/30 rounded-sm ping-ring" style={{ animationDelay: "0.8s" }} />
              </>
            )}

            {/* Orbiting brackets */}
            <div className="absolute inset-0 -m-10 pointer-events-none orbit-slow">
              <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-neon-lime/60" />
              <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-neon-lime/60" />
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b border-l border-neon-lime/60" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-neon-lime/60" />
            </div>

            {/* Frame */}
            <div className="relative w-[300px] h-[380px] sm:w-[380px] sm:h-[480px] bg-void-700/40 border border-neon-lime/40 overflow-hidden flicker">
              {/* RGB-split layers when speaking */}
              <div className="absolute inset-0 layer-cyan pointer-events-none" style={{ opacity: playing ? 0.55 : 0 }}>
                <img src={PHOTO} alt="" draggable={false} className="w-full h-full object-cover"
                     style={{ filter: "hue-rotate(180deg) saturate(2) contrast(1.1) brightness(0.7)", mixBlendMode: "screen" }} />
              </div>
              <div className="absolute inset-0 layer-magenta pointer-events-none" style={{ opacity: playing ? 0.55 : 0 }}>
                <img src={PHOTO} alt="" draggable={false} className="w-full h-full object-cover"
                     style={{ filter: "hue-rotate(-50deg) saturate(2) contrast(1.1) brightness(0.7)", mixBlendMode: "screen" }} />
              </div>

              {/* Main photo */}
              <img
                src={PHOTO}
                alt={`${PROFILE.name} portrait`}
                draggable={false}
                data-testid="meetme-avatar-img"
                className="absolute inset-0 w-full h-full object-cover"
                style={{ filter: "contrast(1.15) saturate(0.6) brightness(0.95) sepia(0.15) hue-rotate(40deg)" }}
              />

              {/* Lime tint + vignette + scanlines + sweep */}
              <div className="absolute inset-0 mix-blend-color pointer-events-none"
                   style={{ background: "linear-gradient(180deg, rgba(204,255,0,0.35), rgba(0,240,255,0.18))" }} />
              <div className="absolute inset-0 pointer-events-none"
                   style={{ background: "radial-gradient(ellipse at center, transparent 50%, rgba(5,5,5,0.85) 100%)" }} />
              <div className="absolute inset-0 scanlines pointer-events-none" />
              <div className="scan-sweep" />

              {/* Corner brackets */}
              <span className="absolute top-2 left-2 w-4 h-4 border-t border-l border-neon-lime" />
              <span className="absolute top-2 right-2 w-4 h-4 border-t border-r border-neon-lime" />
              <span className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-neon-lime" />
              <span className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-neon-lime" />

              {/* Top HUD */}
              <div className="absolute inset-x-0 top-0 px-3 py-2 flex items-center justify-between font-mono text-[10px] tracking-[0.25em] uppercase z-10 bg-gradient-to-b from-black/80 to-transparent">
                <span className="flex items-center gap-2 text-neon-lime">
                  <span className={`w-1.5 h-1.5 rounded-full bg-neon-lime ${playing ? "animate-pulse" : ""}`} />
                  REC · LIVE
                </span>
                <span className="text-white/50">CHN.AI/v4.0</span>
              </div>

              {/* Bottom HUD with real-audio EQ */}
              <div className="absolute inset-x-0 bottom-0 px-3 pt-3 pb-2 z-10 bg-gradient-to-t from-black/90 to-transparent">
                <div className="flex items-end justify-between mb-2 h-10 gap-[3px]" data-testid="meetme-eq">
                  {Array.from({ length: BAR_COUNT }).map((_, i) => (
                    <span
                      key={i}
                      ref={(el) => (barsRef.current[i] = el)}
                      className="eq-bar"
                      style={{ transformOrigin: "bottom", transition: playing ? "transform 60ms linear" : "transform 250ms ease-out" }}
                    />
                  ))}
                </div>
                <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.25em] uppercase">
                  <span className="text-white/60" data-testid="meetme-status">
                    {playing ? "transmitting…" : "standby"}
                  </span>
                  <span className="text-neon-cyan">{fmtTime(duration * progress)}/{fmtTime(duration)}</span>
                </div>
              </div>
            </div>

            {/* Floating HUD labels (xl screens) */}
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

        {/* Speech / Player */}
        <div className="lg:col-span-7">
          <div className="section-label mb-6">// 01 — Meet Me · Audio Intro</div>
          <h2 className="font-display uppercase tracking-tighter text-white text-3xl sm:text-4xl lg:text-5xl leading-[0.95] mb-8">
            Hit play. <span className="text-neon-lime glow">I&apos;ll introduce myself.</span>
          </h2>

          {/* Player panel */}
          <div className="relative cell p-6 sm:p-8" data-testid="meetme-bubble">
            <div className="hidden lg:block absolute -left-3 top-12 w-3 h-3 border-l border-b border-white/10 bg-void-700 rotate-45" />

            <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 rounded-full bg-neon-danger/70" />
                <span className="w-2 h-2 rounded-full bg-neon-lime/70" />
                <span className="w-2 h-2 rounded-full bg-neon-cyan/70" />
              </div>
              <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/40">~/chandan@portfolio · transmission.mp3</span>
            </div>

            {/* Caption ticker */}
            <div className="font-mono text-base sm:text-lg leading-relaxed text-white/90 min-h-[5em]" data-testid="meetme-caption">
              <span className="text-neon-cyan">chandan@ai </span>
              <span className="text-white/40">~ $ </span>
              <span data-testid="meetme-line">{SCRIPT_LINES[currentLine]}</span>
              <span className={`inline-block w-2 h-5 bg-neon-lime ml-1 -mb-0.5 ${playing ? "" : "animate-pulse"}`} />
            </div>

            {/* Controls */}
            <div className="mt-6 flex items-center gap-4 flex-wrap" data-testid="meetme-controls">
              <button
                onClick={togglePlay}
                data-testid="meetme-play-btn"
                aria-label={playing ? "Pause" : "Play"}
                className="group relative w-14 h-14 border border-neon-lime flex items-center justify-center hover:bg-neon-lime transition-colors"
              >
                {playing ? (
                  <span className="flex gap-1">
                    <span className="w-1 h-5 bg-neon-lime group-hover:bg-black transition-colors" />
                    <span className="w-1 h-5 bg-neon-lime group-hover:bg-black transition-colors" />
                  </span>
                ) : (
                  <span className="w-0 h-0 border-l-[12px] border-l-neon-lime border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent group-hover:border-l-black ml-1" />
                )}
              </button>

              <button
                onClick={handleRestart}
                data-testid="meetme-restart-btn"
                aria-label="Restart"
                className="font-mono text-[11px] tracking-[0.2em] uppercase text-white/60 border border-white/15 px-3 py-2 hover:border-neon-cyan hover:text-neon-cyan transition-colors"
              >
                ↻ Restart
              </button>

              {/* Progress bar */}
              <div
                className="flex-1 min-w-[160px] h-2 bg-white/10 relative cursor-pointer"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  handleSeek((e.clientX - rect.left) / rect.width);
                }}
                data-testid="meetme-progress"
              >
                <div className="absolute inset-y-0 left-0 bg-neon-lime transition-[width] duration-100"
                     style={{ width: `${progress * 100}%` }} />
                <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-neon-cyan border border-black"
                     style={{ left: `calc(${progress * 100}% - 6px)` }} />
              </div>

              <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-white/40">
                Onyx · OpenAI TTS
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
