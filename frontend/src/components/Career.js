import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EXPERIENCE, CERTIFICATIONS, EDUCATION, AWARDS, CERT_HIGHLIGHTS } from "@/data/portfolio";
import { ExternalLink, Download, X, Award, Eye, Sparkles } from "lucide-react";

export default function Career() {
  const [selectedCert, setSelectedCert] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", "Anthropic", "Databricks", "Google Cloud", "Oracle Cloud"];

  const filteredCerts = CERTIFICATIONS.filter((c) => {
    if (activeCategory === "All") return true;
    const cat = typeof c === "object" ? c.category || c.issuer : "";
    return cat === activeCategory;
  });

  const getSrc = (c) => (typeof c === "string" ? c : c.src);
  const getTitle = (c) => (typeof c === "object" ? c.title : "Professional Certification");
  const getIssuer = (c) => (typeof c === "object" ? c.issuer : "Cloud & AI");

  return (
    <section id="career" className="relative py-32 lg:py-48 border-t border-white/5" data-testid="career-section">
      {/* Certifications Header & Filters */}
      <div className="px-6 sm:px-12 lg:px-24 mb-12">
        <div className="section-label mb-6">// 05 — Certifications</div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="font-display uppercase tracking-tighter text-white text-4xl sm:text-5xl lg:text-6xl leading-[0.95]">
              Certified across <span className="text-neon-lime glow">13 Credentials.</span>
            </h2>
            <p className="mt-3 font-mono text-sm text-white/60 max-w-xl">
              Anthropic Certified Architect & Practitioner · Databricks Professional · Google Cloud Data Engineer · OCI GenAI
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2" data-testid="cert-categories">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`font-mono text-xs uppercase tracking-wider px-3.5 py-1.5 transition-all duration-300 border ${
                  activeCategory === cat
                    ? "border-neon-lime bg-neon-lime/10 text-neon-lime shadow-[0_0_15px_rgba(204,255,0,0.15)]"
                    : "border-white/10 text-white/60 hover:text-white hover:border-white/30 bg-void-800/50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Certifications marquee */}
      <div className="relative overflow-hidden border-y border-white/10 py-8 bg-void-700/20" data-testid="certs-marquee">
        <div className="marquee-track gap-6">
          {[...filteredCerts, ...filteredCerts, ...filteredCerts].map((item, idx) => {
            const src = getSrc(item);
            const title = getTitle(item);
            const issuer = getIssuer(item);
            const certIndex = (idx % filteredCerts.length) + 1;

            return (
              <div
                key={idx}
                onClick={() => setSelectedCert(item)}
                className="shrink-0 w-[280px] sm:w-[360px] h-[180px] sm:h-[220px] border border-white/10 bg-void-800 hover:border-neon-lime transition-all duration-300 overflow-hidden relative group cursor-pointer"
                data-cursor="hover"
                title={`Click to view ${title}`}
              >
                <img
                  src={src}
                  alt={title}
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                  loading="lazy"
                />
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-void-950 via-void-950/40 to-transparent opacity-70 group-hover:opacity-90 transition-opacity" />

                {/* Top Badge */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className="font-mono text-[9px] tracking-[0.2em] uppercase px-2 py-0.5 bg-void-900/90 border border-white/10 text-white/80 backdrop-blur-md">
                    {issuer}
                  </span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity text-neon-lime bg-void-900/90 p-1 rounded border border-neon-lime/30">
                    <Eye size={14} />
                  </span>
                </div>

                {/* Bottom Title & Label */}
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-neon-lime/80 mb-1">
                    CERT_{String(certIndex).padStart(2, "0")}
                  </div>
                  <h4 className="font-display text-sm uppercase text-white truncate leading-tight group-hover:text-neon-lime transition-colors">
                    {title}
                  </h4>
                </div>
              </div>
            );
          })}
        </div>
        {/* edge fades */}
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-void-900 to-transparent pointer-events-none z-10" />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-void-900 to-transparent pointer-events-none z-10" />
      </div>

      {/* Certificate Preview Modal */}
      <AnimatePresence>
        {selectedCert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCert(null)}
            className="fixed inset-0 z-50 bg-void-950/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-void-900 border border-white/15 max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col relative shadow-[0_0_50px_rgba(0,0,0,0.8)]"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-white/10 flex items-center justify-between bg-void-900/80">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded bg-neon-lime/10 border border-neon-lime/30 flex items-center justify-center text-neon-lime">
                    <Award size={20} />
                  </div>
                  <div>
                    <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-neon-lime">
                      {getIssuer(selectedCert)} {selectedCert.date ? `· ${selectedCert.date}` : ""}
                    </span>
                    <h3 className="font-display text-lg sm:text-xl uppercase text-white leading-tight">
                      {getTitle(selectedCert)}
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedCert(null)}
                  className="p-2 border border-white/10 hover:border-neon-lime text-white/70 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Image View */}
              <div className="p-6 overflow-auto max-h-[60vh] flex items-center justify-center bg-void-950/60">
                <img
                  src={getSrc(selectedCert)}
                  alt={getTitle(selectedCert)}
                  className="max-h-[50vh] max-w-full object-contain border border-white/10 shadow-2xl"
                />
              </div>

              {/* Modal Footer Actions */}
              <div className="p-6 border-t border-white/10 bg-void-900 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs font-mono text-white/60">
                  <Sparkles size={14} className="text-neon-lime" />
                  <span>Verified Credential Certificate</span>
                </div>

                <div className="flex items-center gap-3">
                  {selectedCert.credentialUrl && (
                    <a
                      href={selectedCert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-xs uppercase tracking-wider px-4 py-2 bg-neon-lime/10 border border-neon-lime/40 text-neon-lime hover:bg-neon-lime hover:text-void-950 transition-colors flex items-center gap-2"
                    >
                      <ExternalLink size={14} />
                      Verify Credential
                    </a>
                  )}

                  {selectedCert.pdf && (
                    <a
                      href={selectedCert.pdf}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-xs uppercase tracking-wider px-4 py-2 border border-white/20 text-white hover:border-neon-lime hover:text-neon-lime transition-colors flex items-center gap-2"
                    >
                      <Download size={14} />
                      Open PDF
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
