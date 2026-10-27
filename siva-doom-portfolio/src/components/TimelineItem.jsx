import { motion } from "framer-motion";
import { ExternalLink, ShieldCheck } from "lucide-react";

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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px", margin: "4px 0 16px" }}>
          <h4 style={{ color: "var(--accent-secondary)", margin: 0 }}>
            {item.link ? (
              <a
                href={item.link}
                target="_blank"
                rel="noreferrer"
                style={{
                  color: "var(--accent-secondary)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  textDecoration: "underline",
                  textUnderlineOffset: "4px"
                }}
                title={`Verify experience credentials for ${item.company}`}
              >
                {item.company}
                <ExternalLink size={13} />
              </a>
            ) : (
              item.company
            )}
          </h4>

          {item.link && (
            <motion.a
              href={item.link}
              target="_blank"
              rel="noreferrer"
              className="timeline-cred-badge"
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.97 }}
              title="View Official Experience Letter / Certificate on Google Drive"
            >
              <ShieldCheck size={13} />
              <span>EXPERIENCE LETTER</span>
              <ExternalLink size={11} />
            </motion.a>
          )}
        </div>
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