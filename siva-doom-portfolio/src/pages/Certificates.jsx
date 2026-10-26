import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import PageShell from "../components/PageShell";
import CertificateShowcaseCard from "../components/CertificateShowcaseCard";
import CertificateModal from "../components/CertificateModal";
import { certificates } from "../data/certificates";

export default function Certificates() {
  const [selectedCert, setSelectedCert] = useState(null);
  const [showContent, setShowContent] = useState(false);

  // Allow the cinematic background to take the stage first, then reveal the contents in vibrant motion
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 700);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="cert-page-wrapper">
      {/* ── Persistent Ambient Background (Enters first, remains constant for all cards) ── */}
      <div className="cert-full-ambient-bg" aria-hidden="true">
        <motion.img
          src="/images/cert-bg.png"
          alt=""
          className="cert-full-ambient-img"
          loading="eager"
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 0.82, scale: 1 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        />
        <div className="cert-full-ambient-overlay" />
      </div>

      {/* ── Smooth Transition Fade From Projects (Top) ── */}
      <div className="cert-top-fade" aria-hidden="true" />

      <PageShell
        eyebrow="05 // CREDENTIAL VERIFICATION"
        title="Verified Certifications"
        intro="Accredited engineering credentials, cloud architectures, and specialized toolchain proficiencies — verified and authenticated across enterprise platforms."
      >
        <motion.div
        initial={{ opacity: 0, y: 45, filter: "blur(12px)" }}
        animate={
          showContent
            ? { opacity: 1, y: 0, filter: "blur(0px)" }
            : { opacity: 0, y: 45, filter: "blur(12px)" }
        }
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
      >
        <section
          className="section"
          style={{ paddingTop: "10px", paddingBottom: "60px", position: "relative", zIndex: 1 }}
        >
          <div className="container">
            {/* ── Stats Header Bar ── */}
            <motion.div
              className="cert-stats-bar panel"
              initial={{ opacity: 0, y: 20 }}
              animate={showContent ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
            >
              <div className="cert-stats-group">
                <div className="cert-stat-item">
                  <span className="cert-stat-label">TOTAL CREDENTIALS</span>
                  <span className="cert-stat-value cert-stat-accent">
                    0{certificates.length}
                  </span>
                </div>
                <div className="cert-stat-item">
                  <span className="cert-stat-label">STATUS</span>
                  <span className="cert-stat-value">ALL VERIFIED</span>
                </div>
                <div className="cert-stat-item">
                  <span className="cert-stat-label">DOMAINS</span>
                  <span className="cert-stat-value">
                    {
                      new Set(certificates.map((c) => c.category.split(" ")[0]))
                        .size
                    }
                  </span>
                </div>
              </div>
              <div className="cert-status-live">
                <ShieldCheck size={14} />
                CREDENTIAL DATABASE ONLINE
              </div>
            </motion.div>

            {/* ── Sticky Stacking Card Showcase ──
                 Each card uses CSS sticky positioning with increasing top offsets.
                 As the user scrolls, later cards slide up and stack on top of
                 earlier ones, creating the signature layered card effect. */}
            <div className="cert-showcase-stack">
              {certificates.map((cert, index) => (
                <div
                  key={cert.id}
                  className="cert-stack-item"
                  style={{
                    "--stack-offset": `${90 + index * 34}px`,
                    zIndex: index + 1,
                  }}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 65, scale: 0.95, filter: "blur(6px)" }}
                    animate={
                      showContent
                        ? { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }
                        : { opacity: 0, y: 65, scale: 0.95, filter: "blur(6px)" }
                    }
                    transition={{
                      duration: 0.8,
                      ease: [0.16, 1, 0.3, 1],
                      delay: 0.15 + index * 0.12,
                    }}
                  >
                    <CertificateShowcaseCard
                      certificate={cert}
                      index={index}
                      onInspect={(c) => setSelectedCert(c)}
                    />
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </motion.div>

      {/* Certificate Detail / Specs Modal */}
      <CertificateModal
        certificate={selectedCert}
        onClose={() => setSelectedCert(null)}
      />
    </PageShell>

    {/* ── Smooth Transition Fade Into Experience (Bottom) ── */}
    <div className="cert-bottom-fade" aria-hidden="true" />
  </div>
  );
}
