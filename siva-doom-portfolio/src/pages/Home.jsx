import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  ArrowDown,
  ArrowRight,
  Terminal,
  Server,
  ShieldCheck,
  Github,
  Download,
  Activity,
  Cpu,
  Layers,
  Sparkles,
  ExternalLink,
  FileText,
} from "lucide-react";
import { motion, useInView, useMotionValue, useTransform } from "framer-motion";
import { profile, stats, projects } from "../data/portfolio";
import ProjectCard from "../components/ProjectCard";
import ProjectModal from "../components/ProjectModal";
import ResumeModal from "../components/ResumeModal";
import MagneticButton from "../components/MagneticButton";
import SectionDivider from "../components/SectionDivider";
import resumePdf from "../components/Siva Resume.pdf";
import { sfx } from "../utils/sfx";

/* ── Reusable animation variants ───────────────────────────── */
const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};

const fadeSlideUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

const fadeSlideLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

const fadeSlideRight = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

/* ── Typewriter component ──────────────────────────────────── */
function TypewriterText({ text, className, delay = 0 }) {
  const [displayedText, setDisplayedText] = useState("");
  const [started, setStarted] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  useEffect(() => {
    if (isInView && !started) {
      const timer = setTimeout(() => setStarted(true), delay);
      return () => clearTimeout(timer);
    }
  }, [isInView, started, delay]);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayedText(text.slice(0, i));
      if (i >= text.length) clearInterval(interval);
    }, 45);
    return () => clearInterval(interval);
  }, [started, text]);

  return (
    <span ref={ref} className={className}>
      {displayedText}
      {started && displayedText.length < text.length && (
        <span className="typewriter-cursor">|</span>
      )}
    </span>
  );
}

