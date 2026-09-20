import { motion } from "framer-motion";

export default function TimelineItem({ item, index }) {
  return (
    <motion.article
      className="timeline-item"
      initial={{ opacity: 0, x: index % 2 ? 30 : -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: index * 0.1 }}
    >
      {/* Animated glowing dot */}
      <motion.div
        className="timeline-dot"
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 + index * 0.1, type: "spring", stiffness: 500, damping: 20 }}
      />

      <motion.div
        className="panel timeline-card"
        style={{ position: "relative" }}
        whileHover={{
          y: -4,
          boxShadow: "0 20px 60px rgba(57, 230, 139, 0.12)",
          borderColor: "rgba(57, 230, 139, 0.35)",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        <div className="hud-corner hud-tl" />
        <div className="hud-corner hud-tr" />
        <div className="timeline-top">
          <motion.span
            className="eyebrow"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 + index * 0.1 }}
          >
            {item.period}
          </motion.span>
          <span className="muted">// {item.mode}</span>
        </div>
        <h3>{item.role}</h3>
        <h4 style={{ color: "var(--accent-secondary)" }}>{item.company}</h4>
        <motion.ul
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } },
          }}
        >
          {item.bullets.map((b) => (
            <motion.li
              key={b}
              variants={{
                hidden: { opacity: 0, x: -10 },
                visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
              }}
            >
              {b}
            </motion.li>
          ))}
        </motion.ul>
      </motion.div>
    </motion.article>
  );
}