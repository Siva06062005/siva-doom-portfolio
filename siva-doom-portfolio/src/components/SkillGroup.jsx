import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

const chipContainerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.15 } },
};

const chipVariant = {
  hidden: { opacity: 0, scale: 0.6, y: 8 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 400, damping: 20 },
  },
};

export default function SkillGroup({ group, index }) {
  const { theme } = useTheme();

  return (
    <motion.article
      className="panel skill-group"
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ delay: index * 0.06, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{
        y: -4,
        boxShadow: "0 16px 50px rgba(57, 230, 139, 0.1)",
        borderColor: "rgba(57, 230, 139, 0.32)",
      }}
      layout
      exit={{ opacity: 0, scale: 0.9, y: -15 }}
    >
      {/* Animated panel line: grows from 0 to full width */}
      <motion.div
        className="panel-line"
        initial={{ width: 0 }}
        whileInView={{ width: "55px" }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 + index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      />

      <h3>
        {theme === "doom" ? `> ${group.title}` : group.title}
      </h3>

      <motion.div
        className="chips"
        variants={chipContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {group.items.map((item) => (
          <motion.span
            className="chip"
            key={item}
            variants={chipVariant}
            whileHover={{ scale: 1.1, y: -2 }}
          >
            {item}
          </motion.span>
        ))}
      </motion.div>
    </motion.article>
  );
}