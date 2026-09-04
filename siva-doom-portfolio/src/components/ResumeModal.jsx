import { useState } from "react";
import { X, Download, Printer, ExternalLink, ShieldCheck, FileText, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { profile, stats, education, experience, projects, skillGroups } from "../data/portfolio";
import { sfx } from "../utils/sfx";
import resumePdf from "./Siva Resume.pdf";

export default function ResumeModal({ isOpen, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    sfx.playClick();
    window.print();
  };

  const handleCopyMarkdown = () => {
    sfx.playClick();
    const md = `# ${profile.name} — ${profile.role}
Email: ${profile.email} | Phone: ${profile.phone} | Location: ${profile.location}
LinkedIn: ${profile.socials.linkedin} | GitHub: ${profile.socials.github}

## SUMMARY
${profile.summary}

## EDUCATION
${education.map((e) => `- ${e.year} | ${e.title}, ${e.place} (${e.detail})`).join("\n")}

## EXPERIENCE
${experience.map((exp) => `### ${exp.role} — ${exp.company} (${exp.period})
${exp.bullets.map((b) => `- ${b}`).join("\n")}`).join("\n\n")}

## KEY PROJECTS
${projects.map((p) => `### ${p.title} (${p.category})
- Stack: ${p.stack.join(", ")}
- Highlights: ${p.highlights.join(" ")}`).join("\n\n")}

## SKILLS
${skillGroups.map((g) => `- **${g.title}**: ${g.items.join(", ")}`).join("\n")}
`;
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <AnimatePresence>
      <motion.div
        className="modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ zIndex: 1200 }}
      >
        <motion.div
          className="modal-container resume-modal-box"
          initial={{ scale: 0.94, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.94, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            maxWidth: "880px",
            background: "rgba(8, 14, 10, 0.96)",
            border: "1px solid var(--accent-secondary)",
            boxShadow: "0 0 50px rgba(57, 230, 139, 0.25)",
            backdropFilter: "blur(20px)",
          }}
        >
          {/* Header Bar */}
          <div className="modal-header" style={{ borderBottom: "1px solid var(--border)", paddingBottom: "16px" }}>
            <div>
              <span className="eyebrow" style={{ color: "var(--accent-secondary)", display: "flex", alignItems: "center", gap: "6px" }}>
                <ShieldCheck size={14} /> TACTICAL DOSSIER // CURRICULUM VITAE
              </span>
              <h2 style={{ fontSize: "1.6rem", margin: "4px 0 0" }}>{profile.name} — Resume</h2>
            </div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
              <a
                href={resumePdf}
                download="Siva Resume.pdf"
                className="btn btn-primary"
                onClick={() => sfx.playClick()}
                style={{ padding: "6px 14px", minHeight: "36px", fontSize: "0.74rem", display: "inline-flex", alignItems: "center", gap: "6px" }}
                title="Download Siva Resume.pdf in 1-click"
              >
                <Download size={14} /> Download PDF
              </a>
              <button
                className="btn btn-secondary"
                onClick={handlePrint}
                style={{ padding: "6px 14px", minHeight: "36px", fontSize: "0.74rem" }}
              >
                <Printer size={14} /> Print
              </button>
              <button
                className="btn btn-secondary"
                onClick={handleCopyMarkdown}
                style={{ padding: "6px 14px", minHeight: "36px", fontSize: "0.74rem" }}
              >
                {copied ? <Check size={14} color="#39e68b" /> : <FileText size={14} />}
                {copied ? "Copied!" : "Copy Text"}
              </button>
              <button
                className="modal-close-btn"
                onClick={onClose}
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Printable Resume Body */}
          <div className="resume-printable-content" style={{ padding: "20px 0", maxHeight: "72vh", overflowY: "auto" }}>
            {/* Header info */}
            <div style={{ borderBottom: "1px solid var(--border-subtle)", paddingBottom: "16px", marginBottom: "20px" }}>
              <h1 style={{ fontSize: "2rem", fontFamily: "var(--font-display)", color: "var(--text-primary)", margin: 0 }}>
                {profile.name}
              </h1>
              <p style={{ color: "var(--accent-secondary)", fontFamily: "var(--font-mono)", fontSize: "0.9rem", fontWeight: 700, margin: "4px 0 10px" }}>
                {profile.role} • Cloud Infrastructure & CI/CD Specialist
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", fontSize: "0.8rem", color: "var(--text-secondary)", fontFamily: "var(--font-mono)" }}>
                <span>📍 {profile.location}</span>
                <span>✉️ {profile.email}</span>
                <span>📞 {profile.phone}</span>
                <a href={profile.socials.linkedin} target="_blank" rel="noreferrer" style={{ color: "var(--accent-secondary)", textDecoration: "underline" }}>
                  LinkedIn
                </a>
                <a href={profile.socials.github} target="_blank" rel="noreferrer" style={{ color: "var(--accent-secondary)", textDecoration: "underline" }}>
                  GitHub
                </a>
              </div>
            </div>

            {/* Profile Summary */}
            <div style={{ marginBottom: "20px" }}>
              <h3 style={{ fontFamily: "var(--font-mono)", fontSize: "0.82rem", color: "var(--accent-secondary)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "6px" }}>
                // EXECUTIVE SUMMARY
              </h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem", lineHeight: "1.6" }}>
                {profile.summary}
              </p>
            </div>

            {/* Technical Skills */}
            <div style={{ marginBottom: "20px" }}>
              <h3 style={{ fontFamily: "var(--font-mono)", fontSize: "0.82rem", color: "var(--accent-secondary)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "8px" }}>
                // TECHNICAL ARSENAL
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "10px" }}>
                {skillGroups.map((g) => (
                  <div key={g.title} style={{ padding: "8px 12px", background: "rgba(0,0,0,0.3)", border: "1px solid var(--border-subtle)" }}>
                    <strong style={{ color: "var(--text-primary)", fontSize: "0.78rem", display: "block" }}>{g.title}</strong>
                    <span style={{ color: "var(--text-muted)", fontSize: "0.74rem", fontFamily: "var(--font-mono)" }}>
                      {g.items.join(", ")}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Professional Experience */}
            <div style={{ marginBottom: "20px" }}>
              <h3 style={{ fontFamily: "var(--font-mono)", fontSize: "0.82rem", color: "var(--accent-secondary)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "10px" }}>
                // WORK EXPERIENCE
              </h3>
              {experience.map((exp) => (
                <div key={exp.company} style={{ marginBottom: "16px", paddingLeft: "12px", borderLeft: "2px solid var(--accent-secondary)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <h4 style={{ margin: 0, fontSize: "0.95rem", color: "var(--text-primary)" }}>
                      {exp.role} <span style={{ color: "var(--accent-secondary)" }}>@ {exp.company}</span>
                    </h4>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--text-muted)" }}>
                      {exp.period}
                    </span>
                  </div>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{exp.mode}</span>
                  <ul style={{ margin: "8px 0 0", paddingLeft: "18px", listStyle: "disc" }}>
                    {exp.bullets.map((b, idx) => (
                      <li key={idx} style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginBottom: "4px" }}>
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Selected Projects */}
            <div style={{ marginBottom: "20px" }}>
              <h3 style={{ fontFamily: "var(--font-mono)", fontSize: "0.82rem", color: "var(--accent-secondary)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "10px" }}>
                // KEY ENGINEERING PROJECTS
              </h3>
              {projects.map((p) => (
                <div key={p.id} style={{ marginBottom: "12px", padding: "10px 14px", background: "rgba(0,0,0,0.25)", border: "1px solid var(--border-subtle)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <h4 style={{ margin: 0, fontSize: "0.92rem", color: "var(--text-primary)" }}>{p.title}</h4>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--accent-tertiary)" }}>{p.category} ({p.year})</span>
                  </div>
                  <p style={{ margin: "4px 0", fontSize: "0.8rem", color: "var(--text-secondary)" }}>{p.description}</p>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--accent-secondary)" }}>
                    Stack: {p.stack.join(" • ")}
                  </span>
                </div>
              ))}
            </div>

            {/* Education */}
            <div>
              <h3 style={{ fontFamily: "var(--font-mono)", fontSize: "0.82rem", color: "var(--accent-secondary)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "10px" }}>
                // EDUCATION & CREDENTIALS
              </h3>
              {education.map((edu) => (
                <div key={edu.title} style={{ marginBottom: "10px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <strong style={{ fontSize: "0.88rem", color: "var(--text-primary)" }}>{edu.title}</strong>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--accent-secondary)" }}>{edu.year}</span>
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>{edu.place}</div>
                  <div style={{ fontSize: "0.74rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{edu.detail}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
