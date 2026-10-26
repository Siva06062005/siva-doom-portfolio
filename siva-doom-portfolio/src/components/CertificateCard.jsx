import { useState, useRef } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { ArrowUpRight, ExternalLink, ShieldCheck, CheckCircle2 } from "lucide-react";
import { sfx } from "../utils/sfx";

export default function CertificateCard({ certificate, index, onInspect, isSwipeable = false, onSwipe }) {
  const [imgError, setImgError] = useState(false);
  const cardRef = useRef(null);

  // 3D Magnetic Tilt Physics identical to ProjectCard
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 300, damping: 30 });

  const handleCardClick = () => {
    sfx.playClick();
    if (onInspect) {
      onInspect(certificate);
    } else if (certificate.credentialUrl) {
      window.open(certificate.credentialUrl, "_blank", "noopener,noreferrer");
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
      className="project-card cyber-project-card cert-project-style-card"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ delay: (index || 0) * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
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
        borderColor: certificate.color || "rgba(57, 230, 139, 0.5)",
        boxShadow: `0 28px 80px ${certificate.glowColor || "rgba(57, 230, 139, 0.15)"}, 0 0 0 1px rgba(57, 230, 139, 0.1)`,
        z: 10,
      }}
    >
      {/* HUD Corner Accents */}
      <div className="hud-corner hud-tl" />
      <div className="hud-corner hud-tr" />

      {/* Certificate Image Banner */}
      <div className="project-image">
        <motion.img
          src={imgError ? "/images/hero-placeholder.svg" : certificate.image}
          alt={`${certificate.title} banner`}
          onError={() => setImgError(true)}
          loading="lazy"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        />
        <span className="project-year">{certificate.year || certificate.issueDate}</span>

        {/* Live Verified Credential Link Badge */}
        {certificate.credentialUrl && (
          <a
            href={certificate.credentialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="live-badge"
            title={`View ${certificate.title} in Google Drive`}
            onClick={(e) => {
              e.stopPropagation();
              sfx.playClick();
            }}
          >
            <span className="pulse-dot" /> VERIFIED CREDENTIAL ↗
          </a>
        )}

        {/* Tactical Badge Tag */}
        <div className="project-tactical-tag">
          <span className="badge-pulse" /> CERT_0{(index ?? 0) + 1}.0
        </div>
      </div>

      {/* Card Body */}
      <div className="project-body">
        <span className="eyebrow">
          {certificate.issuer} // {certificate.category}
        </span>
        <h3>{certificate.title}</h3>
        <p>{certificate.definition}</p>

        {/* Technology & Core Competency Chips */}
        <div className="chips">
          {(certificate.skills || []).slice(0, 6).map((s, si) => (
            <motion.span
              className="chip"
              key={s}
              initial={{ opacity: 0, scale: 0.7 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.04 * si, type: "spring", stiffness: 400 }}
            >
              {s}
            </motion.span>
          ))}
        </div>

        {/* Card Action Buttons */}
        <div className="project-card-actions">
          {certificate.credentialUrl && (
            <a
              href={certificate.credentialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="project-live-btn"
              title={`View ${certificate.title} Certificate`}
              onClick={(e) => {
                e.stopPropagation();
                sfx.playClick();
              }}
            >
              <ExternalLink size={14} /> Open Certificate ↗
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
