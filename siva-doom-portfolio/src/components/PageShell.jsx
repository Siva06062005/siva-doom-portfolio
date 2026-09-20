import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import ScrambleText from "./ScrambleText";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

const eyebrowVariant = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

const titleVariant = {
  hidden: { opacity: 0, y: 25, skewX: -2 },
  visible: { opacity: 1, y: 0, skewX: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

const introVariant = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
};

const pageVariant = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

export default function PageShell({ eyebrow, title, intro, children }) {
  const { theme } = useTheme();

  return (
    <div className="page">
      <section className="page-head container">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          <motion.span className="eyebrow" variants={eyebrowVariant}>
            {eyebrow}
          </motion.span>
          <motion.h1 variants={titleVariant}>
            <ScrambleText text={title} />
          </motion.h1>
          {intro && (
            <motion.p variants={introVariant}>{intro}</motion.p>
          )}
          {theme === "ironman" && (
            <motion.div className="status" style={{ marginTop: 16 }} variants={introVariant}>
              <span /> ARC REACTOR ONLINE
            </motion.div>
          )}
          {theme === "doom" && (
            <motion.div className="status" style={{ marginTop: 16 }} variants={introVariant}>
              <span /> TERMINAL ACTIVE
            </motion.div>
          )}
        </motion.div>
      </section>
      {children}
    </div>
  );
}