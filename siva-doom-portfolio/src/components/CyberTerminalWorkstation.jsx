import { useState, useRef, useEffect, useCallback } from "react";
import {
  Terminal as TermIcon,
  SquareTerminal,
  UserCheck,
  Cpu,
  Code2,
  Copy,
  Check,
  Search,
  Volume2,
  VolumeX,
  Sparkles,
  Clock,
  Maximize2,
  Minimize2,
  CornerDownLeft,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Fingerprint,
  HardDrive,
  CloudCog,
  FileCode,
  Music,
} from "lucide-react";
import { profile, projects, skillGroups, certificates } from "../data/portfolio";
import { sfx } from "../utils/sfx";
import "./CyberTerminalWorkstation.css";

// ── SHELL ALIAS MATRIX CONFIGURATION ──────────────────────────
const ALIAS_DATA = [
  { alias: "rootenv", cmd: "sudo -i", desc: "Instantly elevate to root interactive shell mode.", category: "SysAdmin" },
  { alias: "kpanic", cmd: "sudo sysctl -w kernel.panic=10", desc: "Force kernel reboot 10 seconds after system panic.", category: "Kernel" },
  { alias: "devnull", cmd: "cat /dev/null >", desc: "Instantly wipe target log file without deleting inode.", category: "Forensics" },
  { alias: "ghostnet", cmd: "sudo nmap -sS -PN -n --randomize-hosts", desc: "Stealth SYN scan with disabled ping & DNS resolution.", category: "Security" },
  { alias: "dockclean", cmd: "docker system prune -af --volumes", desc: "Purge all stopped containers, unused networks & volumes.", category: "DevOps" },
  { alias: "tfapply", cmd: "terraform apply -auto-approve", desc: "Bypass confirmation to rapidly spin cloud infrastructure.", category: "Cloud" },
  { alias: "tfplan", cmd: "terraform plan -out=tfplan.binary", desc: "Generate speculative declarative infrastructure execution plan.", category: "Cloud" },
  { alias: "k8spods", cmd: "kubectl get pods -A -o wide --watch", desc: "Live monitor all Kubernetes cluster pods across namespaces.", category: "DevOps" },
  { alias: "klogs", cmd: "kubectl logs -f --tail=100 -n production", desc: "Follow trailing 100 log lines from production namespace.", category: "DevOps" },
  { alias: "myip", cmd: "curl -s https://icanhazip.com", desc: "Fetch public IP address directly to standard output.", category: "Network" },
  { alias: "listenports", cmd: "sudo netstat -tulpn | grep LISTEN", desc: "Display all active listening TCP/UDP sockets with PIDs.", category: "Security" },
  { alias: "memtop", cmd: "ps aux --sort=-%mem | head -n 10", desc: "Filter top 10 memory-consuming active processes.", category: "SysAdmin" },
];

