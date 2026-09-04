import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, ShieldCheck, Server, Terminal as TermIcon, Zap, CheckCircle2 } from "lucide-react";
import PageShell from "../components/PageShell";
import SkillGroup from "../components/SkillGroup";
import TerminalCLI from "../components/TerminalCLI";
import { skillGroups } from "../data/portfolio";
import { sfx } from "../utils/sfx";

const categories = ["ALL", "Cloud", "Infrastructure", "Languages", "Blockchain", "Platforms", "Strengths"];

const coreGauges = [
  { name: "Containerization & Docker", level: 94, category: "DevOps", tag: "PROD READY" },
  { name: "Infrastructure as Code (Terraform)", level: 92, category: "IaC", tag: "AUTOMATED" },
  { name: "CI/CD Workflows (Jenkins / Actions)", level: 90, category: "Pipelines", tag: "OPTIMAL" },
  { name: "AWS Cloud (EC2, S3, Beanstalk)", level: 88, category: "Cloud", tag: "SCALABLE" },
  { name: "Linux Administration & Kernel Tuning", level: 95, category: "OS", tag: "HARDENED" },
  { name: "Root-Cause Analysis (RCA) & Reliability", level: 93, category: "Reliability", tag: "ZERO DOWNTIME" },
];

export default function Skills() {
  const [activeCategory, setActiveCategory] = useState("ALL");

  const filteredGroups = activeCategory === "ALL"
    ? skillGroups
    : skillGroups.filter((g) => g.category.toLowerCase() === activeCategory.toLowerCase());

  return (
    <PageShell
      eyebrow="02 / TECHNICAL ARSENAL"
      title="Technology Matrix"
      intro="Automated pipelines, cloud platforms, and operating system disciplines engineered for bulletproof production uptime."
    >
      {/* Live Cyber Proficiency Gauges */}
      <section className="section" style={{ paddingBottom: "30px" }}>
        <div className="container">
          <div className="section-title">
            <span className="eyebrow"><Zap size={14} /> CORE DEVOPS METRICS</span>
            <h2>SYSTEM READINESS GAUGES</h2>
            <p className="large-copy">
              Quantitative proficiency index across critical production engineering disciplines.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "16px", marginTop: "24px" }}>
            {coreGauges.map((g, i) => (
              <motion.div
                key={g.name}
                className="panel"
                style={{ padding: "18px 20px", position: "relative", overflow: "hidden" }}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "var(--accent-secondary)", fontWeight: 700 }}>
                    [{g.category}] // {g.tag}
                  </span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--accent-secondary)", fontWeight: 800 }}>
                    {g.level}%
                  </span>
                </div>
                <h3 style={{ fontSize: "0.95rem", margin: "0 0 12px", fontFamily: "var(--font-display)" }}>
                  {g.name}
                </h3>
                {/* Gauge Progress Bar */}
                <div style={{ height: "6px", background: "rgba(0,0,0,0.5)", borderRadius: "3px", overflow: "hidden", border: "1px solid var(--border-subtle)" }}>
                  <motion.div
                    style={{
                      height: "100%",
                      background: "linear-gradient(90deg, #22d1ee, #39e68b)",
                      boxShadow: "0 0 10px #39e68b",
                    }}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${g.level}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.2 + i * 0.05, ease: "easeOut" }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categorized Skills Grid */}
      <section className="section" style={{ paddingTop: "20px" }}>
        <div className="container">
          <div className="section-title">
            <span className="eyebrow"><Server size={14} /> TOOLCHAIN MODULES</span>
            <h2>TOOLING & ARCHITECTURE</h2>
          </div>

          {/* Category Filter Bar */}
          <div className="skills-filter-bar" role="tablist" aria-label="Skill category filter">
            {categories.map((cat) => (
              <button
                key={cat}
                role="tab"
                aria-selected={activeCategory === cat}
                className={`filter-btn ${activeCategory === cat ? "active" : ""}`}
                onClick={() => {
                  sfx.playClick();
                  setActiveCategory(cat);
                }}
                onMouseEnter={() => sfx.playHover()}
              >
                {cat === "ALL" ? "ALL MODULES" : cat}
              </button>
            ))}
          </div>

          <motion.div className="skills-grid" layout>
            <AnimatePresence>
              {filteredGroups.map((group, i) => (
                <SkillGroup key={group.title} group={group} index={i} />
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Interactive Command Shell */}
      <section className="section section-dark">
        <div className="container">
          <div className="section-title">
            <span className="eyebrow"><TermIcon size={14} /> COMMAND INTERFACE</span>
            <h2>TERMINAL SHELL</h2>
            <p className="large-copy">
              Type real commands into the terminal below (`help`, `whoami`, `skills`, `projects`, `music`, `matrix`, `coffee`, `sudo`).
            </p>
          </div>

          <TerminalCLI />
        </div>
      </section>
    </PageShell>
  );
}