import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  ShieldCheck,
  Layers,
  CreditCard,
  LayoutGrid,
  ChevronLeft,
  ChevronRight,
  Filter,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import PageShell from "../components/PageShell";
import CertificateShowcaseCard from "../components/CertificateShowcaseCard";
import CertificateModal from "../components/CertificateModal";
import { certificates } from "../data/certificates";
import { sfx } from "../utils/sfx";

export default function Certificates() {
  const [selectedCert, setSelectedCert] = useState(null);
  const [showContent, setShowContent] = useState(false);
  const [viewMode, setViewMode] = useState("stack"); // "stack" (default - previous style enhanced) | "deck" | "grid"
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const containerRef = useRef(null);
  const cardRefs = useRef([]);
  const bodyRefs = useRef([]);
  const isInView = useInView(containerRef, { once: true, amount: 0.08 });

  // Dynamically clip previous cards on scroll so covered cards leave ZERO trace under overlying cards
  useEffect(() => {
    if (viewMode !== "stack") return;

    let animFrameId = null;

    const updateStackOverlap = () => {
      const total = certificates.length;
      for (let i = 0; i < total - 1; i++) {
        const currentCard = cardRefs.current[i];
        const nextCard = cardRefs.current[i + 1];
        const bodyEl = bodyRefs.current[i];

        if (!currentCard || !nextCard) continue;

        const currentRect = currentCard.getBoundingClientRect();
        const nextRect = nextCard.getBoundingClientRect();

        // Distance nextCard has moved up over currentCard
        const overlapHeight = currentRect.bottom - nextRect.top;
        const maxClip = Math.max(0, currentRect.height - 48); // preserve top 48px header tab

        if (overlapHeight > 0) {
          const clipPx = Math.min(maxClip, overlapHeight);
          currentCard.style.clipPath = `inset(0 0 ${clipPx}px 0 round 20px 20px 0 0)`;

          // Fade out body content as next card slides up so text never abruptly cuts
          const fadeProgress = Math.min(1, overlapHeight / (maxClip * 0.65));
          const bodyOpacity = Math.max(0, 1 - fadeProgress);
          if (bodyEl) {
            bodyEl.style.opacity = bodyOpacity;
            bodyEl.style.pointerEvents = bodyOpacity < 0.1 ? "none" : "auto";
          }
        } else {
          currentCard.style.clipPath = "none";
          if (bodyEl) {
            bodyEl.style.opacity = "1";
            bodyEl.style.pointerEvents = "auto";
          }
        }
      }
    };

    const onScrollOrResize = () => {
      if (animFrameId) cancelAnimationFrame(animFrameId);
      animFrameId = requestAnimationFrame(updateStackOverlap);
    };

    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize, { passive: true });

    // Initial update after DOM settles
    const initTimer = setTimeout(updateStackOverlap, 60);

    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
      if (animFrameId) cancelAnimationFrame(animFrameId);
      clearTimeout(initTimer);
      // Clean up clip paths if user switches view
      cardRefs.current.forEach((el) => {
        if (el) el.style.clipPath = "none";
      });
      bodyRefs.current.forEach((el) => {
        if (el) {
          el.style.opacity = "1";
          el.style.pointerEvents = "auto";
        }
      });
    };
  }, [viewMode]);

  // When user scrolls to certificates, reveal showcase content smoothly
  useEffect(() => {
    if (!isInView) return;
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 350);
    return () => clearTimeout(timer);
  }, [isInView]);

  // Keyboard navigation for Deck mode
  const handlePrev = useCallback(() => {
    sfx.playClick();
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : certificates.length - 1));
  }, []);

  const handleNext = useCallback(() => {
    sfx.playClick();
    setActiveIndex((prev) => (prev < certificates.length - 1 ? prev + 1 : 0));
  }, []);

  useEffect(() => {
    if (viewMode !== "deck") return;
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [viewMode, handlePrev, handleNext]);

  // Category filters for Grid view
  const categories = [
    "ALL",
    ...Array.from(new Set(certificates.map((c) => c.category))),
  ];

  const filteredCerts =
    selectedCategory === "ALL"
      ? certificates
      : certificates.filter((c) => c.category === selectedCategory);

  const activeCert = certificates[activeIndex];

  return (
    <div className="cert-page-wrapper" ref={containerRef}>
      {/* ── Persistent Ambient Background ── */}
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

      {/* ── Smooth Transition Fade From Top ── */}
      <div className="cert-top-fade" aria-hidden="true" />

      <PageShell
        eyebrow="05 // CREDENTIAL VERIFICATION"
        title="Verified Certifications"
        intro="Accredited engineering credentials, cloud architectures, and specialized toolchain proficiencies — verified and authenticated across enterprise platforms."
      >
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={showContent ? { opacity: 1, y: 0 } : { opacity: 0, y: 35 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          style={{ willChange: "transform, opacity" }}
        >
          <section
            className="section"
            style={{ paddingTop: "10px", paddingBottom: "60px", position: "relative", zIndex: 1 }}
          >
            <div className="container">
              {/* ── Stats & Viewport Control Header Bar ── */}
              <motion.div
                className="cert-stats-bar panel"
                initial={{ opacity: 0, y: 20 }}
                animate={showContent ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
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
                    <span className="cert-stat-label">SPECIALIZATIONS</span>
                    <span className="cert-stat-value">
                      0{new Set(certificates.map((c) => c.category)).size}
                    </span>
                  </div>
                </div>

                <div className="cert-stats-right">
                  <div className="cert-status-live">
                    <ShieldCheck size={14} />
                    DATABASE ONLINE
                  </div>

                  {/* High-Tech View Mode Switcher */}
                  <div className="cert-view-switcher" role="tablist" aria-label="View format">
                    <button
                      type="button"
                      className={`cert-view-btn ${viewMode === "stack" ? "active" : ""}`}
                      onClick={() => {
                        sfx.playClick();
                        setViewMode("stack");
                      }}
                      title="Switch to 3D Stacking Scroll view (Default)"
                    >
                      <Layers size={14} />
                      <span>3D STACK</span>
                    </button>
                    <button
                      type="button"
                      className={`cert-view-btn ${viewMode === "deck" ? "active" : ""}`}
                      onClick={() => {
                        sfx.playClick();
                        setViewMode("deck");
                      }}
                      title="Switch to 3D Deck Showcase view"
                    >
                      <CreditCard size={14} />
                      <span>3D DECK</span>
                    </button>
                    <button
                      type="button"
                      className={`cert-view-btn ${viewMode === "grid" ? "active" : ""}`}
                      onClick={() => {
                        sfx.playClick();
                        setViewMode("grid");
                      }}
                      title="Switch to All-in-one Tactical Grid view"
                    >
                      <LayoutGrid size={14} />
                      <span>TACTICAL GRID</span>
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* ══════════════════════════════════════════════════════════
                  VIEW MODE A: 3D STACKING SCROLL (PREVIOUS STYLE ENHANCED & DEFAULT)
                  ══════════════════════════════════════════════════════════ */}
              {viewMode === "stack" && (
                <div className="cert-showcase-stack">
                  {certificates.map((cert, index) => (
                    <div
                      key={cert.id}
                      className="cert-stack-item"
                      style={{
                        "--stack-offset": `${85 + index * 44}px`,
                        zIndex: index + 1,
                      }}
                    >
                      <motion.div
                        initial={{ opacity: 0, y: 35, scale: 0.98 }}
                        animate={
                          showContent
                            ? { opacity: 1, y: 0, scale: 1 }
                            : { opacity: 0, y: 35, scale: 0.98 }
                        }
                        transition={{
                          duration: 0.55,
                          ease: [0.16, 1, 0.3, 1],
                          delay: 0.05 + index * 0.07,
                        }}
                        style={{ willChange: "transform, opacity" }}
                      >
                        <CertificateShowcaseCard
                          cardRef={(el) => (cardRefs.current[index] = el)}
                          bodyRef={(el) => (bodyRefs.current[index] = el)}
                          certificate={cert}
                          index={index}
                          onInspect={(c) => setSelectedCert(c)}
                          layout="stack"
                        />
                      </motion.div>
                    </div>
                  ))}
                </div>
              )}

              {/* ══════════════════════════════════════════════════════════
                  VIEW MODE B: 3D DECK SHOWCASE (NON-OVERLAPPING FOCUS)
                  ══════════════════════════════════════════════════════════ */}
              {viewMode === "deck" && (
                <div className="cert-deck-layout">
                  {/* Interactive Stepper Navigation Tabs */}
                  <div className="cert-stepper-bar" role="tablist">
                    {certificates.map((cert, idx) => {
                      const isActive = idx === activeIndex;
                      const num = String(idx + 1).padStart(2, "0");
                      const accent = cert.color || "#39e68b";
                      return (
                        <button
                          key={cert.id}
                          type="button"
                          className={`cert-stepper-chip ${isActive ? "active" : ""}`}
                          style={{
                            "--chip-accent": accent,
                            "--chip-glow": cert.glowColor,
                          }}
                          onClick={() => {
                            sfx.playClick();
                            setActiveIndex(idx);
                          }}
                        >
                          <span
                            className="cert-chip-dot"
                            style={{ background: accent, color: accent }}
                          />
                          <span className="cert-chip-num">{num}.</span>
                          <span>{cert.issuerShort || cert.issuer}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Deck Stage Container */}
                  <div className="cert-deck-stage">
                    {/* Left Navigation Arrow */}
                    <button
                      type="button"
                      className="cert-nav-arrow cert-nav-arrow-prev"
                      onClick={handlePrev}
                      title="Previous Credential (←)"
                      aria-label="Previous Credential"
                    >
                      <ChevronLeft size={22} />
                    </button>

                    {/* Right Navigation Arrow */}
                    <button
                      type="button"
                      className="cert-nav-arrow cert-nav-arrow-next"
                      onClick={handleNext}
                      title="Next Credential (→)"
                      aria-label="Next Credential"
                    >
                      <ChevronRight size={22} />
                    </button>

                    {/* Solid 3D Deck Ghost Backing Layers (Gives physical depth without text bleed) */}
                    <div className="cert-deck-ghost-layer" aria-hidden="true" />
                    <div className="cert-deck-ghost-layer-2" aria-hidden="true" />

                    {/* Active Card in Front — 100% Solid & Fully Viewable */}
                    <div className="cert-deck-active-wrapper">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={activeCert.id}
                          initial={{ opacity: 0, x: 25, scale: 0.98 }}
                          animate={{ opacity: 1, x: 0, scale: 1 }}
                          exit={{ opacity: 0, x: -25, scale: 0.98 }}
                          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        >
                          <CertificateShowcaseCard
                            certificate={activeCert}
                            index={activeIndex}
                            onInspect={(c) => setSelectedCert(c)}
                            layout="deck"
                          />
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Bottom Controls Bar */}
                  <div className="cert-deck-controls-bar">
                    {/* Dots / Quick Selector */}
                    <div className="cert-deck-dots">
                      {certificates.map((_, dotIdx) => (
                        <button
                          key={dotIdx}
                          type="button"
                          className={`cert-deck-dot-btn ${dotIdx === activeIndex ? "active" : ""}`}
                          onClick={() => {
                            sfx.playClick();
                            setActiveIndex(dotIdx);
                          }}
                          aria-label={`Jump to credential ${dotIdx + 1}`}
                        >
                          0{dotIdx + 1}
                        </button>
                      ))}
                    </div>

                    {/* Counter */}
                    <div className="cert-deck-counter">
                      CREDENTIAL <strong>0{activeIndex + 1}</strong> OF 0{certificates.length}
                    </div>

                    {/* Hotkey Helper */}
                    <div className="cert-deck-hint">
                      <span><kbd>←</kbd> <kbd>→</kbd> ARROW KEYS TO NAVIGATE</span>
                    </div>
                  </div>
                </div>
              )}

              {/* ══════════════════════════════════════════════════════════
                  VIEW MODE B: TACTICAL GRID (FULL OVERVIEW)
                  ══════════════════════════════════════════════════════════ */}
              {viewMode === "grid" && (
                <div className="cert-grid-layout">
                  {/* Category Filter Pills */}
                  <div className="cert-filters-bar">
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "0.74rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)", marginRight: "6px" }}>
                      <Filter size={13} /> FILTER:
                    </span>
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        className={`cert-filter-pill ${selectedCategory === cat ? "active" : ""}`}
                        onClick={() => {
                          sfx.playClick();
                          setSelectedCategory(cat);
                        }}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* All Certificates Grid */}
                  <div className="cert-tactical-grid">
                    {filteredCerts.map((cert, idx) => (
                      <motion.div
                        key={cert.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45, delay: idx * 0.06 }}
                      >
                        <CertificateShowcaseCard
                          certificate={cert}
                          index={certificates.findIndex((c) => c.id === cert.id)}
                          onInspect={(c) => setSelectedCert(c)}
                          layout="grid"
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        </motion.div>

        {/* Certificate Detail / Specs Modal */}
        <CertificateModal
          certificate={selectedCert}
          onClose={() => setSelectedCert(null)}
        />
      </PageShell>

      {/* ── Smooth Transition Fade Bottom ── */}
      <div className="cert-bottom-fade" aria-hidden="true" />
    </div>
  );
}
