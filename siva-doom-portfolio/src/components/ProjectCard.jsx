import { useState, useRef } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { sfx } from "../utils/sfx";

export default function ProjectCard({ project, index, onInspect }) {
  const [imgError, setImgError] = useState(false);
  const cardRef = useRef(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 300, damping: 30 });

  const hasLiveUrl = Boolean(project.liveUrl && project.liveUrl.trim() !== "");

  const handleCardClick = () => {
    sfx.playClick();
    if (onInspect) {
      onInspect(project);
    } else if (hasLiveUrl) {
      window.open(project.liveUrl, "_blank", "noopener,noreferrer");
    }
  };

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.article
      ref={cardRef}
      className="project-card cyber-project-card"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ delay: index * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => sfx.playHover()}
      onClick={handleCardClick}
      style={{
        cursor: "pointer",
        position: "relative",
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        transformPerspective: 800,
      }}
      whileHover={{
        borderColor: "rgba(57, 230, 139, 0.5)",
        boxShadow: "0 28px 80px rgba(57, 230, 139, 0.15), 0 0 0 1px rgba(57, 230, 139, 0.1)",
        z: 10,
      }}
    >
      {/* HUD Corner Accents */}
      <div className="hud-corner hud-tl" />
      <div className="hud-corner hud-tr" />

      <div className="project-image">
        <motion.img
          src={imgError ? "/images/hero-placeholder.svg" : project.image}
          alt={`${project.title} preview`}
          onError={() => setImgError(true)}
          loading="lazy"
          whileHover={{ scale: 1.07 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        />
        <span className="project-year">{project.year}</span>

        {hasLiveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="live-badge"
            title={`Launch ${project.title} Live Build`}
            onClick={(e) => {
              e.stopPropagation();
              sfx.playClick();
            }}
          >
            <span className="pulse-dot" /> LIVE BUILD ↗
          </a>
        )}

        <div className="project-tactical-tag">
          <span className="badge-pulse" /> SPEC_V{index + 1}.0
        </div>
      </div>

      <div className="project-body">
        <span className="eyebrow">{project.category}</span>
        <h3>{project.title}</h3>
        <p>{project.shortDescription || project.description}</p>

        <div className="chips">
          {(project.technologies || project.stack || []).slice(0, 6).map((s, si) => (
            <motion.span
              className="chip"
              key={s}
              initial={{ opacity: 0, scale: 0.7 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 * si, type: "spring", stiffness: 400 }}
            >
              {s}
            </motion.span>
          ))}
        </div>

        <div className="project-card-actions">
          {hasLiveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="project-live-btn"
              title={`Launch ${project.title} Live Build`}
              onClick={(e) => {
                e.stopPropagation();
                sfx.playClick();
              }}
            >
              <ExternalLink size={14} /> Launch Live Build ↗
            </a>
          )}
          <motion.button
            className="ghost-btn cyber-ghost-btn"
            type="button"
            onClick={handleCardClick}
            whileHover={{ x: 5 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            Inspect Specs <ArrowUpRight size={15} />
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
}