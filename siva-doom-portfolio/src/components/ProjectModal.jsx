import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Layers, Cpu, Activity, ExternalLink, Github, ShieldCheck } from "lucide-react";
import { profile } from "../data/portfolio";
import { sfx } from "../utils/sfx";

const sectionVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};

const sectionItemVariant = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
};

export default function ProjectModal({ project, onClose }) {
  const [imgErr, setImgErr] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        sfx.playClick();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="modal-backdrop"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="modal-container panel"
            initial={{ opacity: 0, scale: 0.88, y: 35, rotateX: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 25 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            {/* Header */}
            <motion.div
              className="modal-header"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.4 }}
            >
              <div>
                <span className="eyebrow" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <ShieldCheck size={14} /> CLASSIFIED OP // {project.year}
                </span>
                <h2 id="modal-title">{project.title}</h2>
              </div>
              <motion.button
                className="modal-close-btn"
                onClick={() => {
                  sfx.playClick();
                  onClose();
                }}
                aria-label="Close modal"
                whileHover={{ rotate: 90, scale: 1.1, borderColor: "var(--accent-secondary)" }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <X size={20} />
              </motion.button>
            </motion.div>

            {/* Body — staggered sections */}
            <motion.div
              className="modal-body"
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div className="modal-image-wrap" variants={sectionItemVariant}>
                <img
                  src={imgErr ? "/images/hero-placeholder.svg" : project.image}
                  alt={`${project.title} preview`}
                  onError={() => setImgErr(true)}
                />
                <div className="scanline" />
              </motion.div>

              {Boolean(project.liveUrl && project.liveUrl.trim() !== "") && (
                <motion.div className="modal-section live-url-banner" variants={sectionItemVariant}>
                  <span className="eyebrow" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <ExternalLink size={14} /> ACTIVE PROJECT LINK // PRODUCTION DEPLOYMENT
                  </span>
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="live-url-box"
                    onClick={() => sfx.playClick()}
                  >
                    <span className="live-url-text">{project.liveUrl}</span>
                    <span className="live-url-pill">LAUNCH BUILD ↗</span>
                  </a>
                </motion.div>
              )}

              <motion.div className="modal-section" variants={sectionItemVariant}>
                <span className="eyebrow"><Layers size={14} /> DESCRIPTION</span>
                <p>{project.description}</p>
              </motion.div>

              {project.architecture && (
                <motion.div className="modal-section" variants={sectionItemVariant}>
                  <span className="eyebrow"><Cpu size={14} /> SYSTEM ARCHITECTURE</span>
                  <div className="architecture-box">
                    <code>{project.architecture}</code>
                  </div>
                </motion.div>
              )}

              {project.metrics && (
                <motion.div className="modal-section" variants={sectionItemVariant}>
                  <span className="eyebrow"><Activity size={14} /> PERFORMANCE METRICS</span>
                  <div className="modal-metrics-grid">
                    {project.metrics.map((m, i) => (
                      <motion.div
                        className="modal-metric-card"
                        key={m.label}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 + i * 0.07, type: "spring", stiffness: 300 }}
                      >
                        <span className="metric-val">{m.value}</span>
                        <span className="metric-lbl">{m.label}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {project.highlights && (
                <motion.div className="modal-section" variants={sectionItemVariant}>
                  <span className="eyebrow">KEY HIGHLIGHTS & WINS</span>
                  <ul className="modal-highlights-list">
                    {project.highlights.map((h, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.25 + i * 0.06 }}
                      >
                        {h}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}

              <motion.div className="modal-section" variants={sectionItemVariant}>
                <span className="eyebrow">STACK SPECIFICATION</span>
                <div className="chips">
                  {project.stack.map((s, si) => (
                    <motion.span
                      className="chip"
                      key={s}
                      initial={{ opacity: 0, scale: 0.7 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + si * 0.04, type: "spring", stiffness: 400 }}
                    >
                      {s}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            {/* Footer Actions */}
            <motion.div
              className="modal-footer"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              {project.githubUrl && !project.githubUrl.startsWith("REPLACE_WITH") && project.githubUrl !== "#" ? (
                <motion.a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                  onClick={() => sfx.playClick()}
                  whileHover={{ y: -2, scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Github size={16} /> Repository
                </motion.a>
              ) : (
                <motion.a
                  href={profile.socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                  onClick={() => sfx.playClick()}
                  whileHover={{ y: -2, scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Github size={16} /> GitHub Profile
                </motion.a>
              )}

              {Boolean(project.liveUrl && project.liveUrl.trim() !== "") && (
                <motion.a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  onClick={() => sfx.playClick()}
                  whileHover={{ y: -2, scale: 1.03, boxShadow: "0 0 35px rgba(57,230,139,0.4)" }}
                  whileTap={{ scale: 0.97 }}
                >
                  <ExternalLink size={16} /> Launch Live Build ↗
                </motion.a>
              )}

              <motion.a
                href={profile.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                onClick={() => sfx.playClick()}
                whileHover={{ y: -2, scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <ExternalLink size={16} /> Contact Operator
              </motion.a>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
