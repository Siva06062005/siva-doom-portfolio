import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, Shield, Volume2, VolumeX, Music, Inbox } from "lucide-react";
import SystemTelemetry from "./SystemTelemetry";
import VoiceAssistant from "./VoiceAssistant";
import { sfx } from "../utils/sfx";
import { inboxService } from "../services/inboxService";

const links = [
  ["Home", "/"],
  ["About", "/about"],
  ["Skills", "/skills"],
  ["Projects", "/projects"],
  ["Experience", "/experience"],
  ["Contact", "/contact"],
  ["Inbox", "/inbox"],
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [sfxOn, setSfxOn] = useState(() => sfx.enabled);
  const [musicOn, setMusicOn] = useState(() => sfx.bgmPlaying);
  const [unreadCount, setUnreadCount] = useState(() => inboxService.getStats().unread);

  useEffect(() => {
    const updateCount = () => {
      setUnreadCount(inboxService.getStats().unread);
    };
    window.addEventListener("inbox_updated", updateCount);
    return () => window.removeEventListener("inbox_updated", updateCount);
  }, []);

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
              {label === "Inbox" && unreadCount > 0 && (
                <span className="nav-unread-badge" title={`${unreadCount} unread transmissions`}>
                  {unreadCount}
                </span>
              )}
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