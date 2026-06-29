import { motion } from "framer-motion";
import { EXPERIENCE, CERTIFICATIONS, EDUCATION, AWARDS, CERT_HIGHLIGHTS } from "@/data/portfolio";

export default function Career() {
  return (
    <section id="career" className="relative py-32 lg:py-48 border-t border-white/5" data-testid="career-section">
      {/* Certifications marquee */}
      <div className="px-6 sm:px-12 lg:px-24 mb-24">
        <div className="section-label mb-6">// 05 — Certifications</div>
        <h2 className="font-display uppercase tracking-tighter text-white text-4xl sm:text-5xl lg:text-6xl leading-[0.95]">
          Certified across <span className="text-neon-lime glow">4 clouds.</span>
        </h2>
      </div>

      <div className="relative overflow-hidden border-y border-white/10 py-8 bg-void-700/20" data-testid="certs-marquee">
        <div className="marquee-track gap-6">
          {[...CERTIFICATIONS, ...CERTIFICATIONS].map((src, idx) => (
            <div
              key={idx}
              className="shrink-0 w-[280px] sm:w-[360px] h-[180px] sm:h-[220px] border border-white/10 bg-void-800 hover:border-neon-lime transition-colors overflow-hidden relative group"
              data-cursor="hover"
            >
              <img
                src={src}
                alt={`Certificate ${(idx % CERTIFICATIONS.length) + 1}`}
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                loading="lazy"
              />
              <div className="absolute bottom-2 left-3 font-mono text-[10px] tracking-[0.3em] uppercase text-neon-lime/80">
                CERT_{String((idx % CERTIFICATIONS.length) + 1).padStart(2, "0")}
              </div>
            </div>
          ))}
        </div>
        {/* edge fades */}
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-void-900 to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-void-900 to-transparent pointer-events-none" />
      </div>

      {/* Experience Timeline */}
      <div className="px-6 sm:px-12 lg:px-24 mt-32">
        <div className="section-label mb-6">// 06 — Career Log</div>
        <h2 className="font-display uppercase tracking-tighter text-white text-4xl sm:text-5xl lg:text-6xl leading-[0.95] mb-16">
          Where I&apos;ve <span className="text-neon-lime glow">shipped.</span>
        </h2>

        <div className="relative pl-8 sm:pl-16 max-w-4xl">
          {/* glowing vertical line */}
          <div className="absolute left-2 sm:left-6 top-2 bottom-2 w-px glow-line" />

          {EXPERIENCE.map((job, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="relative pb-16 last:pb-0"
              data-testid={`experience-${i}`}
            >
              {/* node */}
              <span className="absolute -left-[26px] sm:-left-[42px] top-2 w-4 h-4 border border-neon-lime bg-void-900 flex items-center justify-center">
                <span className="w-1.5 h-1.5 bg-neon-lime animate-pulse" />
              </span>

              <div className="font-mono text-[11px] tracking-[0.3em] uppercase text-neon-lime mb-2">{job.period}</div>
              <h3 className="font-display uppercase tracking-tight text-white text-2xl sm:text-3xl">{job.role}</h3>
              <div className="mt-1 font-mono text-sm text-white/60">
                {job.company} · <span className="text-white/40">{job.location}</span>
              </div>

              <ul className="mt-6 space-y-3">
                {job.points.map((pt, pi) => (
                  <li key={pi} className="font-mono text-sm text-white/70 flex items-start gap-3 leading-relaxed">
                    <span className="text-neon-cyan mt-1">▸</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Education + Awards bento */}
        <div className="mt-24 grid lg:grid-cols-12 gap-3 sm:gap-4" data-testid="edu-awards">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="cell cell-corner p-6 lg:col-span-5"
            data-testid="education-card"
          >
            <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-neon-lime/80 mb-4">
              // Education
            </div>
            <h3 className="font-display uppercase tracking-tight text-white text-xl sm:text-2xl leading-tight">
              {EDUCATION.degree}
            </h3>
            <div className="mt-3 font-mono text-sm text-white/70">
              {EDUCATION.institution}
            </div>
            <div className="mt-1 font-mono text-xs text-white/40 tracking-[0.2em] uppercase">
              {EDUCATION.period}
            </div>
            <div className="mt-6 pt-6 border-t border-white/10">
              <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/40 mb-3">Top certifications</div>
              <ul className="space-y-2">
                {CERT_HIGHLIGHTS.map((c) => (
                  <li key={c} className="font-mono text-xs text-white/70 flex items-start gap-2">
                    <span className="text-neon-cyan mt-0.5">◆</span><span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="cell cell-corner p-6 lg:col-span-7"
            data-testid="awards-card"
          >
            <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-neon-lime/80 mb-4">
              // Awards & Recognition
            </div>
            <h3 className="font-display uppercase tracking-tight text-white text-xl sm:text-2xl leading-tight mb-6">
              Earning the <span className="text-neon-lime">spotlight.</span>
            </h3>
            <ul className="space-y-4">
              {AWARDS.map((a, i) => (
                <li key={i} className="font-mono text-sm text-white/75 flex items-start gap-4 leading-relaxed">
                  <span className="font-display text-neon-lime text-base shrink-0">★ {String(i + 1).padStart(2, "0")}</span>
                  <span>{a}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
