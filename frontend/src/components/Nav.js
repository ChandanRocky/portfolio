import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NAV_LINKS, PROFILE } from "@/data/portfolio";

function LiveClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const time = now.toLocaleTimeString("en-IN", { hour12: false, timeZone: "Asia/Kolkata" });
  return (
    <span className="hidden lg:inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.25em] uppercase text-white/40">
      <span className="w-1 h-1 rounded-full bg-neon-lime animate-pulse" />
      IN · {time}
    </span>
  );
}

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        className={`fixed top-0 inset-x-0 z-50 transition-colors duration-500 ${
          scrolled ? "bg-void-900/70 backdrop-blur-xl border-b border-white/10" : "bg-transparent"
        }`}
        data-testid="site-nav"
      >
        <div className="px-6 sm:px-12 lg:px-24 h-16 sm:h-20 flex items-center justify-between">
          <a href="#top" data-testid="nav-logo" className="font-display text-sm sm:text-base tracking-[0.25em] uppercase text-white hover:text-neon-lime transition-colors">
            CHANDAN<span className="text-neon-lime">.</span>GOWDA
          </a>

          <nav className="hidden md:flex items-center gap-10">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                data-testid={`nav-link-${l.label.toLowerCase()}`}
                className="font-mono text-xs tracking-[0.2em] uppercase text-white/70 hover:text-neon-lime transition-colors relative group"
              >
                <span className="text-neon-lime/70 mr-1">/</span>{l.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-neon-lime group-hover:w-full transition-all duration-500" />
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <LiveClock />
            <a
              href={`mailto:${PROFILE.email}`}
              data-testid="nav-cta-email"
              className="inline-flex items-center gap-2 font-mono text-xs tracking-[0.2em] uppercase text-neon-lime border border-neon-lime/60 px-4 py-2 hover:bg-neon-lime hover:text-black transition-colors"
            >
              <span className="pulse-dot" /> Available
            </a>
          </div>

          <button
            data-testid="nav-mobile-toggle"
            className="md:hidden text-white"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            <div className="w-7 flex flex-col gap-1.5">
              <span className={`h-px bg-white transition-transform ${open ? "rotate-45 translate-y-1.5" : ""}`} />
              <span className={`h-px bg-white transition-opacity ${open ? "opacity-0" : ""}`} />
              <span className={`h-px bg-white transition-transform ${open ? "-rotate-45 -translate-y-1.5" : ""}`} />
            </div>
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-x-0 top-16 z-40 bg-void-900/95 backdrop-blur-xl border-b border-white/10 md:hidden"
            data-testid="mobile-menu"
          >
            <div className="px-6 py-8 flex flex-col gap-6">
              {NAV_LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  data-testid={`mobile-nav-link-${l.label.toLowerCase()}`}
                  className="font-display text-2xl uppercase tracking-tight text-white hover:text-neon-lime"
                >
                  {l.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
