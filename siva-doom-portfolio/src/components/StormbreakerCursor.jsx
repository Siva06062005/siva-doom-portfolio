import React, { useEffect, useState, useRef, useCallback } from "react";
import "./StormbreakerCursor.css";

export default function StormbreakerCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [sparks, setSparks] = useState([]);
  const [ripples, setRipples] = useState([]);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const lastPosRef = useRef({ x: -100, y: -100 });
  const sparkIdCounter = useRef(0);
  const rippleIdCounter = useRef(0);
  const lastSparkTime = useRef(0);

  // Check if device is touch-based
  useEffect(() => {
    const checkTouch = () => {
      return (
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        window.matchMedia("(pointer: coarse)").matches
      );
    };
    if (checkTouch()) {
      setIsTouchDevice(true);
    }
  }, []);

  // Add global cursor none class to body on desktop
  useEffect(() => {
    if (!isTouchDevice) {
      document.documentElement.classList.add("has-stormbreaker-cursor");
      return () => {
        document.documentElement.classList.remove("has-stormbreaker-cursor");
      };
    }
  }, [isTouchDevice]);

  // Handle cursor movement and trails
  useEffect(() => {
    if (isTouchDevice) return;

    const handleMouseMove = (e) => {
      const { clientX: x, clientY: y } = e;
      setPosition({ x, y });
      if (!isVisible) setIsVisible(true);

      // Check distance moved to spawn lightning trail sparks
      const dx = x - lastPosRef.current.x;
      const dy = y - lastPosRef.current.y;
      const distance = Math.hypot(dx, dy);
      const now = performance.now();

      if (distance > 18 && now - lastSparkTime.current > 40) {
        lastSparkTime.current = now;
        const sparkAngle = Math.atan2(dy, dx) + (Math.random() - 0.5) * 1.5;
        const speed = 1.5 + Math.random() * 3;
        const newSpark = {
          id: ++sparkIdCounter.current,
          x: x + 2,
          y: y + 2,
          vx: -Math.cos(sparkAngle) * speed,
          vy: -Math.sin(sparkAngle) * speed,
          size: Math.random() * 3 + 2,
          color: Math.random() > 0.4 ? "#38bdf8" : Math.random() > 0.5 ? "#67e8f9" : "#ffffff",
          duration: 400 + Math.random() * 200,
        };

        setSparks((prev) => [...prev.slice(-14), newSpark]);
      }

      lastPosRef.current = { x, y };
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    const handleMouseDown = (e) => {
      setIsClicking(true);

      // Trigger lightning strike shockwave & burst sparks
      const newRipple = {
        id: ++rippleIdCounter.current,
        x: e.clientX,
        y: e.clientY,
      };
      setRipples((prev) => [...prev.slice(-4), newRipple]);

      // Burst of lightning sparks on strike impact
      const burstSparks = Array.from({ length: 8 }, (_, i) => {
        const angle = (i / 8) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
        const speed = 3 + Math.random() * 4;
        return {
          id: ++sparkIdCounter.current,
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 4 + 2,
          color: i % 2 === 0 ? "#38bdf8" : "#ffffff",
          duration: 500 + Math.random() * 250,
        };
      });
      setSparks((prev) => [...prev.slice(-10), ...burstSparks]);
    };

    const handleMouseUp = () => {
      setIsClicking(false);
    };

    // Hover detection on interactive elements
    const handleMouseOver = (e) => {
      const target = e.target;
      if (
        target.closest(
          'a, button, input, select, textarea, [role="button"], .interactive, .btn, .project-card, .skill-card, .terminal-prompt, .theme-btn, .timeline-content, .filter-chip'
        )
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseenter", handleMouseEnter);
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseover", handleMouseOver, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseenter", handleMouseEnter);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseover", handleMouseOver);
    };
  }, [isVisible, isTouchDevice]);

  // Clean up expired sparks & ripples
  useEffect(() => {
    if (sparks.length === 0) return;
    const timer = setTimeout(() => {
      setSparks((prev) => prev.filter((s) => performance.now() - (s.created || 0) < 600));
    }, 150);
    return () => clearTimeout(timer);
  }, [sparks]);

  useEffect(() => {
    if (ripples.length === 0) return;
    const timer = setTimeout(() => {
      setRipples((prev) => prev.slice(1));
    }, 600);
    return () => clearTimeout(timer);
  }, [ripples]);

  if (isTouchDevice || !isVisible) return null;

  return (
    <div className="stormbreaker-cursor-layer" aria-hidden="true">
      {/* Thunder Shockwave Ripples on Click */}
      {ripples.map((rip) => (
        <div
          key={rip.id}
          className="stormbreaker-shockwave"
          style={{ left: rip.x, top: rip.y }}
        />
      ))}

      {/* Lightning Sparks Trail */}
      {sparks.map((spark) => (
        <div
          key={spark.id}
          className="stormbreaker-spark"
          style={{
            left: spark.x,
            top: spark.y,
            width: `${spark.size}px`,
            height: `${spark.size}px`,
            backgroundColor: spark.color,
            boxShadow: `0 0 8px ${spark.color}, 0 0 14px #38bdf8`,
            transform: `translate(${spark.vx * 4}px, ${spark.vy * 4}px) scale(0)`,
            animationDuration: `${spark.duration}ms`,
          }}
        />
      ))}

      {/* Main Stormbreaker Cursor Weapon */}
      <div
        className={`stormbreaker-cursor ${isHovered ? "is-hovered" : ""} ${
          isClicking ? "is-striking" : ""
        }`}
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        }}
      >
        {/* Bifrost Lightning Aura */}
        <div className="stormbreaker-aura" />

        {/* High-Fidelity Stormbreaker Vector Graphic */}
        <svg
          className="stormbreaker-svg"
          viewBox="0 0 64 64"
          width="44"
          height="44"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Uru Metal Blade Gradient */}
            <linearGradient id="uruBladeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f8fafc" />
              <stop offset="30%" stopColor="#94a3b8" />
              <stop offset="70%" stopColor="#475569" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>

            {/* Glowing Edge Gradient */}
            <linearGradient id="lightningEdge" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#e0f2fe" />
              <stop offset="50%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>

            {/* Hammerhead Gradient */}
            <linearGradient id="hammerGrad" x1="0%" y1="0%" x2="100%" y2="50%">
              <stop offset="0%" stopColor="#64748b" />
              <stop offset="45%" stopColor="#334155" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>

            {/* Groot Wooden Handle Gradient */}
            <linearGradient id="grootWoodGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#854d0e" />
              <stop offset="35%" stopColor="#582f0e" />
              <stop offset="70%" stopColor="#3d1e06" />
              <stop offset="100%" stopColor="#271304" />
            </linearGradient>

            {/* Vine / Twig Accent Gradient */}
            <linearGradient id="vineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4ade80" />
              <stop offset="60%" stopColor="#15803d" />
              <stop offset="100%" stopColor="#14532d" />
            </linearGradient>

            {/* Lightning Glow Filter */}
            <filter id="bifrostGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* ── BIFROST LIGHTNING ARCS (CRACKLING BEHIND & AROUND) ── */}
          <g className="stormbreaker-lightning-arcs" filter="url(#bifrostGlow)">
            <path
              className="lightning-bolt bolt-1"
              d="M10 6 L16 11 L13 15 L20 18"
              stroke="#67e8f9"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            <path
              className="lightning-bolt bolt-2"
              d="M32 10 L30 14 L36 17 L33 22"
              stroke="#38bdf8"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            <path
              className="lightning-bolt bolt-3"
              d="M20 22 L24 28 L21 32 L27 38"
              stroke="#bae6fd"
              strokeWidth="1"
              strokeLinecap="round"
            />
            <path
              className="lightning-bolt bolt-4"
              d="M4 14 L8 18 L6 22 L12 25"
              stroke="#00f0ff"
              strokeWidth="1.1"
              strokeLinecap="round"
            />
          </g>

          {/* ── GROOT'S WOODEN HAFT / HANDLE (DIAGONAL BRANCH) ── */}
          <g className="stormbreaker-haft">
            {/* Main organic wooden branch with bark curvature */}
            <path
              d="M18 18 Q23 28 27 38 Q30 46 38 56 Q40 58 43 60 L45 58 Q38 48 31 37 Q26 26 23 16 Z"
              fill="url(#grootWoodGrad)"
              stroke="#271304"
              strokeWidth="0.75"
            />
            {/* Branch bark texture lines */}
            <path
              d="M22 22 Q25 32 29 42 Q33 50 40 58"
              stroke="#a16207"
              strokeWidth="0.6"
              strokeDasharray="2 3"
              fill="none"
              opacity="0.8"
            />
            {/* Branch knurl / split twigs */}
            <path
              d="M28 40 Q33 42 35 46"
              stroke="#78350f"
              strokeWidth="0.8"
              fill="none"
              strokeLinecap="round"
            />
            {/* Green vine wrapping / Groot life sprig */}
            <path
              d="M20 20 Q24 23 21 27 Q27 31 25 36 Q31 41 29 47 Q36 52 38 56"
              stroke="url(#vineGrad)"
              strokeWidth="1.1"
              fill="none"
              strokeLinecap="round"
              opacity="0.9"
            />
            <circle cx="36" cy="46" r="1" fill="#4ade80" />
            <circle cx="28" cy="33" r="0.8" fill="#86efac" />
          </g>

          {/* ── BINDING RING / COLLAR (SOCKET WHERE HEAD MEETS HANDLE) ── */}
          <g className="stormbreaker-binding">
            <rect
              x="16"
              y="14"
              width="9"
              height="6"
              rx="1.5"
              transform="rotate(-15 16 14)"
              fill="#1e293b"
              stroke="#0ea5e9"
              strokeWidth="0.75"
            />
            <line
              x1="17"
              y1="17"
              x2="24"
              y2="15"
              stroke="#e2e8f0"
              strokeWidth="0.7"
              opacity="0.7"
            />
          </g>

          {/* ── HAMMERHEAD (BACK BLUNT SIDE) ── */}
          <g className="stormbreaker-hammer">
            {/* Hammer block bevel */}
            <path
              d="M23 13 L36 10 L38 18 L25 21 Z"
              fill="url(#hammerGrad)"
              stroke="#475569"
              strokeWidth="0.75"
            />
            {/* Hammer strike face */}
            <path
              d="M36 10 L39 12 L41 20 L38 18 Z"
              fill="#1e293b"
              stroke="#0f172a"
              strokeWidth="0.75"
            />
            {/* Hammer reinforced studs */}
            <circle cx="37" cy="14" r="0.9" fill="#94a3b8" />
            <circle cx="38.5" cy="17" r="0.9" fill="#94a3b8" />
            {/* Hammer rune slot */}
            <line
              x1="27"
              y1="15"
              x2="33"
              y2="13.5"
              stroke="#38bdf8"
              strokeWidth="0.8"
              strokeLinecap="round"
            />
          </g>

          {/* ── BATTLE AXE BLADE (FRONT CHOPPING EDGE & URU CREST) ── */}
          <g className="stormbreaker-axe">
            {/* Main Axe Blade Body */}
            <path
              d="M18 13 L8 4 Q4 10 2 16 Q1 22 7 28 L17 21 Z"
              fill="url(#uruBladeGrad)"
              stroke="#334155"
              strokeWidth="0.75"
            />
            {/* Beveled Blade Cheek */}
            <path
              d="M17 14 L9 7 Q6 12 5 17 Q5 21 9 24 L16 19 Z"
              fill="#334155"
              opacity="0.6"
            />
            {/* Razor Cutting Edge with Sharp Asgardian Arc */}
            <path
              d="M8 4 Q3 10 1 16 Q0 23 7 29"
              stroke="url(#lightningEdge)"
              strokeWidth="1.6"
              strokeLinecap="round"
              fill="none"
              filter="url(#bifrostGlow)"
            />
            {/* Cutting edge highlight */}
            <path
              d="M7 5 Q3 11 2 16 Q1 21 6 27"
              stroke="#ffffff"
              strokeWidth="0.7"
              strokeLinecap="round"
              fill="none"
              opacity="0.95"
            />
            {/* Asgardian Rune Groove in Blade */}
            <path
              d="M14 14 L10 12 L8 16 L12 17"
              stroke="#38bdf8"
              strokeWidth="0.9"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#bifrostGlow)"
            />
            {/* Upper Hook / Strike Tip (Hotspot Pointer Reference) */}
            <circle
              cx="4"
              cy="4"
              r="1.2"
              fill="#ffffff"
              filter="url(#bifrostGlow)"
              className="strike-tip"
            />
          </g>

          {/* ── CORE BIFROST EYE / ENERGY FLARE ── */}
          <circle
            cx="19"
            cy="16"
            r="1.8"
            fill="#e0f2fe"
            stroke="#0284c7"
            strokeWidth="0.6"
            filter="url(#bifrostGlow)"
          />
        </svg>
      </div>
    </div>
  );
}
