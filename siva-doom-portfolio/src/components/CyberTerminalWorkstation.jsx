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
  Flame,
} from "lucide-react";
import { profile, projects, skillGroups, certificates } from "../data/portfolio";
import { sfx } from "../utils/sfx";
import "./CyberTerminalWorkstation.css";

// ── SHELL ALIAS MATRIX CONFIGURATION ──────────────────────────
const ALIAS_DATA = [
  // Cloud & DevOps Essentials
  {
    alias: "dockclean",
    cmd: "docker system prune -af --volumes",
    desc: "Purge all stopped containers, unused networks & volumes.",
    category: "DevOps",
  },
  {
    alias: "k8spods",
    cmd: "kubectl get pods -A -o wide --watch",
    desc: "Live monitor all Kubernetes cluster pods across all namespaces.",
    category: "DevOps",
  },
  {
    alias: "klogs",
    cmd: "kubectl logs -f --tail=100 -n production",
    desc: "Follow trailing 100 log lines from production namespace.",
    category: "DevOps",
  },
  {
    alias: "tfapply",
    cmd: "terraform apply -auto-approve",
    desc: "Apply declarative infrastructure changes without confirmation prompt.",
    category: "Cloud",
  },
  {
    alias: "tfplan",
    cmd: "terraform plan -out=tfplan.binary",
    desc: "Generate speculative declarative infrastructure execution plan.",
    category: "Cloud",
  },
  {
    alias: "gitlog",
    cmd: "git log --graph --oneline --decorate --all",
    desc: "Interactive tree graph of all git branches and commits.",
    category: "Git",
  },
  {
    alias: "myip",
    cmd: "curl -s https://icanhazip.com",
    desc: "Fetch public IP address directly to standard output.",
    category: "Network",
  },
  {
    alias: "listenports",
    cmd: "sudo netstat -tulpn | grep LISTEN",
    desc: "Display all active listening TCP/UDP sockets with PIDs.",
    category: "Security",
  },
  {
    alias: "ghostnet",
    cmd: "sudo nmap -sS -PN -n --randomize-hosts",
    desc: "Stealth SYN scan with disabled ping & DNS resolution.",
    category: "Security",
  },
  {
    alias: "memtop",
    cmd: "ps aux --sort=-%mem | head -n 10",
    desc: "Filter and display top 10 memory-consuming active processes.",
    category: "SysAdmin",
  },
  {
    alias: "cputop",
    cmd: "ps aux --sort=-%cpu | head -n 10",
    desc: "Filter and display top 10 CPU-consuming active processes.",
    category: "SysAdmin",
  },
  {
    alias: "rootenv",
    cmd: "sudo -i",
    desc: "Instantly elevate to root interactive shell mode.",
    category: "SysAdmin",
  },
  {
    alias: "kpanic",
    cmd: "sudo sysctl -w kernel.panic=10",
    desc: "Force kernel reboot 10 seconds after system panic.",
    category: "Kernel",
  },
  {
    alias: "devnull",
    cmd: "cat /dev/null >",
    desc: "Instantly wipe target log file without deleting inode.",
    category: "SysAdmin",
  },
];

const BASH_RC_CONFIG = `# ── 0x_KERNEL_PANIC // Production DevOps & Cloud Aliases ──
# Add this snippet to your ~/.bashrc or ~/.zshrc

# Docker & Containers
alias dockclean="docker system prune -af --volumes"
alias dps="docker ps --format 'table {{.Names}}\\t{{.Status}}\\t{{.Ports}}'"

# Kubernetes
alias k="kubectl"
alias k8spods="kubectl get pods -A -o wide --watch"
alias klogs="kubectl logs -f --tail=100"

# Terraform & Cloud
alias tf="terraform"
alias tfapply="terraform apply -auto-approve"
alias tfplan="terraform plan -out=tfplan.binary"

# Network & Security
alias myip="curl -s https://icanhazip.com"
alias ports="sudo netstat -tulpn | grep LISTEN"
alias recon="nmap -sS -PN -n"

# System Diagnostics
alias memtop="ps aux --sort=-%mem | head -n 10"
alias cputop="ps aux --sort=-%cpu | head -n 10"
alias reload="source ~/.bashrc && echo 'Config reloaded!'";`;

