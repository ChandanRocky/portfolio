import { motion } from "framer-motion";
import { PROFILE } from "@/data/portfolio";

const CONTACTS = [
  { label: "LinkedIn", value: "chandan-gowda", href: PROFILE.linkedin, testid: "contact-linkedin" },
  { label: "Email · Fastest Reply", value: PROFILE.email, href: `mailto:${PROFILE.email}`, testid: "contact-email" },
  { label: "Phone · India", value: PROFILE.phone, href: `tel:${PROFILE.phone.replace(/\s+/g, "")}`, testid: "contact-phone" },
];

export default function Contact() {
  return (
    <section id="contact" className="relative py-32 lg:py-48 px-6 sm:px-12 lg:px-24 border-t border-white/5 overflow-hidden" data-testid="contact-section">
      {/* big background mark */}
      <div className="absolute -bottom-24 left-0 right-0 font-display font-black uppercase text-[24vw] leading-none text-white/[0.03] select-none pointer-events-none whitespace-nowrap">
        LET&apos;S BUILD
      </div>

      <div className="relative">
        <div className="section-label mb-6">// 06 — Contact</div>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="font-display uppercase tracking-tighter text-white text-5xl sm:text-7xl lg:text-8xl leading-[0.9] max-w-5xl"
          data-testid="contact-headline"
        >
          Ready to build<br/>
          something<br/>
          <span className="text-neon-lime glow">intelligent?</span>
        </motion.h2>

        <p className="mt-8 max-w-2xl font-mono text-sm text-white/60 leading-relaxed">
          Open to full-time GenAI, Data Engineering & AI-focused roles. Always up for interesting projects.
        </p>

        <div className="mt-10 flex flex-wrap gap-2" data-testid="contact-tags">
          {PROFILE.focusTags.map((t) => (
            <span key={t} className="tag">{t}</span>
          ))}
        </div>

        <div className="mt-16 grid md:grid-cols-3 gap-3 sm:gap-4" data-testid="contact-cards">
          {CONTACTS.map((c, i) => (
            <motion.a
              key={c.label}
              href={c.href}
              target={c.label === "LinkedIn" ? "_blank" : undefined}
              rel="noopener noreferrer"
              data-testid={c.testid}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="cell cell-corner p-6 group flex flex-col justify-between min-h-[180px]"
              data-cursor="hover"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/40">/{String(i + 1).padStart(2, "0")}</span>
                <span className="font-mono text-white/30 group-hover:text-neon-lime group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform">↗</span>
              </div>
              <div>
                <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-neon-lime/80 mb-2">{c.label}</div>
                <div className="font-display uppercase tracking-tight text-white text-lg sm:text-xl break-all group-hover:text-neon-lime transition-colors">
                  {c.value}
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        {/* Footer line */}
        <div className="mt-24 pt-8 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 font-mono text-[11px] tracking-[0.3em] uppercase text-white/40">
          <span>© {new Date().getFullYear()} Chandan Gowda AH</span>
          <span>// Engineered with caffeine + curiosity</span>
          <span>v4.0 // {PROFILE.location}</span>
        </div>
      </div>
    </section>
  );
}
