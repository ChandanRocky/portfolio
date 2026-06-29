import { motion } from "framer-motion";
import { SKILL_GROUPS } from "@/data/portfolio";

export default function Skills() {
  return (
    <section id="skills" className="relative py-32 lg:py-48 px-6 sm:px-12 lg:px-24 border-t border-white/5" data-testid="skills-section">
      <div className="mb-16 flex items-end justify-between flex-wrap gap-6">
        <div>
          <div className="section-label mb-6">// 02 — Technical Arsenal</div>
          <h2 className="font-display uppercase tracking-tighter text-white text-4xl sm:text-5xl lg:text-6xl leading-[0.95]">
            Skills <span className="text-neon-lime">that</span> ship.
          </h2>
          <p className="mt-4 font-mono text-sm text-white/50">AI-first stack — engineered for the LLM era.</p>
        </div>
        <div className="font-mono text-xs tracking-[0.3em] uppercase text-white/40">
          {"< stack.dump() >"}
        </div>
      </div>

      <div className="space-y-16">
        {SKILL_GROUPS.map((group, gi) => (
          <div key={group.domain} data-testid={`skill-group-${gi}`}>
            <div className="flex items-center gap-4 mb-8">
              <span className="text-neon-lime font-mono">▣</span>
              <h3 className="font-display uppercase tracking-wider text-white text-xl sm:text-2xl">{group.domain}</h3>
              <span className="flex-1 h-px bg-white/10" />
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {group.categories.map((cat, ci) => (
                <motion.div
                  key={cat.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.6, delay: ci * 0.06, ease: [0.16, 1, 0.3, 1] }}
                  className="cell p-5 group hover:bg-neon-lime/[0.04]"
                  data-cursor="hover"
                  data-testid={`skill-card-${cat.name.replace(/\s+/g, '-').toLowerCase()}`}
                >
                  {/* terminal header */}
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
                    <div className="flex gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-neon-danger/70" />
                      <span className="w-2 h-2 rounded-full bg-neon-lime/70" />
                      <span className="w-2 h-2 rounded-full bg-neon-cyan/70" />
                    </div>
                    <span className="font-mono text-[10px] text-white/40 tracking-[0.2em] uppercase">~/{cat.name.split(" ")[0].toLowerCase()}</span>
                  </div>

                  <div className="font-display uppercase text-white text-sm tracking-wider mb-4 group-hover:text-neon-lime transition-colors">
                    {cat.name}
                  </div>

                  <ul className="space-y-2">
                    {cat.items.map((item) => (
                      <li key={item} className="font-mono text-xs text-white/70 flex items-start gap-2 hover:text-neon-lime transition-colors">
                        <span className="text-neon-lime/60 mt-0.5">›</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
