import { useState } from "react";
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
import { motion } from "framer-motion";
import { profile, stats, projects } from "../data/portfolio";
import ProjectCard from "../components/ProjectCard";
import ProjectModal from "../components/ProjectModal";
import ResumeModal from "../components/ResumeModal";
import resumePdf from "../components/Siva Resume.pdf";
import { sfx } from "../utils/sfx";

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
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65 }}
          >
            <span className="status">
              <span />
              SYSTEM ONLINE • AVAILABLE FOR DEVOPS ROLES
            </span>
            <p className="kicker">
              DEVOPS ENGINEER // INFRASTRUCTURE & AUTOMATION
            </p>
            <h1>
              BUILDING
              <span className="outline"> SYSTEMS</span>
              <br />
              THAT <span className="accent">ENDURE.</span>
            </h1>
            <p className="hero-text">{profile.summary}</p>
            
            <div className="hero-actions">
              <Link
                className="btn btn-primary"
                to="/projects"
                onClick={() => sfx.playClick()}
              >
                Explore Projects <ArrowRight size={17} />
              </Link>
              
              <a
                href={resumePdf}
                download="Siva Resume.pdf"
                className="btn btn-cyber"
                onClick={() => sfx.playClick()}
                title="Download Siva Resume.pdf in 1-click"
              >
                <Download size={16} /> Download CV (PDF)
              </a>

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

              <Link
                className="btn btn-secondary"
                to="/contact"
                onClick={() => sfx.playClick()}
              >
                Let's Connect
              </Link>
            </div>

            <div
              className="hero-terminal"
              onClick={handleSimulateDeploy}
              title="Click to run interactive infrastructure deployment test"
              style={{ cursor: "pointer" }}
            >
              <span>
                <Terminal size={15} /> terminal
              </span>
              <code>$ whoami</code>
              <strong>{termOutput}</strong>
            </div>
          </motion.div>

          <motion.div
            className="hero-visual"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
          >
            <div className="armor-frame">
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
              <div className="hud hud-a">
                HEALTH
                <br />
                <b>99.9% UPTIME</b>
              </div>

              <div className="hud hud-b">
                STACK
                <br />
                <b>AWS • K8S • DOCKER</b>
              </div>

              <div className="hud hud-c">
                MODE
                <br />
                <b>PRODUCTION ARMORED</b>
              </div>

              {/* Bottom Tactical Readout */}
              <div className="tactical-bottom-strip">
                <span>SECTOR: <strong>DEVOPS-SEC</strong></span>
                <span>STATUS: <strong>READY</strong></span>
                <span>LATENCY: <strong>14ms</strong></span>
              </div>
            </div>
          </motion.div>
        </div>

        <a href="#impact" className="scroll-cue">
          <ArrowDown size={16} /> SCROLL TO DISCOVER
        </a>
      </section>

      {/* Stats Section */}
      <section className="section" id="impact">
        <div className="container">
          <div className="stats-grid">
            {stats.map(([num, title, text]) => (
              <motion.div
                className="stat panel"
                key={num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: parseInt(num) * 0.08 }}
              >
                <span className="stat-num">{num}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="section section-dark">
        <div className="container">
          <div className="split">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
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
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              I build, automate and troubleshoot systems across cloud
              infrastructure, CI/CD, containers and Linux environments — with a
              focus on reliability and clean engineering.
            </motion.p>
          </div>

          <div className="feature-grid">
            {[
              [Server, "DevOps & Cloud", "Terraform • Jenkins • Docker • AWS"],
              [Terminal, "Full Stack Automation", "React • Java • Python • SQL"],
              [ShieldCheck, "System Reliability", "Linux • Troubleshooting • RCA"],
              [Github, "Engineering Projects", "Cloud • Blockchain • Analytics"],
            ].map(([Icon, title, text], i) => (
              <motion.div
                className="feature panel"
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ delay: i * 0.08 }}
              >
                <Icon size={25} />
                <h3>{title}</h3>
                <p>{text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Selected Work Section */}
      <section className="section">
        <div className="container">
          <div className="section-title row-title">
            <div>
              <span className="eyebrow">SELECTED WORK</span>
              <h2>FEATURED BUILDS</h2>
            </div>
            <Link to="/projects" className="text-link">
              View all projects <ArrowRight size={16} />
            </Link>
          </div>
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