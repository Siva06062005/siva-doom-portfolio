// ═══════════════════════════════════════════════════════════════════
// SIVA S PORTFOLIO — VERONICA / JARVIS ADVANCED AI INTELLIGENCE
// Tactical Voice Directives, Telemetry Diagnostics, Autonomous Control
// ═══════════════════════════════════════════════════════════════════

import { profile, projects, skillGroups, experience, education } from "../data/portfolio";
import { lookupEncyclopedia, encyclopedia } from "../data/encyclopedia";

function getTimeBasedGreeting() {
  const hour = new Date().getHours();
  if (hour >= 4 && hour < 12) {
    return "Good morning";
  } else if (hour >= 12 && hour < 17) {
    return "Good afternoon";
  } else {
    return "Good evening";
  }
}

/**
 * Normalizes speech input by stripping punctuation and extra whitespace.
 */
function cleanSpeech(raw) {
  if (!raw) return "";
  return raw
    .toLowerCase()
    .replace(/[.,?!'"`;:(){}\[\]]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Checks if input contains any of the search phrases or words.
 */
function hasMatch(input, phrases) {
  return phrases.some((p) => input.includes(p));
}

/**
 * Processes a voice transcript and returns { text, action }.
 */
export function processVoiceCommand(rawTranscript) {
  const input = cleanSpeech(rawTranscript);
  if (!input) return null;

  const greeting = getTimeBasedGreeting();

  // ─────────────────────────────────────────────────────────────
  // 1. JARVIS & VERONICA WAKE WORDS, PROTOCOLS & STATUS
  // ─────────────────────────────────────────────────────────────
  if (
    hasMatch(input, [
      "status report",
      "system diagnostic",
      "run diagnostic",
      "run scan",
      "telemetry",
      "system status",
      "diagnostics"
    ])
  ) {
    return {
      text: `Status report: All systems operating at nominal capacity, sir. Cloud endpoints on AWS and GCP are responsive. Docker microservices report 100% health. Ping is 12 milliseconds. Zero security breaches detected. Infrastructure is production ready.`,
      action: null,
    };
  }

  // JARVIS / VERONICA Identity
  if (
    hasMatch(input, [
      "veronica",
      "jarvis",
      "friday",
      "hey veronica",
      "hi veronica",
      "hello veronica",
      "veronika",
      "ronica",
      "monica"
    ])
  ) {
    if (hasMatch(input, ["who are you", "what is your name", "what are you", "introduce yourself"])) {
      return {
        text: `${greeting}, sir. I am Veronica, Siva's tactical AI assistant, engineered alongside his DevOps telemetry. I hold autonomous control over navigation, visual protocols, audio playback, project inspections, and system diagnostics. At your service.`,
        action: null,
      };
    }
    if (hasMatch(input, ["how are you", "how are you doing", "how do you do", "operational"])) {
      return {
        text: `${greeting}, sir. I am operating at 100% capacity. Arc reactor telemetry and cloud pipelines are fully synchronized. How may I direct the system?`,
        action: null,
      };
    }
    return {
      text: `${greeting}, sir. Veronica online. Awaiting your directive. You can say "drop a needle" for music, "status report", "inspect SmartPanchayat", or "pitch Siva".`,
      action: null,
    };
  }

  // ─────────────────────────────────────────────────────────────
  // 2. TACTICAL PROTOCOLS (DOOM / COMBAT / OVERDRIVE)
  // ─────────────────────────────────────────────────────────────
  if (
    hasMatch(input, [
      "protocol stark",
      "activate stark",
      "stark mode",
      "stark theme"
    ])
  ) {
    return {
      text: "Stark protocol has been decommissioned, sir. The system has been unified into the DOOM Industrial Cyber architecture.",
      action: null,
    };
  }

  if (
    hasMatch(input, [
      "protocol doom",
      "activate doom",
      "doom mode",
      "doom theme",
      "lockdown",
      "stealth mode",
      "hacker mode",
      "matrix mode",
      "green theme"
    ])
  ) {
    return {
      text: "Protocol Doom engaged, sir. Industrial cyber terminal matrix deployed.",
      action: { type: "theme", payload: "doom" },
    };
  }

  if (hasMatch(input, ["protocol veronica", "veronica protocol"])) {
    return {
      text: "Veronica protocol active. Autonomous portfolio defense and navigation systems stand ready.",
      action: null,
    };
  }

  if (hasMatch(input, ["switch theme", "toggle theme", "change theme", "next theme"])) {
    return {
      text: "System is permanently configured in Doom Industrial Cyber mode.",
      action: null,
    };
  }

  // ─────────────────────────────────────────────────────────────
  // 3. EXECUTIVE RECRUITER PITCH ("PITCH SIVA")
  // ─────────────────────────────────────────────────────────────
  if (
    hasMatch(input, [
      "pitch siva",
      "sell siva",
      "why hire siva",
      "why should we hire",
      "executive summary",
      "recruiter brief",
      "candidate brief",
      "hire siva"
    ])
  ) {
    return {
      text: "Here is the executive briefing: Siva is a high-performance DevOps Engineer with an 80% Computer Science degree and verified multi-cloud competency in AWS and GCP. He treats infrastructure as software with zero tolerance for production downtime. Whether orchestrating Jenkins CI/CD pipelines, automating Terraform IaC, or tuning Linux kernels, he delivers bulletproof reliability. Shall I open his direct uplink?",
      action: { type: "navigate", payload: "/contact" },
    };
  }

  // ─────────────────────────────────────────────────────────────
  // 4. MUSIC & SOUNDTRACK CONTROLS ("DROP A NEEDLE")
  // ─────────────────────────────────────────────────────────────
  if (
    hasMatch(input, [
      "drop a needle",
      "drop the needle",
      "drop needle",
      "needle drop",
      "drop an eagle",
      "spin a track",
      "spin track",
      "play music",
      "start music",
      "play song",
      "play loser",
      "loser track",
      "put on music",
      "play soundtrack",
      "play bgm",
      "start bgm"
    ])
  ) {
    return {
      text: "Right away, sir. Dropping the needle! Playing Loser dot mp3.",
      action: { type: "music", payload: "play" },
    };
  }

  if (
    hasMatch(input, [
      "lift the needle",
      "lift needle",
      "stop music",
      "pause music",
      "stop the music",
      "pause song",
      "turn off music",
      "silence music",
      "mute music"
    ])
  ) {
    return {
      text: "Lifting the needle, sir. Soundtrack paused.",
      action: { type: "music", payload: "stop" },
    };
  }

  if (hasMatch(input, ["volume up", "louder", "increase volume", "turn it up"])) {
    return {
      text: "Increasing audio volume, sir.",
      action: { type: "volume", payload: 0.2 },
    };
  }

  if (hasMatch(input, ["volume down", "softer", "decrease volume", "turn it down", "quieter"])) {
    return {
      text: "Lowering audio volume, sir.",
      action: { type: "volume", payload: -0.2 },
    };
  }

  if (hasMatch(input, ["toggle music", "switch music"])) {
    return {
      text: "Toggling background audio playback.",
      action: { type: "music", payload: "toggle" },
    };
  }

  // ─────────────────────────────────────────────────────────────
  // 5. PROJECT INSPECTIONS & MODALS (ACTUALLY OPENS MODAL)
  // ─────────────────────────────────────────────────────────────
  if (
    hasMatch(input, [
      "inspect smartpanchayat",
      "open smartpanchayat modal",
      "open smartpanchayat",
      "smartpanchayat modal",
      "smartpanchayat specs"
    ])
  ) {
    return {
      text: "Accessing SmartPanchayat technical specifications, sir. Deploying modal view.",
      action: { type: "modal", payload: "smartpanchayat" },
    };
  }

  if (
    hasMatch(input, [
      "inspect genious shoppy",
      "open genious shoppy modal",
      "open genious shoppy",
      "genious shoppy modal",
      "genious shoppy specs"
    ])
  ) {
    return {
      text: "Accessing Genious Shoppy analytics specifications. Deploying modal view.",
      action: { type: "modal", payload: "genious-shoppy" },
    };
  }

  if (
    hasMatch(input, [
      "inspect scalable ecommerce",
      "open scalable ecommerce modal",
      "open scalable ecommerce",
      "scalable ecommerce specs"
    ])
  ) {
    return {
      text: "Accessing Scalable E-Commerce cloud architecture specifications.",
      action: { type: "modal", payload: "scalable-ecommerce" },
    };
  }

  if (hasMatch(input, ["close modal", "dismiss modal", "close specs", "exit modal", "close window"])) {
    return {
      text: "Closing modal view, sir.",
      action: { type: "close-modal" },
    };
  }

  // General project queries
  if (hasMatch(input, ["smartpanchayat", "smart panchayat", "panchayat", "blockchain project"])) {
    return {
      text: "SmartPanchayat is a decentralized governance dApp built with React, Java, Solidity, and Ethereum. It guarantees 100% immutable fund tracking with sub-12-second confirmations. Opening the project showcase.",
      action: { type: "navigate", payload: "/projects" },
    };
  }

  if (hasMatch(input, ["genious shoppy", "genious", "shoppy", "analytics engine", "rfm"])) {
    return {
      text: "Genious Shoppy is an E-Commerce analytics engine built with Python, RFM matrices, and explainable AI with SHAP and LIME, cutting churn identification time by 40%.",
      action: { type: "navigate", payload: "/projects" },
    };
  }

  if (hasMatch(input, ["scalable ecommerce", "scalable", "flask project", "ecommerce platform"])) {
    return {
      text: "Scalable E-Commerce is a high-availability Flask and MySQL platform utilizing AWS S3 asset buckets and Nginx reverse proxy with CSRF protection.",
      action: { type: "navigate", payload: "/projects" },
    };
  }

  // ─────────────────────────────────────────────────────────────
  // 6. CONTACT AUTOMATION, DIRECT CHANNELS & HOW TO REACH SIVA
  // ─────────────────────────────────────────────────────────────
  if (
    hasMatch(input, [
      "how can contact siva",
      "how can i contact siva",
      "how to contact siva",
      "how do i contact siva",
      "how to reach siva",
      "how can i reach siva",
      "where can i reach siva",
      "how to get in touch with siva",
      "how can we contact siva",
      "contact siva",
      "reach siva",
      "get in touch"
    ])
  ) {
    return {
      text: `You have direct access to Siva through several channels, sir: First, by direct email at ${profile.email}. Second, by phone at ${profile.phone}. Third, via his LinkedIn and GitHub profiles. Or fourth, using the encrypted contact transmission form. Opening the contact uplink for you right now, sir.`,
      action: { type: "focus-contact" },
    };
  }

  if (hasMatch(input, ["what is sivas email", "siva email", "sivas email", "email address", "what is his email"])) {
    return {
      text: `Siva's direct email is ${profile.email}. You can say "send email" to open your mail application directly.`,
      action: null,
    };
  }

  if (hasMatch(input, ["what is sivas phone", "siva phone", "sivas phone", "phone number", "what is his number"])) {
    return {
      text: `Siva's direct telephone number is ${profile.phone}, located in Tamil Nadu, India.`,
      action: null,
    };
  }

  if (
    hasMatch(input, [
      "write message",
      "send message",
      "fill contact",
      "message siva",
      "establish connection",
      "contact form",
      "open contact form"
    ])
  ) {
    return {
      text: "Opening the uplink terminal and focusing transmission parameters for you, sir.",
      action: { type: "focus-contact" },
    };
  }

  // ─────────────────────────────────────────────────────────────
  // 7. SOUND EFFECTS (SFX)
  // ─────────────────────────────────────────────────────────────
  if (hasMatch(input, ["turn on sound effects", "enable sound effects", "enable sfx", "sfx on", "unmute sfx"])) {
    return {
      text: "HUD sensory sound effects enabled, sir.",
      action: { type: "sfx", payload: "on" },
    };
  }
  if (hasMatch(input, ["turn off sound effects", "disable sound effects", "disable sfx", "mute sfx", "sfx off"])) {
    return {
      text: "HUD sound effects disabled.",
      action: { type: "sfx", payload: "off" },
    };
  }

  // ─────────────────────────────────────────────────────────────
  // 8. SCROLLING & VIEWPORT CONTROLS
  // ─────────────────────────────────────────────────────────────
  if (hasMatch(input, ["scroll down", "go down", "page down", "move down"])) {
    return {
      text: "Scrolling down, sir.",
      action: { type: "scroll", payload: "down" },
    };
  }
  if (hasMatch(input, ["scroll up", "go up", "page up", "move up"])) {
    return {
      text: "Scrolling up, sir.",
      action: { type: "scroll", payload: "up" },
    };
  }
  if (hasMatch(input, ["scroll to top", "go to top", "back to top", "top of page", "jump to top"])) {
    return {
      text: "Returning to top of screen.",
      action: { type: "scroll", payload: "top" },
    };
  }
  if (hasMatch(input, ["scroll to bottom", "go to bottom", "scroll to footer", "bottom of page", "jump to footer"])) {
    return {
      text: "Scrolling down to footer telemetry.",
      action: { type: "scroll", payload: "bottom" },
    };
  }

  // ─────────────────────────────────────────────────────────────
  // 9. PAGE NAVIGATION
  // ─────────────────────────────────────────────────────────────
  if (hasMatch(input, ["home", "landing", "main page", "start page", "go home", "take me home"])) {
    return {
      text: "Navigating to home base, sir.",
      action: { type: "navigate", payload: "/" },
    };
  }
  if (hasMatch(input, ["about", "about siva", "who is siva", "biography", "bio page", "profile page", "dossier"])) {
    return {
      text: "Opening Siva's engineering dossier.",
      action: { type: "navigate", payload: "/about" },
    };
  }
  if (hasMatch(input, ["skills", "skill", "tech stack", "arsenal", "technologies", "tools", "technology"])) {
    return {
      text: "Navigating to technical arsenal modules.",
      action: { type: "navigate", payload: "/skills" },
    };
  }
  if (hasMatch(input, ["projects", "project", "work", "builds", "portfolio", "creations"])) {
    return {
      text: "Deploying engineered prototypes showcase.",
      action: { type: "navigate", payload: "/projects" },
    };
  }
  if (hasMatch(input, ["experience", "internship", "internships", "career", "jobs", "work history"])) {
    return {
      text: "Accessing professional experience records.",
      action: { type: "navigate", payload: "/experience" },
    };
  }
  if (hasMatch(input, ["contact", "uplink", "reach out", "connect"])) {
    return {
      text: "Opening direct communication channels.",
      action: { type: "navigate", payload: "/contact" },
    };
  }
  if (
    hasMatch(input, [
      "inbox",
      "open inbox",
      "secure inbox",
      "command inbox",
      "transmission vault",
      "open vault",
      "check messages",
      "view messages",
      "transmissions",
      "check transmissions",
      "send message"
    ])
  ) {
    return {
      text: "Opening direct communication channels to transmit your message to Siva.",
      action: { type: "navigate", payload: "/contact" },
    };
  }


  // ─────────────────────────────────────────────────────────────
  // 10. DEEP TECHNOLOGY ARSENAL
  // ─────────────────────────────────────────────────────────────
  if (hasMatch(input, ["docker", "container", "containers", "containerization"])) {
    return {
      text: "Siva leverages Docker and Docker Compose for microservice containerization, multi-stage optimized builds, and strict environment isolation.",
      action: null,
    };
  }

  if (hasMatch(input, ["terraform", "iac", "infrastructure as code"])) {
    return {
      text: "Siva authors Terraform configurations to provision repeatable, automated cloud infrastructure across AWS and private clouds, eliminating drift.",
      action: null,
    };
  }

  if (hasMatch(input, ["jenkins", "ci cd", "pipeline", "pipelines", "continuous integration"])) {
    return {
      text: "Siva engineers automated CI/CD pipelines in Jenkins, executing build testing, containerization, and zero-downtime production deployment gates.",
      action: null,
    };
  }

  if (hasMatch(input, ["aws", "amazon web services", "cloud", "s3", "ec2"])) {
    return {
      text: "Siva's cloud infrastructure covers AWS EC2, S3 bucket storage, RDS MySQL, and Elastic Beanstalk, engineered for 99.9% availability.",
      action: null,
    };
  }

  if (hasMatch(input, ["linux", "ubuntu", "kali", "kernel", "operating system", "os"])) {
    return {
      text: "Siva operates with deep Linux proficiency in Ubuntu and Kali, including bash scripting, EFI/GRUB boot management, and kernel parameter tuning.",
      action: null,
    };
  }

  if (hasMatch(input, ["solidity", "web3", "smart contract", "ethereum", "blockchain"])) {
    return {
      text: "Siva builds decentralized applications with Solidity smart contracts, Hardhat compilation, and Ethereum immutable ledger verification.",
      action: null,
    };
  }

  if (hasMatch(input, ["python", "java", "react", "languages", "programming"])) {
    return {
      text: "Siva's core languages span Java, Python, React.js, SQL, and Solidity, bridging web apps with automated infrastructure.",
      action: null,
    };
  }

  // ─────────────────────────────────────────────────────────────
  // 11. EXPERIENCE & INTERNSHIPS
  // ─────────────────────────────────────────────────────────────
  if (hasMatch(input, ["burj tech", "burj"])) {
    return {
      text: "At Burj Tech Consultancy, Siva automated cloud provisioning using Terraform, configured Jenkins CI/CD pipelines, and tuned Ubuntu kernel parameters for high throughput.",
      action: { type: "navigate", payload: "/experience" },
    };
  }

  if (hasMatch(input, ["rasa ai", "rasa"])) {
    return {
      text: "At Rasa AI Labs, Siva deployed high-availability AI inference pipelines and built automated resource monitoring scripts for GPU and CPU allocation.",
      action: { type: "navigate", payload: "/experience" },
    };
  }

  if (hasMatch(input, ["remark", "remark skill"])) {
    return {
      text: "At Remark Skill Education, Siva authored modular Python ETL data scripts and predictive machine learning classifiers.",
      action: { type: "navigate", payload: "/experience" },
    };
  }

  // ─────────────────────────────────────────────────────────────
  // 12. EDUCATION & ACADEMICS
  // ─────────────────────────────────────────────────────────────
  if (hasMatch(input, ["education", "college", "degree", "university", "school", "cgpa", "marks", "graduate"])) {
    return {
      text: "Siva graduated with a Bachelor of Engineering in Computer Science from Sriram Engineering College in 2026, earning an 80.0% CGPA with specialization in operating systems and distributed systems.",
      action: { type: "navigate", payload: "/about" },
    };
  }

  // ─────────────────────────────────────────────────────────────
  // 13. DIRECT EXTERNAL LINKS
  // ─────────────────────────────────────────────────────────────
  if (hasMatch(input, ["open github", "github profile", "show github", "go to github"])) {
    return {
      text: "Opening Siva's GitHub repository, sir.",
      action: { type: "link", payload: profile.socials.github },
    };
  }
  if (hasMatch(input, ["open linkedin", "linkedin profile", "show linkedin", "go to linkedin"])) {
    return {
      text: "Opening Siva's LinkedIn profile, sir.",
      action: { type: "link", payload: profile.socials.linkedin },
    };
  }
  if (hasMatch(input, ["send email", "email siva", "mail siva", "write email"])) {
    return {
      text: "Opening email client to Siva, sir.",
      action: { type: "link", payload: `mailto:${profile.email}` },
    };
  }
  if (hasMatch(input, ["call siva", "phone siva", "make a call"])) {
    return {
      text: "Opening direct telephone link, sir.",
      action: { type: "link", payload: `tel:${profile.phone}` },
    };
  }

  // ─────────────────────────────────────────────────────────────
  // 14. TERMINAL CLI COMMANDS
  // ─────────────────────────────────────────────────────────────
  if (hasMatch(input, ["terminal", "cli", "command line", "shell"])) {
    return {
      text: "Deploying interactive command line shell.",
      action: { type: "terminal", payload: "help" },
    };
  }

  const terminalPrefixes = ["run", "execute"];
  for (const prefix of terminalPrefixes) {
    if (input.startsWith(prefix + " ")) {
      const termCmd = input.slice(prefix.length + 1).trim();
      return {
        text: `Executing ${termCmd} subroutine in terminal.`,
        action: { type: "terminal", payload: termCmd },
      };
    }
  }

  // ─────────────────────────────────────────────────────────────
  // 15. FUN / TRIVIA / CASUAL
  // ─────────────────────────────────────────────────────────────
  if (hasMatch(input, ["joke", "funny", "make me laugh", "tell a joke"])) {
    return {
      text: "Why do DevOps engineers prefer dark mode? Because light attracts bugs, and Stark mode looks like Iron Man!",
      action: null,
    };
  }
  if (hasMatch(input, ["coffee", "caffeine"])) {
    return {
      text: "Sensors indicate caffeine reserves are optimal. One espresso translates into 500 lines of clean Terraform code and zero 3 AM production alerts!",
      action: null,
    };
  }
  if (hasMatch(input, ["who created you", "who made you", "who built you"])) {
    return {
      text: "I was engineered by Siva S as his tactical AI counterpart to guide visitors through his DevOps infrastructure and projects.",
      action: null,
    };
  }

  // ─────────────────────────────────────────────────────────────
  // 16. EXIT / SLEEP / STANDBY
  // ─────────────────────────────────────────────────────────────
  if (
    hasMatch(input, [
      "stop listening",
      "close voice",
      "sleep veronica",
      "goodbye veronica",
      "goodbye",
      "bye veronica",
      "shut down voice",
      "turn off voice",
      "exit",
      "sleep",
      "dismiss"
    ])
  ) {
    return {
      text: "Entering standby mode, sir. Click my button or call my name whenever you need me. Standing by.",
      action: { type: "exit" },
    };
  }

  // ─────────────────────────────────────────────────────────────
  // 17. ENGINEERING ENCYCLOPEDIA (TECHNICAL KNOWLEDGE BASE)
  // ─────────────────────────────────────────────────────────────
  if (
    hasMatch(input, [
      "open encyclopedia",
      "browse encyclopedia",
      "tech encyclopedia",
      "encyclopedia topics",
      "what is in the encyclopedia",
      "encyclopedia"
    ])
  ) {
    return {
      text: "Engineering Encyclopedia online, sir. I have detailed technical dossiers on DevOps, Docker, Kubernetes, Terraform, CI/CD, AWS, S3, EC2, Linux kernel tuning, High Availability, Microservices, Nginx, Root Cause Analysis, Blockchain, Ethereum, Smart Contracts, RFM Analytics, Explainable AI, and Zero Downtime Deployments. Ask me to explain any topic, or tap the chips below.",
      action: null,
    };
  }

  // Check if user is asking for definition or explanation of a technical concept
  const encyclopediaMatch = lookupEncyclopedia(input);
  if (encyclopediaMatch) {
    return {
      text: `According to the engineering encyclopedia: ${encyclopediaMatch.summary} In Siva's work: ${encyclopediaMatch.sivaContext}`,
      action: null,
    };
  }

  // ─────────────────────────────────────────────────────────────
  // 18. CAPABILITIES & HELP
  // ─────────────────────────────────────────────────────────────
  if (hasMatch(input, ["help", "what can you do", "commands", "options", "what do you know"])) {
    return {
      text: "You have full voice access, sir. Try: 'Status report', 'Pitch Siva', 'Explain Docker', 'What is Terraform', 'Inspect SmartPanchayat', 'Drop a needle', 'Protocol Stark', or 'Browse encyclopedia'.",
      action: null,
    };
  }

  // ─────────────────────────────────────────────────────────────
  // 18. CONTEXTUAL FALLBACK
  // ─────────────────────────────────────────────────────────────
  return {
    text: `Directive received: "${rawTranscript}". Try asking for a "status report", "pitch Siva", "inspect SmartPanchayat", or "drop a needle".`,
    action: null,
  };
}
