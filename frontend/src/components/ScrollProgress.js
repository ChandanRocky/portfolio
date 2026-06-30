import { useEffect, useState } from "react";

export default function ScrollProgress() {
  const [p, setP] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const total = h.scrollHeight - h.clientHeight;
      setP(total > 0 ? Math.min(h.scrollTop / total, 1) : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      aria-hidden
      className="fixed top-0 left-0 right-0 h-[2px] z-[60] pointer-events-none"
      data-testid="scroll-progress"
    >
      <div
        className="h-full bg-neon-lime"
        style={{ width: `${p * 100}%`, boxShadow: "0 0 12px rgba(204,255,0,0.6)" }}
      />
    </div>
  );
}
