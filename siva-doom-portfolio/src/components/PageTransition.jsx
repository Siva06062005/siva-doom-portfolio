import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { sfx } from "../utils/sfx";

const SECTORS = {
  "/": "SECTOR 01 // TERMINAL CORE",
  "/about": "SECTOR 02 // PERSONNEL DOSSIER",
  "/skills": "SECTOR 03 // TECHNICAL ARSENAL",
  "/projects": "SECTOR 04 // TACTICAL DEPLOYMENTS",
  "/experience": "SECTOR 05 // SERVICE TIMELINE",
  "/contact": "SECTOR 06 // TRANSMISSION UPLINK",
};

/* ── DOOM High-Animation Kinetic Slide Variants ──────────────────
   Directional slide:
   Forward (1): Enter from +80px (right), Exit to -80px (left)
   Backward (-1): Enter from -80px (left), Exit to +80px (right)
   Includes scale, blur dissolve, and custom snappy cubic-bezier
   ─────────────────────────────────────────────────────────────── */
const slideVariants = {
  initial: (direction) => ({
    opacity: 0,
    x: direction > 0 ? 80 : -80,
    scale: 0.98,
    filter: "blur(6px)",
  }),
  animate: {
    opacity: 1,
    x: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.44,
      ease: [0.16, 1, 0.3, 1], // Cinematic exponential ease
    },
  },
  exit: (direction) => ({
    opacity: 0,
    x: direction > 0 ? -80 : 80,
    scale: 0.98,
    filter: "blur(6px)",
    transition: {
      duration: 0.32,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

/* ── Sweeping Laser Beam across the viewport ───────────────────── */
const sweepVariants = {
  initial: (direction) => ({
    x: direction > 0 ? "-100%" : "100%",
    opacity: 1,
  }),
  animate: (direction) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: [0, 1, 1, 0],
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export default function PageTransition({ children, direction = 1 }) {
  const location = useLocation();
  const sectorName = SECTORS[location.pathname] || "SECTOR ?? // UNKNOWN";

  useEffect(() => {
    // Reset scroll cleanly to top when page mounts
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    // Play cyber transmission audio on sector change if sound is enabled
    sfx.playTransmission();
  }, [location.pathname]);

  return (
    <motion.div
      className="page-transition-wrapper"
      custom={direction}
      variants={slideVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{ willChange: "transform, opacity, filter" }}
    >
      {/* High-energy laser sweep beam across viewport */}
      <motion.div
        className="page-transition-sweep"
        custom={direction}
        variants={sweepVariants}
        initial="initial"
        animate="animate"
        aria-hidden="true"
      />

      {/* Holographic Sector HUD indicator chip */}
      <motion.div
        className="page-sector-hud"
        initial={{ opacity: 0, y: -16, scale: 0.9 }}
        animate={{
          opacity: [0, 1, 1, 0],
          y: [-16, 0, 0, -8],
          scale: [0.9, 1, 1, 0.96],
        }}
        transition={{
          duration: 0.85,
          times: [0, 0.15, 0.78, 1],
          ease: "easeOut",
        }}
        aria-hidden="true"
      >
        <span className="page-sector-hud-dot" />
        <span className="page-sector-hud-text">{sectorName}</span>
      </motion.div>

      {children}
    </motion.div>
  );
}
