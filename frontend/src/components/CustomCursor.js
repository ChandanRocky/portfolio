import { useEffect, useRef, useState } from "react";

/**
 * Custom neon cursor – two layers: a dot and a trailing ring.
 * Hides on touch devices via CSS.
 */
export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;
    let raf;

    const onMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
      }
    };

    const loop = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringX - 18}px, ${ringY - 18}px)`;
      }
      raf = requestAnimationFrame(loop);
    };

    const onOver = (e) => {
      const t = e.target;
      if (t.closest('a, button, [data-cursor="hover"]')) setHover(true);
    };
    const onOut = (e) => {
      const t = e.target;
      if (t.closest('a, button, [data-cursor="hover"]')) setHover(false);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    window.addEventListener("mouseout", onOut);
    loop();

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mouseout", onOut);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className={`custom-cursor ${hover ? "is-hover" : ""}`} />
      <div ref={ringRef} className="custom-cursor-ring" />
    </>
  );
}
