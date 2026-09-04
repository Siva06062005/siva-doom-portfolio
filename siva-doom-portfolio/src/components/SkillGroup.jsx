import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

export default function SkillGroup({ group, index }) {
  const { theme } = useTheme();

  return (
    <motion.article
      className="panel skill-group"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay: index * 0.05 }}
    >
      <div className="panel-line" />
      <h3>
        {theme === "doom" ? `> ${group.title}` : group.title}
      </h3>
      <div className="chips">
        {group.items.map((item) => (
          <span className="chip" key={item}>
            {item}
          </span>
        ))}
      </div>
    </motion.article>
  );
}