const ASCII_BANNER = [
  "  ___        _  _______ ____  _   _ _____ _     ",
  " / _ \\      | |/ / ____|  _ \\| \\ | | ____| |    ",
  "| | | |  _  | ' /|  _| | |_) |  \\| |  _| | |    ",
  "| |_| | | | | . \\| |___|  _ <| |\\  | |___| |___ ",
  " \\___/  |_| |_|\\_\\_____|_| \\_\\_| \\_|_____|_____|",
  " [0x_KERNEL_PANIC] // INTERACTIVE DEVOPS WORKSTATION",
].join("\n");

const getNeofetchOutput = (uptimeStr) => [
  "       .---.          visitor@siva-workstation",
  "      /     \\         ------------------------",
  "     | () () |        OS: Linux Hardened (Kernel 6.8.0-cloud)",
  "      \\  -  /         HOST: Siva Cloud Edge Infrastructure (AWS/GCP)",
  "      / '---'\\        ARCH: x86_64 / Quantum CI Core",
  "     /       \\        UPTIME: " + uptimeStr,
  "    /   | |   \\       SHELL: bash 5.2.21 / vsh 3.2",
  "   (__.-' '-.__)      CPU: Virtual vCPU @ 4.80GHz (16 Cores)",
  "                      MEMORY: 4.2 GB / 16.0 GB (26% Allocated)",
  "                      ORCHESTRATION: Docker 26.1 / Kubernetes 1.30",
  "                      IAC: Terraform 1.8.4 / Ansible",
  "                      STATUS: AVAILABLE FOR NEW OPPORTUNITIES",
].join("\n");

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
      content: ASCII_BANNER,
    },
    {
      type: "welcome",
      content: `Welcome to 0x_KERNEL_PANIC Cyber Terminal Workstation v3.2.
Live guest session connected to Siva S (DevOps & Cloud Systems Architect).
Type 'help' to inspect available system commands, or try 'neofetch', 'about', 'skills', 'projects', 'recon', 'resume'.`,
    },
  ]);

  const canvasRef = useRef(null);
  const terminalOutputRef = useRef(null);
  const terminalInputRef = useRef(null);
  const audioCtxRef = useRef(null);
  const matrixIntervalRef = useRef(null);
  const isInitialMount = useRef(true);
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
    const toastId = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id: toastId, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== toastId));
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
    const handleGlobalKeyDown = (e) => {
      if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [isFullscreen]);

  // Lock body scroll ONLY when in fullscreen
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

  // ── STRICT INTERNAL TERMINAL SCROLLING (PREVENTS WINDOW SCROLL ON ENTER/STARTUP) ──
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    // Only scroll the internal terminal container, NEVER the window!
    if (activeTab === "terminal" && terminalOutputRef.current) {
      terminalOutputRef.current.scrollTop = terminalOutputRef.current.scrollHeight;
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
      // ── PRIMARY VISITOR & GUEST SYSTEM COMMANDS ──
      case "help":
      case "?":
      case "commands":
        newLogs.push({
          type: "help",
          content: [
            { cmd: "about", desc: "Siva S engineering bio, architecture background & focus" },
            { cmd: "skills", desc: "Interactive tech matrix (DevOps, Cloud, C, Python, Security)" },
            { cmd: "projects", desc: "Browse all featured engineering builds & repositories" },
            { cmd: "certs", desc: "Inspect accredited cloud & engineering credentials" },
            { cmd: "resume", desc: "View and download verified engineering resume (PDF)" },
            { cmd: "contact", desc: "Recruiter & client uplink (Email, Phone, Socials)" },
            { cmd: "neofetch", desc: "Display terminal system specs & tech stack ASCII card" },
            { cmd: "recon", desc: "Run simulated port scan & zero-trust security audit" },
            { cmd: "docker", desc: "Query live containerized microservices and status" },
            { cmd: "sysinfo", desc: "Display system hardware, kernel release & memory telemetry" },
            { cmd: "ls", desc: "List virtual filesystem files in workstation" },
            { cmd: "cat <file>", desc: "Read virtual file contents (e.g. 'cat about.txt')" },
            { cmd: "ping <target>", desc: "Ping remote hosts or IP (e.g. ping aws.amazon.com)" },
            { cmd: "curl <url>", desc: "Fetch simulated REST API endpoint payload" },
            { cmd: "whoami", desc: "Display active visitor session telemetry & permissions" },
            { cmd: "aliases", desc: "View production DevOps ~/.bashrc aliases" },
            { cmd: "matrix", desc: "Toggle background Matrix Rain visual overlay" },
            { cmd: "audio", desc: "Toggle Web Audio Synthesizer keyclick sound effects" },
            { cmd: "clear", desc: "Clear terminal console buffer (or Ctrl+L)" },
            { cmd: "banner", desc: "Re-render the 0x_KERNEL_PANIC welcome banner" },
          ],
        });
        break;

      case "about":
      case "bio":
        newLogs.push({
          type: "result",
          content: `// SIVA S — DEVOPS & CLOUD ARCHITECT
${profile.title} based in ${profile.location}.
Specialized in automated CI/CD pipelines, container orchestration (Docker/Kubernetes),
infrastructure as code (Terraform), and high-availability cloud architecture (AWS / GCP).
Obsessed with zero-downtime deployments, bulletproof reliability, and low-level Linux systems.
Email: ${profile.email} | Phone: ${profile.phone}
Type 'skills' to view tech stack or 'projects' to inspect production builds.`,
        });
        break;

      case "whoami":
        newLogs.push({
          type: "result",
          content: `USER: guest@siva-workstation (Third-Party Visitor / Recruiter)
SESSION_ID: 0x_GUEST_${Math.floor(1000 + Math.random() * 9000)}
CLEARANCE: GUEST_EXPLORER (Unrestricted Portfolio Access)
NODE_TARGET: Siva S (DevOps & Cloud Systems Architect)
LOCATION: ${profile.location}
ACTIVE_SHELL: vsh v3.2.0 (POSIX Compatible / WebAssembly Emulated)
STATUS: Ready for exploration. Type 'about', 'skills', 'projects', or 'resume'.`,
        });
        break;

      case "skills":
      case "stack":
      case "tech":
        newLogs.push({
          type: "result",
          content: `// CLOUD & DEVOPS ENGINEERING ARSENAL:
• Cloud Platforms: AWS (EC2, S3, Beanstalk, IAM, VPC), GCP Cloud Engine, Hostinger
• Containers & Orch: Docker, Kubernetes, Containerd, Helm, Docker Compose
• Infrastructure as Code: Terraform (AWS/GCP), Ansible Playbooks
• CI/CD Pipelines: Jenkins Automated Workflows, GitHub Actions
• Languages: C / Kernel C (95%), Python (90%), Bash/POSIX (98%), Go (85%), SQL, Solidity
• Security & Net: eBPF, Nmap, Wireshark, OpenSSL, Iptables, Metasploit, GDB
• OS Environments: Arch Linux, Kali Linux, Debian Hardened, Ubuntu Server, ZFS`,
        });
        break;

      case "neofetch":
      case "fetch":
        newLogs.push({
          type: "result",
          content: getNeofetchOutput(uptimeStr),
        });
        break;

      case "recon":
      case "scan":
      case "nmap":
      case "fsociety":
        newLogs.push({
          type: "result",
          content: `Starting Cyber Reconnaissance Scan v3.2...
Target: siva-portfolio.internal (10.0.4.1)
Host is UP (0.00014s latency).
PORT      STATE SERVICE        SECURITY STATUS
22/tcp    open  ssh            OpenSSH 9.6p1 (ed25519 authenticated)
80/tcp    open  http           nginx/1.24.0 (Cloud Edge Reverse Proxy)
443/tcp   open  https          TLS 1.3 / AES-256-GCM (A+ SSL Labs)
3000/tcp  open  react-ui       Siva Cyber Terminal UI (Vite Build)
8080/tcp  open  jenkins-ci     Automated CI/CD Delivery Pipeline
VULNERABILITIES: 0 detected. All ingress points hardened.
RECON RESULT: Clean architecture. Zero exploitable vectors.`,
        });
        break;

      case "resume":
      case "cv": {
        newLogs.push({
          type: "result",
          content: `[VERIFIED RESUME ARCHIVE]
• Candidate: Siva S (DevOps & Cloud Systems Architect)
• Format: PDF Document (115.42 kB)
• Action: Opening verified resume in new browser tab...
Direct Link: /Siva Resume.pdf`,
        });
        if (typeof window !== "undefined") {
          window.open("/Siva Resume.pdf", "_blank");
        }
        break;
      }

      case "ls":
      case "dir":
        newLogs.push({
          type: "result",
          content: `Mode        LastWriteTime     Length Name
----        -------------     ------ ----
-rw-r--r--  2026-11-09 23:45    1.4K about.txt
-rw-r--r--  2026-11-09 23:45    3.8K skills.json
-rw-r--r--  2026-11-09 23:45    4.2K projects.md
-rw-r--r--  2026-11-09 23:45    2.1K certifications.dat
-rw-r--r--  2026-11-09 23:45  115.4K resume.pdf
-rw-r--r--  2026-11-09 23:45    0.6K contact.vcf
drwxr-xr-x  2026-11-09 23:45       - infrastructure/
(Type 'cat <filename>' to view file contents, e.g. 'cat about.txt')`,
        });
        break;

      case "cat": {
        const targetFile = args[0]?.toLowerCase();
        if (!targetFile) {
          newLogs.push({
            type: "error",
            content: "Usage: cat <filename> (e.g. 'cat about.txt', 'cat skills.json', 'cat contact.vcf')",
          });
        } else if (targetFile === "about.txt") {
          newLogs.push({
            type: "result",
            content: `[about.txt]
Siva S — Cloud & DevOps Infrastructure Architect
Location: ${profile.location}
Email: ${profile.email}
Specializes in high-availability cloud deployments, automated testing pipelines,
Kubernetes cluster management, and Terraform infrastructure as code.`,
          });
        } else if (targetFile === "skills.json") {
          newLogs.push({
            type: "result",
            content: JSON.stringify(
              {
                cloud: ["AWS EC2", "AWS S3", "AWS Beanstalk", "GCP", "Hostinger"],
                containers: ["Docker", "Kubernetes", "Containerd"],
                iac_cicd: ["Terraform", "Jenkins", "Ansible", "GitHub Actions"],
                languages: ["Python", "C", "Bash", "Go", "Solidity", "SQL"],
                security: ["eBPF", "Nmap", "Wireshark", "OpenSSL", "Iptables"],
              },
              null,
              2
            ),
          });
        } else if (targetFile === "projects.md") {
          newLogs.push({
            type: "result",
            content: projects.map((p) => `# ${p.title} [${p.category}]\n${p.shortDesc}\nTech: ${p.stack.join(", ")}`).join("\n\n"),
          });
        } else if (targetFile === "resume.pdf") {
          newLogs.push({
            type: "result",
            content: "[resume.pdf] Binary PDF document. Type 'resume' to view or download.",
          });
        } else if (targetFile === "contact.vcf") {
          newLogs.push({
            type: "result",
            content: `BEGIN:VCARD\nVERSION:3.0\nFN:Siva S\nTITLE:DevOps & Cloud Architect\nEMAIL:${profile.email}\nTEL:${profile.phone}\nEND:VCARD`,
          });
        } else {
          newLogs.push({
            type: "error",
            content: `cat: ${args[0]}: No such file or directory. Type 'ls' to see available files.`,
          });
        }
        break;
      }

      case "pwd":
        newLogs.push({
          type: "result",
          content: "/home/visitor/siva-portfolio",
        });
        break;

      case "date":
      case "time":
        newLogs.push({
          type: "result",
          content: new Date().toUTCString(),
        });
        break;

      case "echo":
        newLogs.push({
          type: "result",
          content: args.join(" ") || "",
        });
        break;

      case "quote":
      case "fortune": {
        const quotes = [
          "\"There are only two hard things in Computer Science: cache invalidation and naming things.\" — Phil Karlton",
          "\"Automation isn't about replacing humans; it's about eliminating manual human error at 3 AM.\" — DevOps Creed",
          "\"Simplicity is prerequisite for reliability.\" — Edsger W. Dijkstra",
          "\"Programs must be written for people to read, and only incidentally for machines to execute.\" — Abelson & Sussman",
        ];
        newLogs.push({
          type: "result",
          content: quotes[Math.floor(Math.random() * quotes.length)],
        });
        break;
      }

      case "curl": {
        const url = args[0] || "api/status";
        newLogs.push({
          type: "result",
          content: `HTTP/2 200 OK
content-type: application/json; charset=utf-8
server: cloud-edge-gateway/1.24.0

{
  "target": "${url}",
  "status": "HEALTHY",
  "engineer": "Siva S",
  "role": "DevOps & Cloud Systems Architect",
  "uptime": "${uptimeStr}",
  "hire_ready": true
}`,
        });
        break;
      }

      // Legacy commands compatibility
      case "cook":
        newLogs.push({
          type: "result",
          content: `[+] Docker compose microservices:
 ✔ Network siva_cloud_net            Created                          0.1s
 ✔ Container siva-api-gateway        Running                          0.3s
 ✔ Container monitoring-prometheus   Running                          0.2s
 ✔ Container production-app-ui       Healthy                          0.2s
[SUCCESS] The lab is online. All microservices healthy and orchestrated.`,
        });
        break;

      case "mayhem":
        newLogs.push({
          type: "result",
          content: `[CLEANUP] Ephemeral state purged. Session memory refreshed. Zero residues.`,
        });
        break;

      case "blue_sky":
      case "bluesky":
        newLogs.push({
          type: "result",
          content: `[CODE PURITY AUDIT]
✔ Syntax validation: PASSED
✔ Memory leaks: 0 detected
✔ Test coverage: 100% nominal
Grade: 99.1% Production Standard. Bulletproof execution.`,
        });
        break;

      case "handles":
        newLogs.push({
          type: "result",
          content: `// REPOSITORY & DEVOPS HANDLES:
• GitHub: https://github.com/
• LinkedIn: https://linkedin.com/
• Node ID: 0x_KERNEL_PANIC // siva-cloud-edge-01`,
        });
        break;

      case "aliases":
        newLogs.push({
          type: "result",
          content: ALIAS_DATA.map((a) => `alias ${a.alias}="${a.cmd}"  # ${a.desc}`).join("\n"),
        });
        break;

      case "sysinfo":
      case "specs":
        newLogs.push({
          type: "result",
          content: `OS: Linux Hardened Cloud Node 6.8.0-custom-x86_64
HOST: siva-portfolio.terminal.internal
UPTIME: ${uptimeStr}
SHELL: vsh 3.2.0 (web-pty)
SECURITY: Level 5 // Zero-Trust Isolation Active
CPU: Quantum Thread Processor @ 4.80GHz (16 Cores)
MEMORY: 4.2 GB / 16.0 GB Allocated (26% Used)
ENCRYPTION: AES-256-GCM Hardware Accelerated (100%)`,
        });
        break;

      case "logs":
        newLogs.push({
          type: "result",
          content: `[INFO] 01:42:10 HTTP GET /portfolio 200 OK (0.84ms)
[INFO] 01:43:05 Guest terminal session initialized from edge network
[INFO] 01:44:00 Docker healthcheck: ALL MICROSERVICES NOMINAL
[INFO] 01:44:22 Zero-trust policy verified. Read-only guest sandbox active.
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
• Candidate: Siva S (Alias: Heisen_Elliot_Durden)
• Purity Grade: 99.1% PURE DevOps Engineering
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
• Fuel Level: 99.1% Optimal
• Conversion Rate: 1 Cup Filter Coffee ➔ 500 Lines of Clean Terraform & Zero Production Bugs`,
        });
        break;

      case "docker":
      case "docker ps":
        newLogs.push({
          type: "result",
          content: `CONTAINER ID   IMAGE                          STATUS         PORTS
9b2a4c8e1f     siva/smartpanchayat-dapp       Up 42 days     3000/tcp, 8545/tcp (Hardhat)
3c5d7e9a2b     siva/scalable-ecommerce        Up 18 days     80/tcp -> 5000/tcp (Flask)
4e1f7a8b9c     siva/automation-ci:v2          Up 14 days     8080/tcp (Jenkins)
5a6b7c8d9e     siva/fakenews-ml-pipeline      Up 10 days     8000/tcp, 3306/tcp (MySQL/TF-IDF)
STATUS: All containers 99.1% pure. Automated restart policies enabled.`,
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
Did you really think I'd let you wipe out production? That's what immutable infrastructure backups are for!
(Try 'mayhem' for Tyler Durden's soap factory cleanup instead).`,
        });
        break;

      case "git blame":
        newLogs.push({
          type: "result",
          content: `f8a3c21 (Siva S  2026-03-01): const purity = 99.1; // "Say my name."`,
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
          content: ASCII_BANNER,
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
          content: `bash: ${trimmed}: command not found. Type 'help' to view valid system commands.`,
        });
    }

    setTerminalLogs(newLogs);
    setInputVal("");
  };

  const handleTerminalSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    executeCommand(inputVal);
    // Directly scroll ONLY the terminal internal viewport
    if (terminalOutputRef.current) {
      terminalOutputRef.current.scrollTop = terminalOutputRef.current.scrollHeight;
    }
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
        "about",
        "skills",
        "stack",
        "projects",
        "certs",
        "resume",
        "cv",
        "contact",
        "hire",
        "neofetch",
        "fetch",
        "recon",
        "scan",
        "docker",
        "sysinfo",
        "whoami",
        "ls",
        "cat",
        "ping",
        "curl",
        "pwd",
        "date",
        "echo",
        "quote",
        "aliases",
        "logs",
        "matrix",
        "audio",
        "clear",
        "banner",
        "coffee",
        "veronica",
        "music",
        "cook",
        "mayhem",
        "fsociety",
        "blue_sky",
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

  const copyBashrc = () => {
    copyToClipboard(BASH_RC_CONFIG, "Bashrc Hacker Configuration", "bashrc-cfg");
  };

  // PS1 Prompt Component
  const renderPS1Prompt = () => (
    <span className="cyber-prompt-line">
      <span className="cyber-purity-tag">[GUEST]</span>
      <span className="cyber-prompt-user">visitor@siva-workstation</span>
      <span className="cyber-prompt-sep">:</span>
      <span className="cyber-prompt-path">~</span>
      <span className="cyber-prompt-dollar">$</span>
    </span>
  );

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
                <span className="cyber-pure-badge">[GUEST EXPLORER]</span>
                <span className="cyber-clearance-badge">LEVEL 1 ACCESS</span>
              </div>
              <p className="cyber-header-subtext">
                <span className="cyber-ping-dot" />
                SYS_ID: <span style={{ color: "var(--cyber-cyan)" }}>siva-cloud-edge-01</span>
                <span style={{ color: "#334155" }}>|</span>
                HOST: <span style={{ color: "var(--cyber-accent)" }}>portfolio.terminal.internal</span>
                <span style={{ color: "#334155" }}>|</span>
                SESSION: <span style={{ color: "var(--cyber-amber)" }}>INTERACTIVE_CLI_V3</span>
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
                    <p>Siva S // DevOps & Cloud Architect</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => copyToClipboard("https://siva-portfolio.dev", "Portfolio URL", "handle-main")}
                  className="cyber-icon-btn"
                  title="Copy Node URL"
                >
                  {copiedKey === "handle-main" ? (
                    <Check size={14} color="var(--cyber-accent)" />
                  ) : (
                    <Copy size={14} />
                  )}
                </button>
              </div>

              {/* Quick Visitor Action Commands */}
              <div className="cyber-handles-section">
                <span className="cyber-handles-label">Quick Visitor Commands</span>
                <div className="cyber-handles-tags">
                  {[
                    "neofetch",
                    "skills",
                    "projects",
                    "recon",
                    "certs",
                    "resume",
                  ].map((cmdName) => (
                    <span
                      key={cmdName}
                      onClick={() => {
                        setActiveTab("terminal");
                        executeCommand(cmdName);
                        setTimeout(() => terminalInputRef.current?.focus(), 60);
                      }}
                      className="cyber-handle-chip"
                      title={`Click to execute '${cmdName}' in terminal`}
                    >
                      ${cmdName}
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
                    <span>DEPLOYMENT READINESS:</span>
                    <strong style={{ color: "var(--cyber-accent)" }}>100% NOMINAL</strong>
                  </div>
                  <div className="cyber-progress-track">
                    <div className="cyber-progress-fill fill-green" style={{ width: "100%" }} />
                  </div>
                </div>

                <div className="cyber-gauge-item">
                  <div className="cyber-gauge-header">
                    <span>MEMORY ALLOCATION:</span>
                    <strong style={{ color: "var(--cyber-cyan)" }}>4.2 GB / 16.0 GB</strong>
                  </div>
                  <div className="cyber-progress-track">
                    <div className="cyber-progress-fill fill-green" style={{ width: "26%" }} />
                  </div>
                </div>

                <div className="cyber-gauge-item">
                  <div className="cyber-gauge-header">
                    <span>SECURITY ENCRYPTION:</span>
                    <strong style={{ color: "var(--cyber-cyan)" }}>AES-256-GCM (100%)</strong>
                  </div>
                  <div className="cyber-progress-track">
                    <div className="cyber-progress-fill fill-cyan" style={{ width: "100%" }} />
                  </div>
                </div>
              </div>

              {/* Quick Execute Neofetch in Terminal */}
              <button
                type="button"
                onClick={() => {
                  setActiveTab("terminal");
                  executeCommand("neofetch");
                  setTimeout(() => terminalInputRef.current?.focus(), 60);
                }}
                className="cyber-quick-exec-btn"
              >
                <Flame size={14} color="#00ff66" />
                RUN 'neofetch' (SYSTEM SPECS)
              </button>
            </div>

            {/* Engineering Manifesto Quote */}
            <div className="cyber-panel cyber-manifesto-card">
              "Automate everything, verify continuously, and deploy with zero downtime. Clean code, immutable infrastructure, and resilient cloud architecture."
              <div className="cyber-manifesto-author">-- Siva S // Engineering Philosophy</div>
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
                        vsh - visitor@siva-workstation:~ (pty/1)
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
                          executeCommand("neofetch");
                        }}
                        className="cyber-term-action-btn cyan-action"
                      >
                        NEOFETCH
                      </button>
                    </div>
                  </div>

                  {/* Terminal Output Area — PURE INTERNAL SCROLL ONLY */}
                  <div className="cyber-terminal-output" ref={terminalOutputRef}>
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
                            {renderPS1Prompt()}
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
                  </div>

                  {/* Terminal Interactive Input Line */}
                  <form onSubmit={handleTerminalSubmit} className="cyber-terminal-inputline">
                    {renderPS1Prompt()}
                    <input
                      ref={terminalInputRef}
                      type="text"
                      value={inputVal}
                      onChange={(e) => setInputVal(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Type 'help', 'neofetch', 'skills', 'projects', 'recon', 'resume'..."
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

            {/* TAB 2: ARCHITECT PROFILE DOSSIER */}
            {activeTab === "profile" && (
              <div className="cyber-tab-pane">
                <div className="cyber-panel cyber-profile-container">
                  <div className="cyber-section-header">
                    <div>
                      <h2>
                        <Fingerprint size={20} color="var(--cyber-accent)" />
                        OPERATIONAL ARCHITECT DOSSIER
                      </h2>
                      <p>Subject: Siva S // Cloud Infrastructure & DevOps Systems Architect</p>
                    </div>
                    <div className="cyber-header-badges">
                      <span className="cyber-pure-badge">[PRODUCTION READY]</span>
                      <span className="cyber-badge-green">STATUS: AVAILABLE FOR HIRE</span>
                      <span className="cyber-badge-cyan">CLOUD NATIVE</span>
                    </div>
                  </div>

                  {/* BASH CONFIGURATION COPY CARD */}
                  <div className="cyber-env-box">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "0.7rem", fontWeight: 800, color: "var(--cyber-cyan)" }}>
                        // PRODUCTION DEVOPS BASH CONFIGURATION (~/.bashrc / ~/.zshrc)
                      </span>
                      <button
                        type="button"
                        onClick={copyBashrc}
                        className="cyber-ctrl-btn"
                        style={{ padding: "4px 10px" }}
                      >
                        {copiedKey === "bashrc-cfg" ? (
                          <Check size={13} color="var(--cyber-accent)" />
                        ) : (
                          <Copy size={13} />
                        )}
                        COPY BASH CONFIG
                      </button>
                    </div>
                    <pre className="cyber-env-code">{BASH_RC_CONFIG}</pre>
                  </div>

                  {/* Bio & Principles */}
                  <div className="cyber-two-col-grid">
                    <div className="cyber-dossier-box">
                      <span className="cyber-dossier-box-title" style={{ color: "var(--cyber-cyan)" }}>
                        // CORE BIO & ARCHITECTURAL FOCUS
                      </span>
                      <p className="cyber-dossier-text">
                        <strong style={{ color: "var(--cyber-accent)" }}>Siva S</strong> is an engineering-driven
                        DevOps and Cloud Systems Architect. Specialized in automated CI/CD pipelines, container orchestration
                        (Docker/Kubernetes), declarative infrastructure as code (Terraform), and high-availability cloud architecture
                        (AWS / GCP). Focused on zero-downtime reliability, proactive security hardening, and low-level Linux systems performance.
                      </p>
                    </div>

                    <div className="cyber-dossier-box">
                      <span className="cyber-dossier-box-title" style={{ color: "var(--cyber-amber)" }}>
                        // OPERATIONAL PRINCIPLES
                      </span>
                      <ul className="cyber-principles-list">
                        <li>
                          <strong>Zero-Downtime Reliability:</strong> Automated healthchecks, multi-region failover, and canary deployment pipelines.
                        </li>
                        <li>
                          <strong>Declarative IaC Discipline:</strong> Complete reproducibility with Terraform, immutable Docker images, and strict GitOps.
                        </li>
                        <li>
                          <strong>Proactive Security Hardening:</strong> Zero-trust network segmentation, eBPF probes, and automated container vulnerability audits.
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Core Disciplines & Competencies */}
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
                      <ShieldCheck size={16} />
                      CORE ENGINEERING DISCIPLINES
                    </h3>

                    <div className="cyber-handles-grid">
                      {[
                        { title: "Terraform & IaC", sub: "Declarative AWS & GCP Infrastructure" },
                        { title: "Kubernetes & Docker", sub: "Production Container Orchestration" },
                        { title: "Jenkins & CI/CD", sub: "Automated Build, Test & Deploy Pipelines" },
                        { title: "Linux Kernel Tuning", sub: "Sysctl, eBPF & Performance Diagnostics" },
                      ].map((item) => (
                        <div key={item.title} className="cyber-handle-card">
                          <div>
                            <div className="cyber-handle-title" style={{ color: "var(--cyber-accent)" }}>
                              {item.title}
                            </div>
                            <div className="cyber-handle-sub">{item.sub}</div>
                          </div>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(item.title, "Skill", item.title)}
                            className="cyber-icon-btn"
                          >
                            {copiedKey === item.title ? (
                              <Check size={14} color="var(--cyber-accent)" />
                            ) : (
                              <Copy size={14} />
                            )}
                          </button>
                        </div>
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
                      <p>Production low-level systems, DevOps infrastructure, and cyber security toolkit</p>
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
                      <p>Production-ready DevOps, Docker, Kubernetes & Cloud terminal shortcuts</p>
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
              NODE_STATUS: ONLINE [PRODUCTION]
            </span>
            <span className="cyber-footer-pipe">|</span>
            <span>
              LATENCY: <strong style={{ color: "#ffffff" }}>{latency}ms</strong>
            </span>
            <span className="cyber-footer-pipe">|</span>
            <span>
              PS1: <strong style={{ color: "var(--cyber-cyan)" }}>[GUEST] visitor@siva-workstation:~$</strong>
            </span>
          </div>

          <div className="cyber-footer-hint">TRY 'help', 'neofetch', 'skills', 'projects', 'recon', 'resume'</div>
        </footer>
      </div>
    </div>
  );
}
