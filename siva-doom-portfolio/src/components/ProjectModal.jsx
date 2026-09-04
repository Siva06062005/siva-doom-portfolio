import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Layers, Cpu, Activity, ExternalLink, Github, ShieldCheck } from "lucide-react";
import { profile } from "../data/portfolio";
import { sfx } from "../utils/sfx";

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

  if (!project) return null;

  return (
    <AnimatePresence>
      <div className="modal-backdrop" onClick={onClose}>
        <motion.div
          className="modal-container panel"
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {/* Header */}
          <div className="modal-header">
            <div>
              <span className="eyebrow" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <ShieldCheck size={14} /> CLASSIFIED OP // {project.year}
              </span>
              <h2 id="modal-title">{project.title}</h2>
            </div>
            <button
              className="modal-close-btn"
              onClick={() => {
                sfx.playClick();
                onClose();
              }}
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="modal-body">
            <div className="modal-image-wrap">
              <img
                src={imgErr ? "/images/hero-placeholder.svg" : project.image}
                alt={`${project.title} preview`}
                onError={() => setImgErr(true)}
              />
              <div className="scanline" />
            </div>

            <div className="modal-section">
              <span className="eyebrow"><Layers size={14} /> DESCRIPTION</span>
              <p>{project.description}</p>
            </div>

            {project.architecture && (
              <div className="modal-section">
                <span className="eyebrow"><Cpu size={14} /> SYSTEM ARCHITECTURE</span>
                <div className="architecture-box">
                  <code>{project.architecture}</code>
                </div>
              </div>
            )}

            {project.metrics && (
              <div className="modal-section">
                <span className="eyebrow"><Activity size={14} /> PERFORMANCE METRICS</span>
                <div className="modal-metrics-grid">
                  {project.metrics.map((m) => (
                    <div className="modal-metric-card" key={m.label}>
                      <span className="metric-val">{m.value}</span>
                      <span className="metric-lbl">{m.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {project.highlights && (
              <div className="modal-section">
                <span className="eyebrow">KEY HIGHLIGHTS & WINS</span>
                <ul className="modal-highlights-list">
                  {project.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="modal-section">
              <span className="eyebrow">STACK SPECIFICATION</span>
              <div className="chips">
                {project.stack.map((s) => (
                  <span className="chip" key={s}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="modal-footer">
            {project.githubUrl && !project.githubUrl.startsWith("REPLACE_WITH") && project.githubUrl !== "#" ? (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
                onClick={() => sfx.playClick()}
              >
                <Github size={16} /> Repository
              </a>
            ) : (
              <a
                href={profile.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
                onClick={() => sfx.playClick()}
              >
                <Github size={16} /> GitHub Profile
              </a>
            )}

            {project.liveUrl && !project.liveUrl.startsWith("REPLACE_WITH") && project.liveUrl !== "#" && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                onClick={() => sfx.playClick()}
              >
                <ExternalLink size={16} /> Live Demo
              </a>
            )}

            <a
              href={profile.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              onClick={() => sfx.playClick()}
            >
              <ExternalLink size={16} /> Contact Operator
            </a>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
