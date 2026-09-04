import { useTheme } from "../context/ThemeContext";

export default function ThemeTransition() {
  const { transitioning } = useTheme();

  return (
    <div
      className={`theme-transition-overlay ${transitioning ? "active" : ""}`}
      aria-hidden="true"
    />
  );
}
