import { createContext, useContext } from "react";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  // Single active theme — Doom. Ironman theme preserved in CSS and components for future activation.
  const theme = "doom";
  const toggleTheme = () => {};
  const transitioning = false;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, transitioning }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