export default function CyberTerminalWorkstation({ id = "cyber-workstation", initialTab = "terminal" }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [matrixActive, setMatrixActive] = useState(true);
  const [timeUtc, setTimeUtc] = useState("00:00:00 UTC");
  const [uptimeStr, setUptimeStr] = useState("42d 08h 14m 20s");
  const [latency, setLatency] = useState(12);
  const [aliasSearch, setAliasSearch] = useState("");
  const [toasts, setToasts] = useState([]);
  const [copiedKey, setCopiedKey] = useState(null);

  // Terminal state
  const [inputVal, setInputVal] = useState("");
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [terminalLogs, setTerminalLogs] = useState([
    {
      type: "banner",
      content: `  ___ x _ K E R N E L _ P A N I C ___ 
 / _ \\__  _/ ___|/ _ \\/ ___| ____/ ___|
| | | \\ \\/ /|  _| | | |  _|  _|  \\___ \\
| |_| |>  < | |___| |_| |___ |___  ___) |
 \\___//_/\\_\\|_____|\\___/|_____|_____|____/ `,
    },
    {
      type: "welcome",
      content: `Welcome to 0x_KERNEL_PANIC interactive terminal workspace.
Type 'help' to inspect available system commands or press Tab for auto-completion.
DevOps Infrastructure // Low-Level Kernel Diagnostics // Zero-Trust Security.`,
    },
  ]);

  const canvasRef = useRef(null);
  const terminalBottomRef = useRef(null);
  const terminalInputRef = useRef(null);
  const audioCtxRef = useRef(null);
  const matrixIntervalRef = useRef(null);
  const startTimeRef = useRef(Date.now() - (42 * 86400 + 8 * 3600 + 14 * 60 + 20) * 1000);

  // ── WEB AUDIO SYNTHESIZER ───────────────────────────────────
  const initAudioCtx = useCallback(() => {
    if (!audioCtxRef.current && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
  }, []);

  const playSynthKeyclick = useCallback(() => {
    if (!audioEnabled) return;
    try {
      initAudioCtx();
      const ctx = audioCtxRef.current;
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(1200 + Math.random() * 400, ctx.currentTime);
      gain.gain.setValueAtTime(0.015, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.03);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.03);
    } catch {
      // Audio fallback silent
    }
  }, [audioEnabled, initAudioCtx]);

  const playSynthBeep = useCallback(
    (freq = 600, duration = 0.08) => {
      if (!audioEnabled) return;
      try {
        initAudioCtx();
        const ctx = audioCtxRef.current;
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + duration);
      } catch {
        // Audio fallback silent
      }
    },
    [audioEnabled, initAudioCtx]
  );

  const toggleAudio = () => {
    const next = !audioEnabled;
    setAudioEnabled(next);
    if (next) {
      initAudioCtx();
      playSynthBeep(880, 0.08);
      showToast("Web Audio Synthesizer Enabled", "success");
    } else {
      showToast("Audio Muted", "info");
    }
  };

  // ── TOAST HELPER ─────────────────────────────────────────────
  const showToast = (message, type = "info") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2800);
  };

  const copyToClipboard = (text, label = "Item", keyId = null) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        playSynthBeep(1200, 0.08);
        if (keyId) {
          setCopiedKey(keyId);
          setTimeout(() => setCopiedKey(null), 1500);
        }
        showToast(`${label} copied to clipboard!`, "success");
      }).catch(() => {
        showToast("Failed to copy", "error");
      });
    }
  };

  // ── CLOCK, UPTIME & LATENCY TIMERS ──────────────────────────
  useEffect(() => {
    const pad = (n) => String(n).padStart(2, "0");

    const timer = setInterval(() => {
      const now = new Date();
      setTimeUtc(now.toUTCString().split(" ")[4] + " UTC");

      const diffSecs = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const d = Math.floor(diffSecs / 86400);
      const h = Math.floor((diffSecs % 86400) / 3600);
      const m = Math.floor((diffSecs % 3600) / 60);
      const s = diffSecs % 60;
      setUptimeStr(`${pad(d)}d ${pad(h)}h ${pad(m)}m ${pad(s)}s`);
    }, 1000);

    const pingTimer = setInterval(() => {
      setLatency(Math.floor(10 + Math.random() * 6));
    }, 4500);

    return () => {
      clearInterval(timer);
      clearInterval(pingTimer);
    };
  }, []);

  // ── ESCAPE KEY TO EXIT FULLSCREEN ───────────────────────────
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen]);

  // Lock body scroll when in fullscreen
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isFullscreen]);

  // ── MATRIX RAIN CANVAS ENGINE ────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let ctx = null;
    try {
      ctx = canvas.getContext?.("2d");
    } catch {
      ctx = null;
    }
    if (!ctx) return;

    let animationFrameId;
    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth || 800;
        canvas.height = parent.clientHeight || 600;
      }
    };
    resize();
    window.addEventListener("resize", resize);

    const chars = "01ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*0x<>";
    const fontSize = 13;
    let columns = Math.max(1, Math.floor(canvas.width / fontSize));
    let drops = Array(columns).fill(1);

    const render = () => {
      if (!matrixActive) return;
      ctx.fillStyle = "rgba(5, 5, 8, 0.08)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#00ff66";
      ctx.font = `${fontSize}px 'JetBrains Mono', monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    matrixIntervalRef.current = setInterval(render, 45);

    return () => {
      clearInterval(matrixIntervalRef.current);
      window.removeEventListener("resize", resize);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [matrixActive, isFullscreen]);

  // Scroll terminal to bottom on update
  useEffect(() => {
    if (activeTab === "terminal") {
      terminalBottomRef.current?.scrollIntoView?.({ behavior: "smooth" });
    }
  }, [terminalLogs, activeTab]);

  // ── COMMAND ENGINE ──────────────────────────────────────────
  const executeCommand = (raw) => {
    const trimmed = raw.trim();
    if (!trimmed) return;

    playSynthKeyclick();

    // History push
    setCommandHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);

    const parts = trimmed.split(" ");
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    const newLogs = [...terminalLogs, { type: "user", content: trimmed }];

    switch (cmd) {
      case "help":
      case "?":
        newLogs.push({
          type: "help",
          content: [
            { cmd: "whoami", desc: "Display detailed hacker identity & bio profile" },
            { cmd: "handles", desc: "List all registered dark-web codenames & handles" },
            { cmd: "stack", desc: "Show DevOps, Cloud, C & Security tech matrix" },
            { cmd: "aliases", desc: "Print production bash alias configurations" },
            { cmd: "sysinfo", desc: "Display system specs, uptime, and kernel release" },
            { cmd: "logs", desc: "Inspect simulated security breach event stream" },
            { cmd: "ping <target>", desc: "Ping remote cyber nodes (Usage: ping google.com)" },
            { cmd: "projects", desc: "List Siva's production engineering builds" },
            { cmd: "certs", desc: "View verified certifications & credentials" },
            { cmd: "hire", desc: "Recruiter uplink & engineering role telemetry" },
            { cmd: "loser", desc: "Play / Pause 'Loser.mp3' background track 🎵" },
            { cmd: "coffee", desc: "Check DevOps caffeine telemetry & teapot 418" },
            { cmd: "docker", desc: "Query active container status and ports" },
            { cmd: "matrix", desc: "Trigger visual Matrix Rain overlay speed toggle" },
            { cmd: "clear", desc: "Clear terminal console buffer (Or Ctrl+L)" },
            { cmd: "banner", desc: "Re-print initial system welcome banner ASCII" },
          ],
        });
        break;

      case "whoami":
        newLogs.push({
          type: "result",
          content: `USER: ${profile.name} // 0x_KERNEL_PANIC
ROLE: ${profile.role} (DevOps & Cloud Systems Architect)
LOCATION: ${profile.location}
EMAIL: ${profile.email}
PHILOSOPHY: ${profile.philosophy}
CLEARANCE: LEVEL 5 // SEC_STATE: ENCRYPTED (AES-256-GCM)`,
        });
        break;

      case "handles":
        newLogs.push({
          type: "result",
          content: `// REGISTERED ALIAS HANDLES:
1. 0x_KERNEL_PANIC   - Primary Handle // Low-level C & Kernel Fault Tracing
2. ROOT_GHOST        - Privilege Escalation & Root Security Hardening
3. DEV_NULL_VOID     - Forensic Log Neutralization & Ephemeral Containers
4. SUDO_SPECTRE      - Superuser Automation & Hardware Exploits
5. INIT_ZERO         - Complete System Teardown & Immutability`,
        });
        break;

      case "stack":
        newLogs.push({
          type: "result",
          content: `// TECH MATRIX ARSENAL:
• Languages: C / Kernel C (95%), Python (90%), Bash/POSIX (98%), Go (85%), Solidity, SQL
• Cloud & Hosting: AWS (EC2, S3, Beanstalk, IAM), GCP Cloud Engine, Hostinger Cloud
• Infrastructure & DevOps: Terraform (IaC), Docker, Kubernetes, Jenkins Pipelines, Ansible
• Security & Net: eBPF, Nmap, Wireshark, Metasploit, Burp Suite, GDB Reverse Eng, OpenSSL
• OS & Storage: Arch Linux, Kali Linux, Debian Hardened, Ubuntu Server, ZFS, Systemd Tuning`,
        });
        break;

      case "aliases":
        newLogs.push({
          type: "result",
          content: ALIAS_DATA.map((a) => `alias ${a.alias}="${a.cmd}"  # ${a.desc}`).join("\n"),
        });
        break;

      case "sysinfo":
        newLogs.push({
          type: "result",
          content: `OS: Linux kernel-fsociety 6.8.0-custom-x86_64
HOST: Cyber-Node-FSOCIETY-9 (node-us-east-fsociety-09)
UPTIME: ${uptimeStr}
SHELL: zsh 5.9 (x86_64-pc-linux-gnu)
SECURITY: Level 5 // Zero-Trust Memory Isolation Active
CPU: Quantum Thread Processor @ 4.80GHz (16 Cores)
MEMORY: 4.2 GB / 16.0 GB Allocated (26% Used)
ENCRYPTION: AES-256-GCM Hardware Accelerated (100%)`,
        });
        break;

      case "logs":
        newLogs.push({
          type: "result",
          content: `[INFO] 01:42:10 SSH login attempt from 192.168.1.105 - ACCEPTED (Key: ed25519)
[WARN] 01:43:05 Port scan detected on eth0 from 45.33.32.156 -> DROPPED BY IPTABLES
[INFO] 01:44:00 Docker container 'k8s_api_server' healthcheck: OPTIMAL
[CRIT] 01:44:22 Syscall sys_ptrace trapped from unverified PID 4092 -> TERMINATED BY eBPF PROBE
[INFO] 01:45:00 Continuous telemetry telemetry synced with Prometheus daemon.`,
        });
        break;

      case "ping": {
        const target = args[0] || "127.0.0.1";
        newLogs.push({
          type: "result",
          content: `PING ${target} (56 data bytes)
64 bytes from ${target}: icmp_seq=1 ttl=64 time=0.842 ms
64 bytes from ${target}: icmp_seq=2 ttl=64 time=0.612 ms
64 bytes from ${target}: icmp_seq=3 ttl=64 time=0.784 ms
--- ${target} ping statistics ---
3 packets transmitted, 3 received, 0% packet loss, rtt min/avg/max = 0.612/0.746/0.842 ms`,
        });
        break;
      }

      case "projects":
        newLogs.push({
          type: "result",
          content: projects.map((p) => `• ${p.title.toUpperCase()} [${p.category}]
  Stack: ${p.stack.join(", ")}
  Detail: ${p.shortDesc}`).join("\n\n"),
        });
        break;

      case "certs":
      case "certificates":
        newLogs.push({
          type: "result",
          content: certificates.map((c, i) => `${i + 1}. ${c.title.toUpperCase()} (${c.issuer})
   Code: ${c.code} [${c.status}]
   Focus: ${c.badge}
   Link: ${c.credentialUrl}`).join("\n\n"),
        });
        break;

      case "hire":
      case "recruiter":
        newLogs.push({
          type: "result",
          content: `[RECRUITER UPLINK DETECTED]
• Candidate: Siva S (Handle: 0x_KERNEL_PANIC)
• Target Roles: DevOps Engineer / Cloud Infrastructure / Platform Reliability
• Core Disciplines: Terraform IaC, Jenkins CI/CD, Docker/K8s, Linux Kernel Tuning, Zero-Downtime RCA
• Contact: ${profile.email} | Phone: ${profile.phone}
• Status: OPEN for production engineering opportunities!`,
        });
        break;

      case "loser":
      case "music":
      case "song":
      case "bgm": {
        const isPlaying = sfx.toggleBgm();
        newLogs.push({
          type: "result",
          content: isPlaying
            ? "🎵 [BGM ACTIVE] Playing 'Loser.mp3' soundtrack! Use 'music' or top Navbar button to toggle."
            : "🔇 [BGM PAUSED] Background music paused.",
        });
        break;
      }

      case "coffee":
      case "caffeine":
        newLogs.push({
          type: "result",
          content: `[CAFFEINE TELEMETRY]
• HTTP Status Code: 418 (I'm a teapot)
• Fuel Level: 98.6% Optimal
• Conversion Rate: 1 Cup Filter Coffee ➔ 500 Lines of Clean Terraform & Zero Production Bugs`,
        });
        break;

      case "docker":
      case "docker ps":
        newLogs.push({
          type: "result",
          content: `CONTAINER ID   IMAGE                      STATUS         PORTS
9b2a4c8e1f     siva/smartpanchayat-dapp   Up 42 days     3000/tcp, 8545/tcp (Hardhat)
3c5d7e9a2b     siva/scalable-ecommerce    Up 18 days     80/tcp -> 5000/tcp (Flask)
4e1f7a8b9c     siva/automation-ci:v2      Up 14 days     8080/tcp (Jenkins)
5a6b7c8d9e     siva/fakenews-ml-pipeline  Up 10 days     8000/tcp, 3306/tcp (MySQL/TF-IDF)
STATUS: All containers healthy. Automated restart policies enabled.`,
        });
        break;

      case "veronica":
      case "assistant":
        newLogs.push({
          type: "result",
          content: `[VERONICA AI VOICE INTERFACE]
• Status: ONLINE & STANDBY
• Interface: Click the 'VERONICA' button in the top navigation bar or say 'Hey Veronica'.
• Voice: Natural synthesis (Web Speech API).
• Directives: Voice navigation, telemetry inquiry, resume pitching, music control.`,
        });
        break;

      case "rm -rf /":
      case "rm -rf":
        sfx.playWarning();
        newLogs.push({
          type: "error",
          content: `[CRITICAL WARNING]
rm: cannot remove '/': Permission denied.
Did you really think I'd let you wipe out production? That's what immutable infrastructure backups are for!`,
        });
        break;

      case "git blame":
        newLogs.push({
          type: "result",
          content: `f8a3c21 (Siva S  2026-03-01): const uptime = 99.99; // "It worked in staging, and it works in prod."`,
        });
        break;

      case "sudo":
      case "sudo su":
        sfx.playWarning();
        newLogs.push({
          type: "error",
          content: "PERMISSION DENIED: Root access is strictly reserved for automated CI/CD pipelines.",
        });
        break;

      case "matrix":
        setMatrixActive((prev) => !prev);
        newLogs.push({
          type: "result",
          content: `Matrix Rain visual effect toggled ${!matrixActive ? "ON" : "OFF"}.`,
        });
        break;

      case "banner":
        newLogs.push({
          type: "banner",
          content: `  ___ x _ K E R N E L _ P A N I C ___ 
 / _ \\__  _/ ___|/ _ \\/ ___| ____/ ___|
| | | \\ \\/ /|  _| | | |  _|  _|  \\___ \\
| |_| |>  < | |___| |_| |___ |___  ___) |
 \\___//_/\\_\\|_____|\\___/|_____|_____|____/ `,
        });
        break;

      case "clear":
        setTerminalLogs([]);
        setInputVal("");
        return;

      default:
        playSynthBeep(300, 0.12);
        newLogs.push({
          type: "error",
          content: `zsh: command not found: '${trimmed}'. Type 'help' to view valid system commands.`,
        });
    }

    setTerminalLogs(newLogs);
    setInputVal("");
  };

  const handleTerminalSubmit = (e) => {
    e.preventDefault();
    executeCommand(inputVal);
  };

  const handleKeyDown = (e) => {
    playSynthKeyclick();

    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const nextIdx = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(nextIdx);
        setInputVal(commandHistory[nextIdx]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex !== -1) {
        if (historyIndex < commandHistory.length - 1) {
          const nextIdx = historyIndex + 1;
          setHistoryIndex(nextIdx);
          setInputVal(commandHistory[nextIdx]);
        } else {
          setHistoryIndex(-1);
          setInputVal("");
        }
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      const val = inputVal.trim().toLowerCase();
      if (!val) return;
      const cmdList = [
        "help",
        "whoami",
        "handles",
        "stack",
        "aliases",
        "sysinfo",
        "logs",
        "ping",
        "projects",
        "certs",
        "hire",
        "loser",
        "music",
        "coffee",
        "docker",
        "matrix",
        "clear",
        "banner",
        "veronica",
      ];
      const match = cmdList.find((c) => c.startsWith(val));
      if (match) {
        setInputVal(match);
      }
    } else if (e.ctrlKey && e.key === "l") {
      e.preventDefault();
      setTerminalLogs([]);
    }
  };

  // Filtered Aliases
  const filteredAliases = ALIAS_DATA.filter(
    (item) =>
      item.alias.toLowerCase().includes(aliasSearch.toLowerCase()) ||
      item.cmd.toLowerCase().includes(aliasSearch.toLowerCase()) ||
      item.desc.toLowerCase().includes(aliasSearch.toLowerCase()) ||
      item.category.toLowerCase().includes(aliasSearch.toLowerCase())
  );

  const copyAllAliases = () => {
    const fullBlock = ALIAS_DATA.map((a) => `alias ${a.alias}="${a.cmd}" # ${a.desc}`).join("\n");
    copyToClipboard(fullBlock, "All Shell Aliases", "all-aliases");
  };

  return (
    <div
      id={id}
      className={`cyber-workstation-container terminal-cli-container cyber-crt-overlay ${
        isFullscreen ? "is-fullscreen" : ""
      }`}
    >
      {/* Matrix Falling Rain Canvas */}
      <canvas ref={canvasRef} className="cyber-matrix-canvas" />

      {/* Toast Notification Container */}
      <div className="cyber-toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`cyber-toast-item toast-${toast.type}`}>
            <TermIcon size={14} color="var(--cyber-accent)" />
            <span>{toast.message}</span>
          </div>
        ))}
      </div>

      <div className="cyber-workstation-inner">
        {/* TOP SYSTEM HEADER BAR */}
        <header className="cyber-panel cyber-header-bar">
          <div className="cyber-header-left">
            <div className="cyber-avatar-icon">
              <TermIcon size={20} className="neon-glow-green" />
            </div>
            <div className="cyber-header-titles">
              <div className="cyber-header-title-row">
                <h1 className="cyber-sys-title neon-glow-green">0x_KERNEL_PANIC</h1>
                <span className="cyber-clearance-badge">CLEARANCE: LEVEL 5</span>
              </div>
              <p className="cyber-header-subtext">
                <span className="cyber-ping-dot" />
                SYS_ID: <span style={{ color: "var(--cyber-cyan)" }}>node-us-east-fsociety-09</span>
                <span style={{ color: "#334155" }}>|</span>
                SEC_STATE: <span style={{ color: "var(--cyber-accent)" }}>ENCRYPTED</span>
              </p>
            </div>
          </div>

          {/* Quick Action Controls */}
          <div className="cyber-header-controls">
            {/* Audio Toggle */}
            <button
              type="button"
              onClick={toggleAudio}
              className={`cyber-ctrl-btn ${audioEnabled ? "active" : ""}`}
              title="Toggle Synthesized Keyclick Audio"
            >
              {audioEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
              <span>{audioEnabled ? "AUDIO: ON" : "AUDIO: OFF"}</span>
            </button>

            {/* Matrix Rain Toggle */}
            <button
              type="button"
              onClick={() => {
                setMatrixActive(!matrixActive);
                showToast(`Matrix Rain ${!matrixActive ? "Enabled" : "Paused"}`, "info");
              }}
              className={`cyber-ctrl-btn ${matrixActive ? "active" : ""}`}
              title="Toggle Background Matrix Rain FX"
            >
              <Sparkles size={14} />
              <span>FX RAIN</span>
            </button>

            {/* Live UTC Clock */}
            <div className="cyber-clock-box">
              <Clock size={13} />
              <span>{timeUtc}</span>
            </div>

            {/* Fullscreen Cyber Deck Mode Toggle */}
            <button
              type="button"
              onClick={() => {
                setIsFullscreen(!isFullscreen);
                playSynthBeep(1000, 0.05);
              }}
              className="cyber-ctrl-btn"
              title={isFullscreen ? "Exit Fullscreen Cyber Deck (Esc)" : "Expand to Fullscreen Cyber Deck"}
            >
              {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            </button>
          </div>
        </header>

        {/* MAIN WORKSPACE SPLIT GRID */}
        <div className="cyber-workspace-grid">
          {/* LEFT ASIDE: NAVIGATION & QUICK IDENTITY SUMMARY */}
          <aside className="cyber-aside-col">
            {/* Navigation Matrix */}
            <div className="cyber-panel cyber-nav-matrix">
              <div className="cyber-nav-matrix-header">
                <span>// NAVIGATION MATRIX</span>
                <span style={{ color: "var(--cyber-cyan)" }}>SYS_V2.4</span>
              </div>

              <nav className="cyber-nav-btn-grid">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("terminal");
                    playSynthBeep(850, 0.04);
                    setTimeout(() => terminalInputRef.current?.focus(), 50);
                  }}
                  className={`cyber-nav-tab-btn ${activeTab === "terminal" ? "active" : ""}`}
                >
                  <SquareTerminal size={15} />
                  <span>CLI Terminal</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("profile");
                    playSynthBeep(850, 0.04);
                  }}
                  className={`cyber-nav-tab-btn ${activeTab === "profile" ? "active" : ""}`}
                >
                  <UserCheck size={15} />
                  <span>Identity Profile</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("stack");
                    playSynthBeep(850, 0.04);
                  }}
                  className={`cyber-nav-tab-btn ${activeTab === "stack" ? "active" : ""}`}
                >
                  <Cpu size={15} />
                  <span>Tech Stack</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("aliases");
                    playSynthBeep(850, 0.04);
                  }}
                  className={`cyber-nav-tab-btn ${activeTab === "aliases" ? "active" : ""}`}
                >
                  <Code2 size={15} />
                  <span>Shell Aliases</span>
                </button>
              </nav>
            </div>

            {/* Identity Quick Card */}
            <div className="cyber-panel cyber-identity-card">
              <div className="cyber-identity-top">
                <div className="cyber-identity-profile">
                  <div className="cyber-handle-avatar neon-glow-green">
                    0x
                    <div className="cyber-avatar-status-dot" title="Node Online" />
                  </div>
                  <div className="cyber-identity-names">
                    <h3>0x_KERNEL_PANIC</h3>
                    <p>DevOps // SecOps // Low-Level</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => copyToClipboard("0x_KERNEL_PANIC", "Hacker Handle", "handle-main")}
                  className="cyber-icon-btn"
                  title="Copy Handle"
                >
                  {copiedKey === "handle-main" ? (
                    <Check size={14} color="var(--cyber-accent)" />
                  ) : (
                    <Copy size={14} />
                  )}
                </button>
              </div>

              {/* Secondary Handles */}
              <div className="cyber-handles-section">
                <span className="cyber-handles-label">Registered Codenames</span>
                <div className="cyber-handles-tags">
                  {["ROOT_GHOST", "DEV_NULL_VOID", "SUDO_SPECTRE", "INIT_ZERO"].map((alias) => (
                    <span
                      key={alias}
                      onClick={() => copyToClipboard(alias, "Alias", alias)}
                      className="cyber-handle-chip"
                      title="Click to copy alias"
                    >
                      {alias}
                    </span>
                  ))}
                </div>
              </div>

              {/* System Telemetry Gauges */}
              <div className="cyber-telemetry-block">
                <div className="cyber-telemetry-row">
                  <span>UPTIME:</span>
                  <strong style={{ color: "#ffffff", fontFamily: "'JetBrains Mono', monospace" }}>
                    {uptimeStr}
                  </strong>
                </div>

                <div className="cyber-gauge-item">
                  <div className="cyber-gauge-header">
                    <span>MEMORY ALLOCATION:</span>
                    <strong style={{ color: "var(--cyber-accent)" }}>4.2 GB / 16.0 GB</strong>
                  </div>
                  <div className="cyber-progress-track">
                    <div className="cyber-progress-fill fill-green" style={{ width: "26%" }} />
                  </div>
                </div>

                <div className="cyber-gauge-item">
                  <div className="cyber-gauge-header">
                    <span>ENCRYPTION DEGREE:</span>
                    <strong style={{ color: "var(--cyber-cyan)" }}>AES-256-GCM (100%)</strong>
                  </div>
                  <div className="cyber-progress-track">
                    <div className="cyber-progress-fill fill-cyan" style={{ width: "100%" }} />
                  </div>
                </div>
              </div>

              {/* Quick Execute Help in Terminal */}
              <button
                type="button"
                onClick={() => {
                  setActiveTab("terminal");
                  executeCommand("help");
                  setTimeout(() => terminalInputRef.current?.focus(), 60);
                }}
                className="cyber-quick-exec-btn"
              >
                <TermIcon size={14} />
                EXECUTE 'help' IN TERMINAL
              </button>
            </div>

            {/* Cyberpunk Manifesto Quote */}
            <div className="cyber-panel cyber-manifesto-card">
              "Control is an illusion. Software is fragile. We exist in the memory gaps between binary executions."
              <div className="cyber-manifesto-author">-- 0x_KERNEL_PANIC // Manifesto</div>
            </div>
          </aside>

          {/* RIGHT MAIN DISPLAY AREA (4 TABS) */}
          <main className="cyber-main-display">
            {/* TAB 1: INTERACTIVE CLI TERMINAL */}
            {activeTab === "terminal" && (
              <div className="cyber-tab-pane">
                <div className="cyber-terminal-card" onClick={() => terminalInputRef.current?.focus()}>
                  {/* Terminal Header */}
                  <div className="cyber-term-topbar">
                    <div className="cyber-term-dots">
                      <span
                        className="cyber-term-dot dot-magenta"
                        onClick={(e) => {
                          e.stopPropagation();
                          setTerminalLogs([]);
                        }}
                        title="Clear Screen Buffer"
                      />
                      <span className="cyber-term-dot dot-amber" />
                      <span className="cyber-term-dot dot-green" />
                      <span className="cyber-term-prompt-info">
                        <Shield size={13} color="var(--cyber-accent)" />
                        bash - root@0x_KERNEL_PANIC:~ (pty/1)
                      </span>
                    </div>

                    <div className="cyber-term-actions">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setTerminalLogs([]);
                          playSynthBeep(900, 0.05);
                        }}
                        className="cyber-term-action-btn"
                        title="Clear Terminal (Ctrl+L)"
                      >
                        CLEAR
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          executeCommand("sysinfo");
                        }}
                        className="cyber-term-action-btn cyan-action"
                      >
                        SYSINFO
                      </button>
                    </div>
                  </div>

                  {/* Terminal Output Area */}
                  <div className="cyber-terminal-output">
                    {terminalLogs.map((log, idx) => {
                      if (log.type === "banner") {
                        return (
                          <pre key={idx} className="cyber-ascii-banner">
                            {log.content}
                          </pre>
                        );
                      }
                      if (log.type === "welcome") {
                        return (
                          <div key={idx} className="cyber-term-welcome">
                            {log.content}
                            <div className="cyber-term-divider" />
                          </div>
                        );
                      }
                      if (log.type === "user") {
                        return (
                          <div key={idx} className="cyber-echo-line">
                            <span className="cyber-prompt-tag">root@0x_KERNEL_PANIC:~#</span>
                            <span>{log.content}</span>
                          </div>
                        );
                      }
                      if (log.type === "help") {
                        return (
                          <div key={idx} style={{ marginTop: "4px" }}>
                            <div style={{ color: "var(--cyber-accent)", fontWeight: 700, marginBottom: "4px" }}>
                              AVAILABLE SYSTEM COMMANDS:
                            </div>
                            <table className="cyber-term-table">
                              <tbody>
                                {log.content.map((c, ci) => (
                                  <tr key={ci}>
                                    <td className="cmd-name">{c.cmd}</td>
                                    <td className="cmd-desc">{c.desc}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        );
                      }
                      if (log.type === "error") {
                        return (
                          <div key={idx} style={{ color: "var(--cyber-magenta)", fontSize: "0.76rem" }}>
                            {log.content}
                          </div>
                        );
                      }
                      return (
                        <pre key={idx} className="cyber-term-result">
                          {log.content}
                        </pre>
                      );
                    })}
                    <div ref={terminalBottomRef} />
                  </div>

                  {/* Terminal Interactive Input Line */}
                  <form onSubmit={handleTerminalSubmit} className="cyber-terminal-inputline">
                    <span className="cyber-prompt-tag" style={{ fontWeight: 800 }}>
                      root@0x_KERNEL_PANIC:~#
                    </span>
                    <input
                      ref={terminalInputRef}
                      type="text"
                      value={inputVal}
                      onChange={(e) => setInputVal(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Type 'help' or press Tab for auto-completion..."
                      className="cyber-cli-input"
                      autoComplete="off"
                      spellCheck="false"
                    />
                    <button type="submit" className="cyber-run-btn">
                      <CornerDownLeft size={13} style={{ marginRight: "3px" }} />
                      RUN
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* TAB 2: IDENTITY PROFILE DOSSIER */}
            {activeTab === "profile" && (
              <div className="cyber-tab-pane">
                <div className="cyber-panel cyber-profile-container">
                  <div className="cyber-section-header">
                    <div>
                      <h2>
                        <Fingerprint size={20} color="var(--cyber-accent)" />
                        OPERATIONAL IDENTITY DOSSIER
                      </h2>
                      <p>Classification: CLASSIFIED // LEVEL 5 SECURITY CLEARANCE</p>
                    </div>
                    <div className="cyber-header-badges">
                      <span className="cyber-badge-green">STATUS: ACTIVE</span>
                      <span className="cyber-badge-cyan">DARK-NET NODE</span>
                    </div>
                  </div>

                  {/* Bio & Principles */}
                  <div className="cyber-two-col-grid">
                    <div className="cyber-dossier-box">
                      <span className="cyber-dossier-box-title" style={{ color: "var(--cyber-cyan)" }}>
                        // CORE BIO & ALIAS ORIGINS
                      </span>
                      <p className="cyber-dossier-text">
                        Operating under the handle{" "}
                        <strong style={{ color: "var(--cyber-accent)" }}>0x_KERNEL_PANIC</strong>, inspired by
                        low-level Linux fault handles, Elliot Alderson (<em>Mr. Robot</em>), Benjamin Engel (
                        <em>Who Am I</em>), and White Devil (<em>Irumbu Thirai</em>). Engineered with a battle-hardened
                        DevOps mindset: cloud automation, immutable infrastructure, and deep root-cause reliability.
                      </p>
                    </div>

                    <div className="cyber-dossier-box">
                      <span className="cyber-dossier-box-title" style={{ color: "var(--cyber-amber)" }}>
                        // OPERATIONAL PRINCIPLES
                      </span>
                      <ul className="cyber-principles-list">
                        <li>Automate everything, leave zero manual toil.</li>
                        <li>Treat infrastructure as transient immutable code.</li>
                        <li>Verify, sandbox, and log with zero-trust assumptions.</li>
                        <li>
                          Redirect noise traffic directly to <code style={{ color: "var(--cyber-cyan)" }}>/dev/null</code>.
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Registered Codenames Grid */}
                  <div>
                    <h3
                      style={{
                        fontSize: "0.85rem",
                        fontWeight: 700,
                        color: "var(--cyber-cyan)",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        marginBottom: "10px",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <ShieldAlert size={16} />
                      REGISTERED CODENAMES & HANDLES
                    </h3>

                    <div className="cyber-handles-grid">
                      <div className="cyber-handle-card">
                        <div>
                          <div className="cyber-handle-title" style={{ color: "var(--cyber-accent)" }}>
                            0x_KERNEL_PANIC
                          </div>
                          <div className="cyber-handle-sub">Primary Handle // Low-level C & Kernel</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyToClipboard("0x_KERNEL_PANIC", "Handle", "h-0x")}
                          className="cyber-icon-btn"
                        >
                          {copiedKey === "h-0x" ? <Check size={14} color="var(--cyber-accent)" /> : <Copy size={14} />}
                        </button>
                      </div>

                      <div className="cyber-handle-card">
                        <div>
                          <div className="cyber-handle-title" style={{ color: "var(--cyber-cyan)" }}>
                            ROOT_GHOST
                          </div>
                          <div className="cyber-handle-sub">Privilege Escalation & Root Sec</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyToClipboard("ROOT_GHOST", "Handle", "h-rg")}
                          className="cyber-icon-btn"
                        >
                          {copiedKey === "h-rg" ? <Check size={14} color="var(--cyber-cyan)" /> : <Copy size={14} />}
                        </button>
                      </div>

                      <div className="cyber-handle-card">
                        <div>
                          <div className="cyber-handle-title" style={{ color: "var(--cyber-amber)" }}>
                            DEV_NULL_VOID
                          </div>
                          <div className="cyber-handle-sub">Stealth Log Avoidance & Ephemeral</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyToClipboard("DEV_NULL_VOID", "Handle", "h-dn")}
                          className="cyber-icon-btn"
                        >
                          {copiedKey === "h-dn" ? <Check size={14} color="var(--cyber-amber)" /> : <Copy size={14} />}
                        </button>
                      </div>

                      <div className="cyber-handle-card">
                        <div>
                          <div className="cyber-handle-title" style={{ color: "var(--cyber-magenta)" }}>
                            SUDO_SPECTRE
                          </div>
                          <div className="cyber-handle-sub">Hardware & Superuser Exploits</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyToClipboard("SUDO_SPECTRE", "Handle", "h-ss")}
                          className="cyber-icon-btn"
                        >
                          {copiedKey === "h-ss" ? (
                            <Check size={14} color="var(--cyber-magenta)" />
                          ) : (
                            <Copy size={14} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Archetypal Inspirations */}
                  <div className="cyber-inspirations-box">
                    <span
                      style={{
                        fontSize: "0.68rem",
                        fontWeight: 700,
                        color: "#64748b",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                      }}
                    >
                      // ARCHETYPAL INSPIRATIONS & CITATIONS
                    </span>
                    <div className="cyber-inspirations-tags">
                      {[
                        "Elliot Alderson (Mr. Robot)",
                        "Benjamin Engel (Who Am I)",
                        "White Devil (Irumbu Thirai)",
                        "Zero Cool (Hackers 1995)",
                        "Neo (The Matrix)",
                        "Linus Torvalds (Kernel Architect)",
                      ].map((item) => (
                        <span key={item} className="cyber-inspire-pill">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: TECH STACK MATRIX */}
            {activeTab === "stack" && (
              <div className="cyber-tab-pane">
                <div className="cyber-panel cyber-stack-container">
                  <div className="cyber-section-header">
                    <div>
                      <h2>
                        <Cpu size={20} color="var(--cyber-cyan)" />
                        SYSTEM ARCHITECTURE & TECH MATRIX
                      </h2>
                      <p>Low-level systems, DevOps infrastructure, and cyber security toolkit</p>
                    </div>
                  </div>

                  <div className="cyber-two-col-grid">
                    {/* Category 1: Languages & Runtime */}
                    <div className="cyber-stack-category-card">
                      <div className="cyber-stack-cat-title" style={{ color: "var(--cyber-accent)" }}>
                        <Code2 size={16} />
                        Languages & System Runtimes
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        {[
                          { name: "C / Low-level Kernel C", pct: 95 },
                          { name: "Python (Automation / Scapy / AI)", pct: 90 },
                          { name: "Bash / POSIX Shell Scripting", pct: 98 },
                          { name: "Go / Microservices", pct: 85 },
                          { name: "Solidity / Smart Contracts", pct: 80 },
                        ].map((s) => (
                          <div key={s.name} className="cyber-skill-meter-row">
                            <div className="cyber-skill-meter-header">
                              <span>{s.name}</span>
                              <strong style={{ color: "var(--cyber-accent)" }}>{s.pct}%</strong>
                            </div>
                            <div className="cyber-progress-track">
                              <div className="cyber-progress-fill fill-green" style={{ width: `${s.pct}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Category 2: DevOps & Cloud Orchestration */}
                    <div className="cyber-stack-category-card">
                      <div className="cyber-stack-cat-title" style={{ color: "var(--cyber-cyan)" }}>
                        <CloudCog size={16} />
                        DevOps & Cloud Orchestration
                      </div>
                      <div className="cyber-cloud-badges-wrap">
                        {[
                          "Docker Containers",
                          "Kubernetes Cluster",
                          "Terraform (IaC)",
                          "Jenkins CI/CD",
                          "AWS EC2 / S3 / Beanstalk",
                          "GCP Cloud Engine",
                          "Ansible Playbooks",
                          "Prometheus / Grafana",
                          "CI/CD Workflows",
                          "Hostinger Cloud",
                        ].map((b) => (
                          <span key={b} className="cyber-cloud-badge">
                            {b}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Category 3: Security & Network Tools */}
                    <div className="cyber-stack-category-card">
                      <div className="cyber-stack-cat-title" style={{ color: "var(--cyber-amber)" }}>
                        <ShieldCheck size={16} />
                        Security & Reconnaissance Tools
                      </div>
                      <div className="cyber-tools-2col-grid">
                        {[
                          "Nmap / Wireshark",
                          "Metasploit Framework",
                          "Burp Suite Pro",
                          "GDB / Reverse Eng",
                          "eBPF / Kernel Probes",
                          "OpenSSL / Crypto",
                          "Iptables / UFW",
                          "Hardhat Web3",
                        ].map((tool) => (
                          <div key={tool} className="cyber-tool-cell">
                            {tool}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Category 4: OS Kernels & Storage */}
                    <div className="cyber-stack-category-card">
                      <div className="cyber-stack-cat-title" style={{ color: "var(--cyber-magenta)" }}>
                        <HardDrive size={16} />
                        OS Kernels & Storage Architecture
                      </div>
                      <div className="cyber-kernel-specs-list">
                        <div className="cyber-kernel-spec-row">
                          <span>Arch Linux / Kali Linux</span>
                          <span style={{ color: "var(--cyber-magenta)" }}>Primary Host</span>
                        </div>
                        <div className="cyber-kernel-spec-row">
                          <span>Debian Server Hardening</span>
                          <span style={{ color: "var(--cyber-magenta)" }}>Infrastructure</span>
                        </div>
                        <div className="cyber-kernel-spec-row">
                          <span>ZFS / RAID Array Mgt</span>
                          <span style={{ color: "var(--cyber-magenta)" }}>Storage</span>
                        </div>
                        <div className="cyber-kernel-spec-row">
                          <span>Systemd / Kernel Sysctl Tuning</span>
                          <span style={{ color: "var(--cyber-magenta)" }}>Performance</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: SHELL ALIAS MATRIX */}
            {activeTab === "aliases" && (
              <div className="cyber-tab-pane">
                <div className="cyber-panel cyber-aliases-container">
                  <div className="cyber-section-header">
                    <div>
                      <h2>
                        <FileCode size={20} color="var(--cyber-accent)" />
                        SHELL ALIAS MATRIX (.bashrc / .zshrc)
                      </h2>
                      <p>Custom production DevOps & dark-web command shortcuts</p>
                    </div>

                    <button
                      type="button"
                      onClick={copyAllAliases}
                      className="cyber-ctrl-btn"
                      style={{
                        background: "rgba(0, 255, 102, 0.15)",
                        borderColor: "var(--cyber-accent)",
                        color: "var(--cyber-accent)",
                      }}
                    >
                      {copiedKey === "all-aliases" ? <Check size={14} /> : <Copy size={14} />}
                      COPY ALL ALIASES
                    </button>
                  </div>

                  {/* Search Filter */}
                  <div className="cyber-alias-search-wrap">
                    <Search size={15} className="cyber-alias-search-icon" />
                    <input
                      type="text"
                      value={aliasSearch}
                      onChange={(e) => setAliasSearch(e.target.value)}
                      placeholder="Search alias name, command or category..."
                      className="cyber-alias-search-input"
                    />
                  </div>

                  {/* Alias List */}
                  <div className="cyber-alias-cards-list">
                    {filteredAliases.length === 0 ? (
                      <div style={{ textAlign: "center", padding: "24px 0", fontSize: "0.75rem", color: "#64748b" }}>
                        No aliases found matching '{aliasSearch}'.
                      </div>
                    ) : (
                      filteredAliases.map((item) => (
                        <div key={item.alias} className="cyber-alias-card">
                          <div className="cyber-alias-info">
                            <div className="cyber-alias-tagline">
                              <span className="cyber-alias-name">alias {item.alias}</span>
                              <span className="cyber-alias-cat">{item.category}</span>
                            </div>
                            <div className="cyber-alias-cmd" title={item.cmd}>
                              $ {item.cmd}
                            </div>
                            <div className="cyber-alias-desc"># {item.desc}</div>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              copyToClipboard(
                                `alias ${item.alias}="${item.cmd}" # ${item.desc}`,
                                `Alias ${item.alias}`,
                                item.alias
                              )
                            }
                            className="cyber-ctrl-btn"
                            style={{ flexShrink: 0 }}
                          >
                            {copiedKey === item.alias ? (
                              <Check size={13} color="var(--cyber-accent)" />
                            ) : (
                              <Copy size={13} />
                            )}
                            COPY
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>

        {/* FOOTER SECURITY STATUS BAR */}
        <footer className="cyber-panel cyber-footer-bar">
          <div className="cyber-footer-left">
            <span className="cyber-footer-status">
              <span className="cyber-ping-dot" />
              NODE_STATUS: ONLINE
            </span>
            <span className="cyber-footer-pipe">|</span>
            <span>
              LATENCY: <strong style={{ color: "#ffffff" }}>{latency}ms</strong>
            </span>
            <span className="cyber-footer-pipe">|</span>
            <span>
              SHELL: <strong style={{ color: "var(--cyber-cyan)" }}>zsh 5.9 (x86_64-pc-linux-gnu)</strong>
            </span>
          </div>

          <div className="cyber-footer-hint">ENTER 'help' FOR COMMAND LIST</div>
        </footer>
      </div>
    </div>
  );
}
