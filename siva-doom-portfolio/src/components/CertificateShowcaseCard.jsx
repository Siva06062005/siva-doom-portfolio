import { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  ExternalLink,
  ShieldCheck,
  Calendar,
  Hash,
  Eye,
  CheckCircle2,
} from "lucide-react";
import { sfx } from "../utils/sfx";

function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function CertificateShowcaseCard({
  certificate,
  index,
  onInspect,
  layout = "stack",
  cardRef: externalCardRef,
  bodyRef,
}) {
  const [imgError, setImgError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const internalCardRef = useRef(null);

  const num = String(index + 1).padStart(2, "0");
  const accent = certificate.color || "#39e68b";

  // Transparent cyber glass background — reveals ambient page background with high-contrast tactical glow
  const cardBg = [
    `radial-gradient(ellipse at 15% 40%, ${hexToRgba(accent, 0.18)}, transparent 60%)`,
    `radial-gradient(ellipse at 85% 20%, ${hexToRgba(accent, 0.10)}, transparent 50%)`,
    `linear-gradient(145deg, rgba(16, 24, 20, 0.72) 0%, rgba(7, 12, 10, 0.65) 100%)`,
  ].join(", ");

  const setArticleRef = (el) => {
    internalCardRef.current = el;
    if (typeof externalCardRef === "function") {
      externalCardRef(el);
    } else if (externalCardRef && typeof externalCardRef === "object") {
      externalCardRef.current = el;
    }
  };

  return (
    <article
      ref={setArticleRef}
      className={`cert-showcase-card ${
        layout === "grid"
          ? "is-grid-card"
          : layout === "deck"
          ? "is-deck-card"
          : "is-stack-card"
      }`}
      style={{
        background: cardBg,
        borderColor: isHovered ? hexToRgba(accent, 0.6) : hexToRgba(accent, 0.25),
        boxShadow: isHovered
          ? `0 30px 80px rgba(0, 0, 0, 0.85), 0 0 25px ${hexToRgba(accent, 0.25)}`
          : `0 20px 60px rgba(0, 0, 0, 0.75), 0 0 0 1px ${hexToRgba(accent, 0.12)}`,
        "--card-accent": accent,
        "--card-glow": hexToRgba(accent, 0.25),
      }}
      onMouseEnter={() => {
        setIsHovered(true);
        sfx.playHover();
      }}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={(e) => {
        if (!internalCardRef.current?.contains(e.relatedTarget)) setIsHovered(false);
      }}
    >
      {/* Tactical HUD Corner Accents */}
      <div className="hud-corner hud-tl" style={{ borderColor: accent }} />
      <div className="hud-corner hud-tr" style={{ borderColor: accent }} />
      <div className="hud-corner hud-bl" style={{ borderColor: accent }} />
      <div className="hud-corner hud-br" style={{ borderColor: accent }} />

      {/* Tactical Top Strip — Persistent Tab Header */}
      <div className="cert-card-top-strip">
        <span
          className="cert-card-tag"
          style={{
            color: accent,
            borderColor: hexToRgba(accent, 0.35),
          }}
        >
          <ShieldCheck size={13} />
          {certificate.issuerShort || certificate.issuer} // {certificate.badge || certificate.category}
        </span>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span className="cert-card-status-pill">
            <CheckCircle2 size={12} color="var(--accent-secondary)" />
            AUTHENTICATED
          </span>
          <span className="cert-card-index" style={{ color: accent }}>
            //{num}
          </span>
        </div>
      </div>

      {/* Main Card Body (Fades out when covered during stack scroll to leave ZERO trace) */}
      <div className="cert-card-main-grid" ref={bodyRef}>
        {/* Left Column: Certificate Information */}
        <div className="cert-showcase-content">
          <h3 className="cert-showcase-title">{certificate.title}</h3>

          <div className="cert-showcase-meta">
            <span>
              <Calendar size={13} /> {certificate.issueDate}
            </span>
            {certificate.code && (
              <span>
                <Hash size={13} /> {certificate.code}
              </span>
            )}
            <span style={{ color: accent, fontWeight: 700 }}>
              {certificate.category}
            </span>
          </div>

          <p className="cert-showcase-desc">{certificate.definition}</p>

          <div className="cert-showcase-chips">
            {(certificate.skills || []).slice(0, 6).map((skill) => (
              <span
                key={skill}
                className="cert-showcase-chip"
                style={{
                  borderColor: hexToRgba(accent, 0.32),
                  background: hexToRgba(accent, 0.08),
                  color: accent,
                }}
              >
                {skill}
              </span>
            ))}
          </div>

          <div className="cert-showcase-actions">
            {certificate.credentialUrl && (
              <a
                href={certificate.credentialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="cert-btn-primary"
                style={{ background: accent, color: "#000" }}
                onClick={(e) => {
                  e.stopPropagation();
                  sfx.playClick();
                }}
                title="Open verified credential in Google Drive"
              >
                <ExternalLink size={14} /> View Original (Drive)
              </a>
            )}
            <button
              type="button"
              className="cert-btn-secondary"
              style={{ borderColor: hexToRgba(accent, 0.4), color: accent }}
              onClick={() => {
                sfx.playClick();
                onInspect(certificate);
              }}
              title="Inspect credential specifications and engineering impact"
            >
              <Eye size={14} /> Inspect Credential Specs
            </button>
          </div>
        </div>

        {/* Right Column: Certificate Preview Document */}
        <div className="cert-showcase-image-wrap">
          <div
            className="cert-preview-frame"
            style={{ borderColor: hexToRgba(accent, 0.3) }}
            onClick={() => {
              sfx.playClick();
              onInspect(certificate);
            }}
            title="Click to inspect credential preview"
          >
            <motion.img
              src={imgError ? "/images/hero-placeholder.svg" : certificate.image}
              alt={`${certificate.title} certificate preview`}
              className="cert-showcase-preview-img"
              onError={() => setImgError(true)}
              loading="lazy"
              animate={isHovered ? { scale: 1.05 } : { scale: 1 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            />
            <div className="cert-preview-overlay-hint">
              <Eye size={16} />
              <span>CLICK TO INSPECT</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
