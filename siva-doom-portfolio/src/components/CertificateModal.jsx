import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Layers, Cpu, ExternalLink, ShieldCheck, FileCheck, CheckCircle2 } from "lucide-react";
import { sfx } from "../utils/sfx";

export default function CertificateModal({ certificate, onClose }) {
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
      {certificate && (
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
            style={{ borderColor: certificate.color }}
          >
            {/* Modal Header */}
            <div className="modal-header">
              <div>
                <span className="eyebrow" style={{ color: "var(--accent-secondary)", display: "flex", alignItems: "center", gap: "6px" }}>
                  <ShieldCheck size={14} /> VERIFIED CREDENTIAL SPECS // {certificate.code}
                </span>
                <h2 id="modal-title" style={{ margin: "4px 0 0", fontSize: "1.45rem" }}>
                  {certificate.title}
                </h2>
              </div>
              <button
                className="modal-close-btn"
                onClick={() => {
                  sfx.playClick();
                  onClose();
                }}
                aria-label="Close credentials inspection"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Image Banner */}
            <div className="modal-image-wrap" style={{ position: "relative", borderRadius: "8px", overflow: "hidden", marginBottom: "20px" }}>
              <img
                src={imgErr ? "/images/hero-placeholder.svg" : certificate.image}
                alt={certificate.title}
                onError={() => setImgErr(true)}
                style={{ width: "100%", maxHeight: "280px", objectFit: "cover" }}
              />
              <span className="project-year" style={{ position: "absolute", bottom: "12px", right: "12px", background: "rgba(0,0,0,0.8)", padding: "4px 10px", borderRadius: "4px", fontSize: "0.75rem", fontFamily: "var(--font-mono)" }}>
                {certificate.year}
              </span>
            </div>

            {/* Definition Section */}
            <div className="modal-section" style={{ marginBottom: "16px" }}>
              <h4 style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.95rem", color: "var(--accent-secondary)", marginBottom: "8px" }}>
                <FileCheck size={16} /> CERTIFICATION DEFINITION & ARCHITECTURE
              </h4>
              <p style={{ fontSize: "0.9rem", lineHeight: 1.6, color: "var(--text-primary)" }}>
                {certificate.definition}
              </p>
            </div>

            {/* Production Readiness Section */}
            <div className="modal-section" style={{ marginBottom: "16px" }}>
              <h4 style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.95rem", color: certificate.color, marginBottom: "8px" }}>
                <CheckCircle2 size={16} /> PRODUCTION READINESS & IMPACT
              </h4>
              <p style={{ fontSize: "0.88rem", lineHeight: 1.55, color: "var(--text-secondary)" }}>
                {certificate.engineeringImpact}
              </p>
            </div>

            {/* Technologies */}
            <div className="modal-section" style={{ marginBottom: "24px" }}>
              <h4 style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "10px" }}>
                VERIFIED SKILLS & TOOLCHAINS
              </h4>
              <div className="chips">
                {(certificate.skills || []).map((s) => (
                  <span className="chip" key={s}>
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", borderTop: "1px solid var(--border-subtle)", paddingTop: "18px" }}>
              <a
                href={certificate.credentialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                style={{ flex: 1, justifyContent: "center" }}
                onClick={() => sfx.playClick()}
              >
                <ExternalLink size={16} /> Open Verified Certificate in Google Drive ↗
              </a>
              <button
                className="btn btn-subtle"
                onClick={() => {
                  sfx.playClick();
                  onClose();
                }}
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
