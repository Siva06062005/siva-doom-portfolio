import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, Volume2, VolumeX, Music } from "lucide-react";
import SystemTelemetry from "./SystemTelemetry";
import VoiceAssistant from "./VoiceAssistant";
import { sfx } from "../utils/sfx";

const links = [
  ["Home", "/"],
  ["About", "/about"],
  ["Skills", "/skills"],
  ["Projects", "/projects"],
  ["Experience", "/experience"],
  ["Contact", "/contact"],
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [sfxOn, setSfxOn] = useState(() => sfx.enabled);
  const [musicOn, setMusicOn] = useState(() => sfx.bgmPlaying);

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
        <Link
          to="/"
          className="brand"
          onClick={() => {
            sfx.playClick();
            setOpen(false);
          }}
          onMouseEnter={() => sfx.playHover()}
        >
          <span className="brand-mark">
            <img src="/images/logo.png" alt="SIVA Logo" className="brand-logo-img" />
          </span>
          <span>
            SIVA<span className="accent">.</span>S
          </span>
        </Link>

        <button
          className="menu-btn"
          onClick={() => {
            sfx.playClick();
            setOpen(!open);
          }}
          aria-label="Toggle navigation"
          aria-expanded={open}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>

        <div className={`nav-links ${open ? "open" : ""}`}>
          {links.map(([label, path]) => (
            <NavLink
              key={path}
              to={path}
              onClick={() => {
                sfx.playClick();
                setOpen(false);
              }}
              onMouseEnter={() => sfx.playHover()}
              className={({ isActive }) => `nav-link-item ${isActive ? "active" : ""}`}
            >
              <span>{`// ${label}`}</span>
            </NavLink>
          ))}

          <button
            className={`sfx-toggle-btn ${musicOn ? "music-active" : ""}`}
            onClick={toggleMusic}
            onMouseEnter={() => sfx.playHover()}
            title={musicOn ? "Pause BGM (Loser.mp3)" : "Play BGM (Loser.mp3)"}
            aria-label="Toggle background music"
          >
            {musicOn ? (
              <span className="equalizer-bars" aria-hidden="true">
                <span /><span /><span /><span />
              </span>
            ) : (
              <Music size={16} />
            )}
            <span>{musicOn ? "BGM: ON" : "MUSIC"}</span>
          </button>

          <VoiceAssistant />

          <button
            className="sfx-toggle-btn"
            onClick={toggleSfx}
            onMouseEnter={() => sfx.playHover()}
            title={sfxOn ? "Disable Sound Effects" : "Enable HUD Sound Effects"}
            aria-label="Toggle sound effects"
          >
            {sfxOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
            <span>{sfxOn ? "SFX: ON" : "SFX: OFF"}</span>
          </button>
        </div>
      </nav>
    </header>
  );
}