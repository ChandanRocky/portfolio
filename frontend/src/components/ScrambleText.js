import { useEffect, useRef, useState } from "react";

const CHARS = "!<>-_\\/[]{}—=+*^?#________";

/**
 * Lightweight text scramble — letters cycle through random chars before
 * settling on the final character. Triggers when element enters view.
 */
export default function ScrambleText({ text, className = "", as = "span", testId }) {
  const ref = useRef(null);
  const [display, setDisplay] = useState(text);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!ref.current || started) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setStarted(true);
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const old = display;
    const target = text;
    const length = Math.max(old.length, target.length);
    const queue = [];
    for (let i = 0; i < length; i++) {
      const from = old[i] || "";
      const to = target[i] || "";
      const start = Math.floor(Math.random() * 12);
      const end = start + Math.floor(Math.random() * 24) + 8;
      queue.push({ from, to, start, end, char: "" });
    }
    let frame = 0;
    let raf;
    const update = () => {
      let output = "";
      let complete = 0;
      for (let i = 0; i < queue.length; i++) {
        const { from, to, start, end } = queue[i];
        let { char } = queue[i];
        if (frame >= end) {
          complete++;
          output += to;
        } else if (frame >= start) {
          if (!char || Math.random() < 0.28) {
            char = CHARS[Math.floor(Math.random() * CHARS.length)];
            queue[i].char = char;
          }
          output += char;
        } else {
          output += from;
        }
      }
      setDisplay(output);
      if (complete < queue.length) {
        frame++;
        raf = requestAnimationFrame(update);
      }
    };
    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, text]);

  const Tag = as;
  return (
    <Tag ref={ref} className={className} data-testid={testId}>
      {display}
    </Tag>
  );
}
