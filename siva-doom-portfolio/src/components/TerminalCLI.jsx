import { useState, useRef, useEffect } from "react";
import { Terminal, CornerDownLeft } from "lucide-react";
import { profile, projects, skillGroups } from "../data/portfolio";
import { sfx } from "../utils/sfx";

export default function TerminalCLI() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([
    { type: "sys", text: "DOOM INDUSTRIAL CYBER OS v2.0 // CLI ACTIVE & ARMORED" },
    { type: "sys", text: "Type 'help' to view commands (Try 'loser', 'music', 'coffee', 'hire', 'rm -rf /', or 'docker')." },
  ]);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const handleCommand = (e) => {
    e.preventDefault();
    const rawCmd = input.trim();
    const cmd = rawCmd.toLowerCase();
    if (!cmd) return;

    sfx.playKeypress();

    const newHistory = [...history, { type: "user", text: `$ ${rawCmd}` }];

    switch (cmd) {
      case "help":
        newHistory.push({
          type: "output",
          text: `DOOM CYBER COMMAND MANUAL:
  help       - Display this command manual
  veronica   - Query Veronica AI voice assistant status
  whoami     - Print engineer credentials & summary
  hire       - Recruiter & role uplink telemetry
  skills     - Query full technical arsenal
  projects   - List production engineering builds
  loser      - Play / Pause 'Loser.mp3' BGM track 🎵
  music      - Toggle background soundtrack
  coffee     - Check DevOps caffeine telemetry
  rm -rf /   - Attempt root directory deletion
  git blame  - Inspect commit responsibility
  docker     - Check active container status
  joke       - Retrieve engineer humor
  theme      - Query active visual system
  matrix     - Run diagnostic binary sequence
  sudo       - Elevate root privileges
  clear      - Reset terminal buffer`,
        });
        break;

      case "veronica":
      case "assistant":
      case "voice":
        newHistory.push({
          type: "output",
          text: `[VERONICA AI VOICE INTERFACE]
• Status: ONLINE & STANDBY
• Interface: Click the 'VERONICA' button in the top navigation bar.
• Voice: Natural synthesis (Web Speech API).
• Commands: Say "Show projects", "Play music", "Tell me about Siva", etc.`,
        });
        break;

      case "loser":
      case "song":
      case "music":
      case "play":
      case "bgm": {
        const isPlaying = sfx.toggleBgm();
        newHistory.push({
          type: "sys",
          text: isPlaying
            ? "🎵 [BGM ACTIVE] Playing 'Loser.mp3' soundtrack! Use 'music' or top Navbar button to toggle."
            : "🔇 [BGM PAUSED] Background music paused.",
        });
        break;
      }

      case "whoami":
        newHistory.push({
          type: "output",
          text: `USER: ${profile.name}
ROLE: ${profile.role}
LOCATION: ${profile.location}
EMAIL: ${profile.email}
PHILOSOPHY: ${profile.philosophy}`,
        });
        break;

      case "hire":
      case "salary":
      case "recruiter":
        newHistory.push({
          type: "output",
          text: `[RECRUITER UPLINK DETECTED]
• Role Target: DevOps Engineer / Infrastructure Architect / Cloud Automation
• Requirements: High uptime, zero 3 AM production outages, continuous learning.
• Status: OPEN for engineering roles & collaborations!
• Contact: Direct email to ${profile.email} or use the Contact page form.`,
        });
        break;

      case "coffee":
      case "caffeine":
        newHistory.push({
          type: "output",
          text: `[CAFFEINE TELEMETRY]
• HTTP Status Code: 418 (I'm a teapot)
• Fuel Level: 98.6% Optimal
• Conversion Rate: 1 Cup Coffee ➔ 500 Lines of Clean Terraform & Zero Production Bugs`,
        });
        break;

      case "rm -rf /":
      case "rm -rf":
      case "rm":
        sfx.playWarning();
        newHistory.push({
          type: "warning",
          text: `[CRITICAL WARNING]
rm: cannot remove '/': Permission denied.
Did you really think I'd let you wipe out production? That's what immutable infrastructure backups are for!`,
        });
        break;

      case "git blame":
      case "blame":
        newHistory.push({
          type: "output",
          text: `f8a3c21 (Siva S  2026-03-01): const uptime = 99.99; // "It worked in staging, and it works in prod."`,
        });
        break;

      case "docker":
      case "docker ps":
        newHistory.push({
          type: "output",
          text: `CONTAINER ID   IMAGE                      STATUS         PORTS
9b2a4c8e1f     siva/smartpanchayat-dapp   Up 42 days     3000/tcp, 8545/tcp (Hardhat)
3c5d7e9a2b     siva/scalable-ecommerce    Up 18 days     80/tcp -> 5000/tcp (Flask)
4e1f7a8b9c     siva/automation-ci:v2      Up 14 days     8080/tcp (Jenkins)
COMMAND: --automate-everything --zero-downtime`,
        });
        break;

      case "joke":
      case "meme":
        newHistory.push({
          type: "output",
          text: `Q: Why do DevOps engineers love dark mode?
A: Because light attracts bugs! (And because the Doom Cyber HUD looks so clean).`,
        });
        break;

      case "theme":
        newHistory.push({
          type: "output",
          text: "ACTIVE VISUAL SYSTEM: DOOM INDUSTRIAL CYBER OS [CONSOLIDATED HIGH-TECH DESIGN]",
        });
        break;

      case "stark":
        newHistory.push({
          type: "output",
          text: "[LEGACY PROTOCOL] Stark mode decommissioned. System unified into DOOM INDUSTRIAL architecture.",
        });
        break;

      case "doom":
        newHistory.push({
          type: "output",
          text: "DOOM INDUSTRIAL CYBER OS operating at 100% capacity.",
        });
        break;

      case "skills":
        newHistory.push({
          type: "output",
          text: skillGroups.map((g) => `[${g.category.toUpperCase()}] ${g.items.join(" • ")}`).join("\n"),
        });
        break;

      case "projects":
        newHistory.push({
          type: "output",
          text: projects.map((p) => `• ${p.title} (${p.category}) - Stack: ${p.stack.join(", ")}`).join("\n"),
        });
        break;

      case "sudo":
      case "sudo su":
        sfx.playWarning();
        newHistory.push({
          type: "warning",
          text: "PERMISSION DENIED: Root access is strictly reserved for automated CI/CD pipelines.",
        });
        break;

      case "matrix":
        newHistory.push({
          type: "output",
          text: "01010011 01001001 01010110 01000001 // SYSTEM DIAGNOSTIC OK // ZERO BOTTLENECKS DETECTED",
        });
        break;

      case "clear":
        setHistory([]);
        setInput("");
        return;

      default:
        sfx.playWarning();
        newHistory.push({
          type: "error",
          text: `Command not recognized: '${rawCmd}'. Type 'help' to see all available commands.`,
        });
    }

    setHistory(newHistory);
    setInput("");
  };

  return (
    <div className="terminal-cli-container panel" onClick={() => inputRef.current?.focus()}>
      <div className="terminal-bar">
        <span />
        <span />
        <span />
        <b>doom-terminal@shell</b>
      </div>

      <div className="terminal-cli-body">
        {history.map((item, idx) => (
          <div key={idx} className={`cli-line cli-${item.type}`}>
            <pre>{item.text}</pre>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form className="terminal-cli-form" onSubmit={handleCommand}>
        <span className="cli-prompt">siva@production:~$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Try 'loser', 'music', 'help', 'hire', 'coffee', 'docker'..."
          className="cli-input"
          autoComplete="off"
          spellCheck="false"
        />
        <button type="submit" className="cli-submit-btn" aria-label="Execute command">
          <CornerDownLeft size={14} />
        </button>
      </form>
    </div>
  );
}
