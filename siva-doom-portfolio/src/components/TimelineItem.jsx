import { motion } from "framer-motion";

export default function TimelineItem({ item, index }) {
  return (
    <motion.article
      className="timeline-item"
      initial={{ opacity: 0, x: index % 2 ? 18 : -18 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.15 }}
    >
      <div className="timeline-dot" />
      <div className="panel timeline-card" style={{ position: "relative" }}>
        <div className="hud-corner hud-tl" />
        <div className="hud-corner hud-tr" />
        <div className="timeline-top">
          <span className="eyebrow">{item.period}</span>
          <span className="muted">// {item.mode}</span>
        </div>
        <h3>{item.role}</h3>
        <h4 style={{ color: "var(--accent-secondary)" }}>{item.company}</h4>
        <ul>
          {item.bullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
      </div>
    </motion.article>
  );
}