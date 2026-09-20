import { useRef, useState } from "react";
import { motion } from "framer-motion";

export default function MagneticButton({ children, strength = 0.3, className = "", ...props }) {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const isTouchDevice = typeof window !== "undefined" && "ontouchstart" in window;

  const handleMouseMove = (e) => {
    if (isTouchDevice) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    setPosition({
      x: (e.clientX - centerX) * strength,
      y: (e.clientY - centerY) * strength,
    });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      className={`magnetic-wrap ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 350, damping: 15, mass: 0.2 }}
      style={{ display: "inline-block" }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
