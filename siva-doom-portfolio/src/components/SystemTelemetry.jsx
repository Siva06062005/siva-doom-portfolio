import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";

export default function SystemTelemetry() {
  const { theme } = useTheme();
  const [time, setTime] = useState("");
  const [uptime, setUptime] = useState(0);
  const [ping, setPing] = useState(12);

  useEffect(() => {
    // Live IST Clock
    const updateClock = () => {
      const now = new Date();
      const options = {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      };
      setTime(new Intl.DateTimeFormat("en-GB", options).format(now));
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);

    // Uptime Counter
    const uptimeInterval = setInterval(() => {
      setUptime((prev) => prev + 1);
    }, 1000);

    // Dynamic Ping jitter
    const pingInterval = setInterval(() => {
      setPing(Math.floor(10 + Math.random() * 8));
    }, 4000);

    return () => {
      clearInterval(interval);
      clearInterval(uptimeInterval);
      clearInterval(pingInterval);
    };
  }, []);

  const formatUptime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}s`;
  };

  return (
    <div className="system-telemetry" aria-label="System telemetry banner">
      <div className="container telemetry-inner">
        <div className="telemetry-item">
          <span className="telemetry-dot" />
          <span className="telemetry-label">LOCATION:</span>
          <strong>TAMIL NADU, IN (IST)</strong>
        </div>
        <div className="telemetry-item">
          <span className="telemetry-label">LOCAL TIME:</span>
          <strong>{time || "17:30:00"}</strong>
        </div>
        <div className="telemetry-item">
          <span className="telemetry-label">SESSION UPTIME:</span>
          <strong>{formatUptime(uptime)}</strong>
        </div>
        <div className="telemetry-item">
          <span className="telemetry-label">NETWORK LATENCY:</span>
          <strong>{ping}ms</strong>
        </div>
        <div className="telemetry-item">
          <span className="telemetry-label">MODE:</span>
          <strong>{theme === "ironman" ? "IRONMAN ARC HUD" : "DOOM TERMINAL"}</strong>
        </div>
      </div>
    </div>
  );
}
