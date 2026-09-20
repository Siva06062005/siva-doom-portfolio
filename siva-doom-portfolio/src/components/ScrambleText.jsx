import { useState, useEffect, useRef } from "react";
import { useInView } from "framer-motion";

const GLYPHS = "!<>-_\\/[]{}—=+*^?#________010101XYZ@#$";

export default function ScrambleText({ text, duration = 650, delay = 100, className = "" }) {
  const [displayText, setDisplayText] = useState(text);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  useEffect(() => {
    if (!isInView || !text) return;

    let frame = 0;
    const totalFrames = Math.floor(duration / 30);
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        frame++;
        const progress = frame / totalFrames;
        const revealedChars = Math.floor(progress * text.length);

        const scrambled = text
          .split("")
          .map((char, index) => {
            if (char === " " || char === "/" || char === "&" || char === "-") return char;
            if (index < revealedChars) return text[index];
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join("");

        setDisplayText(scrambled);

        if (frame >= totalFrames) {
          setDisplayText(text);
          clearInterval(interval);
        }
      }, 30);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timeout);
  }, [isInView, text, duration, delay]);

  return (
    <span ref={ref} className={`scramble-text ${className}`}>
      {displayText}
    </span>
  );
}
