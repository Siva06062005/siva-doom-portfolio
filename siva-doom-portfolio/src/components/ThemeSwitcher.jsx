import { useTheme } from "../context/ThemeContext";

export default function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className="theme-btn"
      onClick={toggleTheme}
      title={`Switch to ${theme === "doom" ? "Stark" : "Doom"} Mode`}
      aria-label={`Switch to ${theme === "doom" ? "Stark" : "Doom"} Mode`}
    >
      {theme === "doom" ? (
        <>🦾 <span>STARK</span></>
      ) : (
        <>☠️ <span>DOOM</span></>
      )}
    </button>
  );
}
