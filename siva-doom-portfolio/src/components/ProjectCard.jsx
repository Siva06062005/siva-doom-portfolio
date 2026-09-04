import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Cpu, Layers } from "lucide-react";
import { sfx } from "../utils/sfx";

export default function ProjectCard({ project, index, onInspect }) {
  const [imgError, setImgError] = useState(false);

  const handleCardClick = () => {
    sfx.playClick();
    if (onInspect) onInspect(project);
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
        <div className="project-tactical-tag">
          <span className="badge-pulse" /> SPEC_V{index + 1}.0
        </div>
      </div>

      <div className="project-body">
        <span className="eyebrow">{project.category}</span>
        <h3>{project.title}</h3>
        <p>{project.description}</p>

        <div className="chips">
          {project.stack.map((s) => (
            <span className="chip" key={s}>
              {s}
            </span>
          ))}
        </div>

        <button className="ghost-btn cyber-ghost-btn" type="button" onClick={handleCardClick}>
          Inspect Specifications <ArrowUpRight size={16} />
        </button>
      </div>
    </motion.article>
  );
}