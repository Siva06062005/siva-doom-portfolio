import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

export default function PageShell({ eyebrow, title, intro, children }) {
  const { theme } = useTheme();

  return (
    <motion.div
      className="page"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <section className="page-head container">
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        {intro && <p>{intro}</p>}
        {theme === "ironman" && (
          <div className="status" style={{ marginTop: 16 }}>
            <span /> ARC REACTOR ONLINE
          </div>
        )}
        {theme === "doom" && (
          <div className="status" style={{ marginTop: 16 }}>
            <span /> TERMINAL ACTIVE
          </div>
        )}
      </section>
      {children}
    </motion.div>
  );
}