/* ── Animated counter ──────────────────────────────────────── */
function AnimatedCounter({ value, suffix = "", duration = 1.5 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!isInView) return;
    const numericMatch = value.match(/[\d.]+/);
    if (!numericMatch) {
      setDisplay(value);
      return;
    }

    const target = parseFloat(numericMatch[0]);
    const prefix = value.slice(0, value.indexOf(numericMatch[0]));
    const rest = value.slice(value.indexOf(numericMatch[0]) + numericMatch[0].length);
    const startTime = performance.now();
    const isFloat = numericMatch[0].includes(".");

    const animate = (now) => {
      const elapsed = (now - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * target;
      setDisplay(`${prefix}${isFloat ? current.toFixed(1) : Math.round(current)}${rest}${suffix}`);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [isInView, value, suffix, duration]);

  return <span ref={ref}>{display}</span>;
}

export default function Home() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [showResume, setShowResume] = useState(false);
  const [termOutput, setTermOutput] = useState("siva@production:~$");
  const [isDeploying, setIsDeploying] = useState(false);

  const handleSimulateDeploy = () => {
    sfx.playKeypress();
    setIsDeploying(true);
    setTermOutput("Running: terraform plan && terraform apply...");
    setTimeout(() => {
      sfx.playSuccess();
      setTermOutput("[SUCCESS] 12 Cloud Nodes Provisioned. Latency 14ms.");
      setIsDeploying(false);
    }, 1200);
  };

  return (
    <>
      <section className="hero" id="top">
        <div className="hero-grid container">
          <motion.div
            className="hero-copy"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.span className="status" variants={fadeSlideUp}>
              <span />
              SYSTEM ONLINE • AVAILABLE FOR DEVOPS ROLES
            </motion.span>

            <motion.p className="kicker" variants={fadeSlideUp}>
              DEVOPS ENGINEER // INFRASTRUCTURE & AUTOMATION
            </motion.p>

            <motion.h1 variants={fadeSlideUp}>
              <TypewriterText text="BUILDING" delay={300} />
              <span className="outline">
                <TypewriterText text=" SYSTEMS" delay={700} />
              </span>
              <br />
              <TypewriterText text="THAT " delay={1100} />
              <span className="accent">
                <TypewriterText text="ENDURE." delay={1300} />
              </span>
            </motion.h1>

            <motion.p className="hero-text" variants={fadeSlideUp}>
              {profile.summary}
            </motion.p>

            <motion.div className="hero-actions" variants={fadeSlideUp}>
              <MagneticButton>
                <a
                  className="btn btn-primary"
                  href="#projects"
                  onClick={(e) => {
                    e.preventDefault();
                    sfx.playClick();
                    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  Explore Projects <ArrowRight size={17} />
                </a>
              </MagneticButton>

              <MagneticButton>
                <a
                  href={resumePdf}
                  download="Siva Resume.pdf"
                  className="btn btn-cyber"
                  onClick={() => sfx.playClick()}
                  title="Download Siva Resume.pdf in 1-click"
                >
                  <Download size={16} /> Download CV (PDF)
                </a>
              </MagneticButton>

              <MagneticButton>
                <button
                  className="btn btn-secondary"
                  type="button"
                  onClick={() => {
                    sfx.playClick();
                    setShowResume(true);
                  }}
                  title="Preview full tactical dossier"
                >
                  <FileText size={16} /> View Dossier
                </button>
              </MagneticButton>

              <MagneticButton>
                <a
                  className="btn btn-secondary"
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    sfx.playClick();
                    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  Let's Connect
                </a>
              </MagneticButton>
            </motion.div>

            <motion.div
              className="hero-terminal"
              onClick={handleSimulateDeploy}
              title="Click to run interactive infrastructure deployment test"
              style={{ cursor: "pointer" }}
              variants={fadeSlideUp}
              whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(57, 230, 139, 0.2)" }}
              whileTap={{ scale: 0.98 }}
            >
              <span>
                <Terminal size={15} /> terminal
              </span>
              <code>$ whoami</code>
              <strong>{termOutput}</strong>
            </motion.div>
          </motion.div>

          <motion.div
            className="hero-visual"
            initial={{ opacity: 0, scale: 0.88, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          >
            <motion.div
              className="armor-frame"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              {/* Tactical HUD Corner Brackets */}
              <div className="hud-corner hud-tl" />
              <div className="hud-corner hud-tr" />
              <div className="hud-corner hud-bl" />
              <div className="hud-corner hud-br" />

              {/* Top Operator Banner */}
              <div className="tactical-operator-badge">
                <span className="badge-pulse" />
                OPERATOR: SIVA S // CLEARANCE: LVL-5
              </div>

              {/* Scanning Laser Beam */}
              <div className="scanline" />

              {/* High Quality Operator Portrait */}
              <img
                src="/images/Siva.jpg"
                alt="Siva S — DevOps Engineer"
              />

              {/* Telemetry HUD Data Chips */}
              <motion.div
                className="hud hud-a"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
              >
                HEALTH
                <br />
                <b>99.9% UPTIME</b>
              </motion.div>

              <motion.div
                className="hud hud-b"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2, duration: 0.5 }}
              >
                STACK
                <br />
                <b>AWS • K8S • DOCKER</b>
              </motion.div>

              <motion.div
                className="hud hud-c"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.4, duration: 0.5 }}
              >
                MODE
                <br />
                <b>PRODUCTION ARMORED</b>
              </motion.div>

              {/* Bottom Tactical Readout */}
              <div className="tactical-bottom-strip">
                <span>SECTOR: <strong>DEVOPS-SEC</strong></span>
                <span>STATUS: <strong>READY</strong></span>
                <span>LATENCY: <strong>14ms</strong></span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        <motion.a
          href="#impact"
          className="scroll-cue"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown size={16} /> SCROLL TO DISCOVER
        </motion.a>
      </section>

      <SectionDivider />

      {/* Stats Section */}
      <section className="section" id="impact">
        <motion.div
          className="container"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          <div className="stats-grid">
            {stats.map(([num, title, text], i) => (
              <motion.div
                className="stat panel panel-3d-hover"
                key={num}
                variants={fadeSlideUp}
                whileHover={{
                  y: -6,
                  boxShadow: "0 20px 60px rgba(57, 230, 139, 0.15), 0 0 30px rgba(57, 230, 139, 0.08)",
                  borderColor: "rgba(57, 230, 139, 0.4)",
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <span className="stat-num">
                  <AnimatedCounter value={num} />
                </span>
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      <SectionDivider />

      {/* Mission Section */}
      <section className="section section-dark">
        <div className="container">
          <div className="split">
            <motion.div
              variants={fadeSlideLeft}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <span className="eyebrow">THE MISSION</span>
              <h2>
                Infrastructure is not background.
                <br />
                <span className="accent">It is the product.</span>
              </h2>
            </motion.div>
            <motion.p
              className="large-copy"
              variants={fadeSlideRight}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              I build, automate and troubleshoot systems across cloud
              infrastructure, CI/CD, containers and Linux environments — with a
              focus on reliability and clean engineering.
            </motion.p>
          </div>

          <motion.div
            className="feature-grid"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {[
              [Server, "DevOps & Cloud", "Terraform • Jenkins • Docker • AWS"],
              [Terminal, "Full Stack Automation", "React • Java • Python • SQL"],
              [ShieldCheck, "System Reliability", "Linux • Troubleshooting • RCA"],
              [Github, "Engineering Projects", "Cloud • Blockchain • Analytics"],
            ].map(([Icon, title, text], i) => (
              <motion.div
                className="feature panel panel-3d-hover"
                key={title}
                variants={fadeSlideUp}
                whileHover={{
                  y: -8,
                  scale: 1.02,
                  boxShadow: "0 20px 60px rgba(57, 230, 139, 0.12)",
                  borderColor: "rgba(57, 230, 139, 0.4)",
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 + i * 0.08, type: "spring", stiffness: 400 }}
                >
                  <Icon size={25} />
                </motion.div>
                <h3>{title}</h3>
                <p>{text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <SectionDivider />

      {/* Selected Work Section */}
      <section className="section">
        <div className="container">
          <motion.div
            className="section-title row-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div>
              <span className="eyebrow">SELECTED WORK</span>
              <h2>FEATURED BUILDS</h2>
            </div>
            <a
              href="#projects"
              className="text-link"
              onClick={(e) => {
                e.preventDefault();
                sfx.playClick();
                document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              View all projects <ArrowRight size={16} />
            </a>
          </motion.div>
          <div className="projects-grid">
            {projects.slice(0, 3).map((p, i) => (
              <ProjectCard
                key={p.title}
                project={p}
                index={i}
                onInspect={(proj) => setSelectedProject(proj)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Resume Modal */}
      <ResumeModal isOpen={showResume} onClose={() => setShowResume(false)} />

      {/* Project Specs Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </>
  );
}