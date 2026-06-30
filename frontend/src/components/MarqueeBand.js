/**
 * Horizontal infinite-scrolling marquee band with bold typography.
 * Used between sections as a visual punctuation.
 */
export default function MarqueeBand({
  items,
  speedSec = 32,
  direction = "left",
  accent = "lime",
  variant = "solid",
}) {
  const repeated = [...items, ...items, ...items];
  const accentClass = accent === "cyan" ? "text-neon-cyan" : "text-neon-lime";
  const bg = variant === "solid"
    ? "bg-neon-lime text-black"
    : "bg-transparent text-white border-y border-white/10";

  if (variant === "solid") {
    return (
      <div className="relative overflow-hidden py-4 sm:py-5 bg-neon-lime select-none">
        <div
          className="marquee-track gap-12 font-display uppercase tracking-tighter text-black text-2xl sm:text-3xl lg:text-4xl"
          style={{ animationDuration: `${speedSec}s`, animationDirection: direction === "right" ? "reverse" : "normal" }}
        >
          {repeated.map((t, i) => (
            <span key={i} className="flex items-center gap-12 whitespace-nowrap">
              {t}
              <span className="inline-block w-3 h-3 bg-black rotate-45" />
            </span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden py-4 sm:py-5 ${bg} select-none`}>
      <div
        className="marquee-track gap-10 font-display uppercase tracking-tighter text-2xl sm:text-3xl lg:text-4xl"
        style={{ animationDuration: `${speedSec}s`, animationDirection: direction === "right" ? "reverse" : "normal" }}
      >
        {repeated.map((t, i) => (
          <span key={i} className="flex items-center gap-10 whitespace-nowrap">
            <span className="text-white">{t}</span>
            <span className={`text-2xl ${accentClass}`}>★</span>
          </span>
        ))}
      </div>
    </div>
  );
}
