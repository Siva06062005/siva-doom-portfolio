import { useState, useEffect } from "react";
import { Menu, X, Volume2, VolumeX, Music } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SystemTelemetry from "./SystemTelemetry";
import VoiceAssistant from "./VoiceAssistant";
import { sfx } from "../utils/sfx";

const navSections = [
  ["Home", "home"],
  ["About", "about"],
  ["Skills", "skills"],
  ["Projects", "projects"],
  ["Experience", "experience"],
  ["Contact", "contact"],
];

const navLinkVariants = {
  hidden: { opacity: 0, y: -12 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  }),
};

const mobileMenuVariants = {
  hidden: { opacity: 0, y: -20, scaleY: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scaleY: 1,
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1], staggerChildren: 0.06, delayChildren: 0.05 },
  },
  exit: {
    opacity: 0,
    y: -10,
    scaleY: 0.95,
    transition: { duration: 0.25, ease: "easeIn" },
  },
};

const mobileLinkVariants = {
  hidden: { opacity: 0, x: -16 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, x: -10 },
};

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [sfxOn, setSfxOn] = useState(() => sfx.enabled);
  const [musicOn, setMusicOn] = useState(() => sfx.bgmPlaying);
  const [activeSection, setActiveSection] = useState("home");

  // Scroll spy to detect current active section in single-page layout
  useEffect(() => {
    const sectionIds = ["home", "about", "skills", "projects", "experience", "contact"];
    const handleScroll = () => {
      const scrollPos = window.scrollY + 160;
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(sectionIds[i]);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    sfx.playClick();
    setOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      window.history.replaceState(null, "", `#${id}`);
      setActiveSection(id);
    }
  };

  const toggleSfx = () => {
    const newState = sfx.toggle();
    setSfxOn(newState);
    setMusicOn(sfx.bgmPlaying);
  };

  const toggleMusic = () => {
    const isPlaying = sfx.toggleBgm();
    setMusicOn(isPlaying);
    setSfxOn(sfx.enabled);
  };

  return (
    <header className="nav-wrap">
      <SystemTelemetry />

      <nav className="nav container" role="navigation" aria-label="Main navigation">
        {/* Floating brand logo */}
        <motion.div
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          style={{ display: "inline-block" }}
        >
          <a
            href="#home"
            className="brand"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("home");
            }}
            onMouseEnter={() => sfx.playHover()}
          >
            <span className="brand-mark">
              <img src="/images/logo.png" alt="SIVA Logo" className="brand-logo-img" />
            </span>
            <span>
              SIVA<span className="accent">.</span>S
            </span>
          </a>
        </motion.div>

        {/* Mobile hamburger */}
        <motion.button
          className="menu-btn"
          onClick={() => {
            sfx.playClick();
            setOpen(!open);
          }}
          aria-label="Toggle navigation"
          aria-expanded={open}
          whileTap={{ scale: 0.9 }}
        >
          <AnimatePresence mode="wait" initial={false}>
            {open ? (
              <motion.span
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X size={20} />
              </motion.span>
            ) : (
              <motion.span
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Menu size={20} />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Desktop links */}
        <div className="nav-links desktop-nav">
          {navSections.map(([label, id], i) => (
            <motion.div
              key={id}
              custom={i}
              variants={navLinkVariants}
              initial="hidden"
              animate="visible"
            >
              <a
                href={`#${id}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(id);
                }}
                onMouseEnter={() => sfx.playHover()}
                className={`nav-link-item ${activeSection === id ? "active" : ""}`}
              >
                <span>{`// ${label}`}</span>
              </a>
            </motion.div>
          ))}

          <motion.button
            className={`sfx-toggle-btn ${musicOn ? "music-active" : ""}`}
            onClick={toggleMusic}
            onMouseEnter={() => sfx.playHover()}
            title={musicOn ? "Pause BGM (Loser.mp3)" : "Play BGM (Loser.mp3)"}
            aria-label="Toggle background music"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {musicOn ? (
              <span className="equalizer-bars" aria-hidden="true">
                <span /><span /><span /><span />
              </span>
            ) : (
              <Music size={16} />
            )}
            <span>{musicOn ? "BGM: ON" : "MUSIC"}</span>
          </motion.button>

          <VoiceAssistant />

          <motion.button
            className="sfx-toggle-btn"
            onClick={toggleSfx}
            onMouseEnter={() => sfx.playHover()}
            title={sfxOn ? "Disable Sound Effects" : "Enable HUD Sound Effects"}
            aria-label="Toggle sound effects"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {sfxOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
            <span>{sfxOn ? "SFX: ON" : "SFX: OFF"}</span>
          </motion.button>
        </div>

        {/* Mobile menu overlay */}
        <AnimatePresence>
          {open && (
            <motion.div
              className="nav-links mobile-nav open"
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              style={{ transformOrigin: "top" }}
            >
              {navSections.map(([label, id]) => (
                <motion.div key={id} variants={mobileLinkVariants}>
                  <a
                    href={`#${id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(id);
                    }}
                    onMouseEnter={() => sfx.playHover()}
                    className={`nav-link-item ${activeSection === id ? "active" : ""}`}
                  >
                    <span>{`// ${label}`}</span>
                  </a>
                </motion.div>
              ))}

              <motion.div variants={mobileLinkVariants}>
                <button
                  className={`sfx-toggle-btn ${musicOn ? "music-active" : ""}`}
                  onClick={toggleMusic}
                  style={{ justifyContent: "center", marginTop: "6px" }}
                >
                  {musicOn ? (
                    <span className="equalizer-bars" aria-hidden="true">
                      <span /><span /><span /><span />
                    </span>
                  ) : <Music size={16} />}
                  <span>{musicOn ? "BGM: ON" : "MUSIC"}</span>
                </button>
              </motion.div>

              <motion.div variants={mobileLinkVariants}>
                <VoiceAssistant />
              </motion.div>

              <motion.div variants={mobileLinkVariants}>
                <button
                  className="sfx-toggle-btn"
                  onClick={toggleSfx}
                  style={{ justifyContent: "center" }}
                >
                  {sfxOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
                  <span>{sfxOn ? "SFX: ON" : "SFX: OFF"}</span>
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}