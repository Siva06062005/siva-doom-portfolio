import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import PageShell from "../components/PageShell";
import CertificateShowcaseCard from "../components/CertificateShowcaseCard";
import CertificateModal from "../components/CertificateModal";
import { certificates } from "../data/certificates";

export default function Certificates() {
  const [selectedCert, setSelectedCert] = useState(null);
  const [showContent, setShowContent] = useState(false);
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.08 });

  // When user scrolls to certificates, allow the cinematic ambient background to take the stage first,
  // then reveal the showcase contents in smooth GPU-accelerated motion
  useEffect(() => {
    if (!isInView) return;
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 450);
    return () => clearTimeout(timer);
  }, [isInView]);

  return (
    <div className="cert-page-wrapper" ref={containerRef}>
      {/* ── Persistent Ambient Background (Enters first, remains constant for all cards) ── */}
      <div className="cert-full-ambient-bg" aria-hidden="true">
        <motion.img
          src="/images/cert-bg.png"
          alt=""
          className="cert-full-ambient-img"
          loading="eager"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 0.82, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
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
        initial={{ opacity: 0, y: 35 }}
        animate={
          showContent
            ? { opacity: 1, y: 0 }
            : { opacity: 0, y: 35 }
        }
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        style={{ willChange: "transform, opacity" }}
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
                    initial={{ opacity: 0, y: 40, scale: 0.98 }}
                    animate={
                      showContent
                        ? { opacity: 1, y: 0, scale: 1 }
                        : { opacity: 0, y: 40, scale: 0.98 }
                    }
                    transition={{
                      duration: 0.6,
                      ease: [0.16, 1, 0.3, 1],
                      delay: 0.05 + index * 0.08,
                    }}
                    style={{ willChange: "transform, opacity" }}
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
