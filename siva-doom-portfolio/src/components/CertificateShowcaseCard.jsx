import { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  ExternalLink,
  ArrowUpRight,
  ShieldCheck,
  Calendar,
  Hash,
} from "lucide-react";
import { sfx } from "../utils/sfx";

function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function CertificateShowcaseCard({ certificate, index, onInspect }) {
  const [imgError, setImgError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);

  const num = String(index + 1).padStart(2, "0");
  const accent = certificate.color || "#39e68b";

  // Build rich semi-transparent glassmorphic gradient background from the certificate's accent color
  const cardBg = [
    `radial-gradient(ellipse at 15% 50%, ${hexToRgba(accent, 0.25)}, transparent 55%)`,
    `radial-gradient(ellipse at 85% 15%, ${hexToRgba(accent, 0.14)}, transparent 45%)`,
    `radial-gradient(ellipse at 50% 100%, ${hexToRgba(accent, 0.08)}, transparent 50%)`,
    `linear-gradient(145deg, rgba(16, 22, 26, 0.72) 0%, rgba(8, 12, 14, 0.62) 100%)`,
  ].join(", ");

  return (
    <article
      ref={cardRef}
      className="cert-showcase-card"
      style={{
        background: cardBg,
        borderColor: isHovered ? hexToRgba(accent, 0.55) : hexToRgba(accent, 0.22),
        boxShadow: isHovered
          ? `0 30px 80px ${hexToRgba(accent, 0.25)}, 0 0 0 1px ${hexToRgba(accent, 0.35)}`
          : `0 20px 50px rgba(0, 0, 0, 0.65), 0 0 0 1px ${hexToRgba(accent, 0.12)}`,
        "--card-accent": accent,
      }}
      onMouseEnter={() => {
        setIsHovered(true);
        sfx.playHover();
      }}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={(e) => {
        if (!cardRef.current?.contains(e.relatedTarget)) setIsHovered(false);
      }}
    >
      {/* Decorative concentric circles */}
      <div
        className="cert-circle cert-circle-lg"
        style={{ borderColor: hexToRgba(accent, 0.06) }}
      />
      <div
        className="cert-circle cert-circle-md"
        style={{ borderColor: hexToRgba(accent, 0.04) }}
      />
      <div
        className="cert-circle cert-circle-sm"
        style={{ borderColor: hexToRgba(accent, 0.08) }}
      />

      {/* Oversized number badge */}
      <div className="cert-number-badge" style={{ color: accent }}>
        {num}
      </div>

      {/* ── Left Column: Certificate Information ── */}
      <div className="cert-showcase-content">
        <div className="cert-showcase-eyebrow" style={{ color: accent }}>
          <ShieldCheck size={14} />
          {certificate.issuer} // {certificate.category}
        </div>

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
        </div>

        <p className="cert-showcase-desc">{certificate.definition}</p>

        {/* Technology & competency chips */}
        <div className="cert-showcase-chips">
          {(certificate.skills || []).slice(0, 5).map((s) => (
            <span
              key={s}
              className="cert-showcase-chip"
              style={{
                borderColor: hexToRgba(accent, 0.3),
                background: hexToRgba(accent, 0.08),
                color: accent,
              }}
            >
              {s}
            </span>
          ))}
        </div>

        {/* Action buttons — revealed on hover / focus */}
        <div
          className={`cert-showcase-actions ${isHovered ? "is-visible" : ""}`}
        >
          {certificate.credentialUrl && (
            <a
              href={certificate.credentialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="cert-action-primary"
              style={{ background: accent, color: "#000" }}
              onClick={(e) => {
                e.stopPropagation();
                sfx.playClick();
              }}
            >
              <ExternalLink size={14} /> View Certificate
            </a>
          )}
          <button
            className="cert-action-secondary"
            style={{ borderColor: hexToRgba(accent, 0.4), color: accent }}
            onClick={() => {
              sfx.playClick();
              onInspect(certificate);
            }}
          >
            <ArrowUpRight size={14} /> Verify Credential
          </button>
        </div>
      </div>

      {/* ── Right Column: Certificate Preview Image ── */}
      <div className="cert-showcase-image-wrap">
        <motion.img
          src={imgError ? "/images/hero-placeholder.svg" : certificate.image}
          alt={`${certificate.title} certificate preview`}
          className="cert-showcase-preview"
          onError={() => setImgError(true)}
          loading="lazy"
          title="Click to inspect and verify credential"
          onClick={() => {
            sfx.playClick();
            onInspect(certificate);
          }}
          animate={
            isHovered
              ? { rotate: 0, scale: 1.08, y: -10 }
              : { rotate: 3, scale: 1, y: 0 }
          }
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          style={{
            cursor: "pointer",
            boxShadow: isHovered
              ? `0 30px 70px ${hexToRgba(accent, 0.3)}`
              : `0 20px 50px ${hexToRgba(accent, 0.15)}`,
          }}
        />
      </div>
    </article>
  );
}
