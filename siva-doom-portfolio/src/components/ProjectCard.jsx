import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, ExternalLink, Cpu, Layers } from "lucide-react";
import { sfx } from "../utils/sfx";

export default function ProjectCard({ project, index, onInspect }) {
  const [imgError, setImgError] = useState(false);

  const hasLiveUrl = project.liveUrl && !project.liveUrl.startsWith("REPLACE_WITH") && project.liveUrl !== "#";

  const handleCardClick = () => {
    sfx.playClick();
    if (onInspect) {
      onInspect(project);
    } else if (hasLiveUrl) {
      window.open(project.liveUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <motion.article
      className="project-card cyber-project-card"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ delay: index * 0.08 }}
      onMouseEnter={() => sfx.playHover()}
      onClick={handleCardClick}
      style={{ cursor: "pointer", position: "relative" }}
    >
      {/* HUD Corner Accents */}
      <div className="hud-corner hud-tl" />
      <div className="hud-corner hud-tr" />

      <div className="project-image">
        <img
          src={imgError ? "/images/hero-placeholder.svg" : project.image}
          alt={`${project.title} preview`}
          onError={() => setImgError(true)}
          loading="lazy"
        />
        <span className="project-year">{project.year}</span>

        {hasLiveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="live-badge"
            title={`Tap to launch ${project.title} live app`}
            onClick={(e) => {
              e.stopPropagation();
              sfx.playClick();
            }}
          >
            <span className="pulse-dot" /> LIVE APP ↗
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
          {(project.technologies || project.stack || []).slice(0, 6).map((s) => (
            <span className="chip" key={s}>
              {s}
            </span>
          ))}
        </div>

        <div className="project-card-actions">
          {hasLiveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="project-live-btn"
              title={`Tap to open ${project.title} Project Link`}
              onClick={(e) => {
                e.stopPropagation();
                sfx.playClick();
              }}
            >
              <ExternalLink size={14} /> Tap for Project Link ↗
            </a>
          )}
          <button className="ghost-btn cyber-ghost-btn" type="button" onClick={handleCardClick}>
            Inspect Specs <ArrowUpRight size={15} />
          </button>
        </div>
      </div>
    </motion.article>
  );
}