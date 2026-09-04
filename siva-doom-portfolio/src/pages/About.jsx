import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, MapPin, Phone, ArrowRight, Download, ShieldCheck, Award, FileText } from "lucide-react";
import { motion } from "framer-motion";
import PageShell from "../components/PageShell";
import ResumeModal from "../components/ResumeModal";
import resumePdf from "../components/Siva Resume.pdf";
import { profile, education } from "../data/portfolio";
import { sfx } from "../utils/sfx";

export default function About() {
  const [showResume, setShowResume] = useState(false);

  return (
    <PageShell
      eyebrow="01 / PROFILE & DOSSIER"
      title="About the Engineer"
      intro="A computer science graduate with a battle-hardened DevOps mindset — focused on systems, automation, and root-cause reliability."
    >
      <section className="section">
        <div className="container about-grid">
          <motion.div
            className="portrait panel"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            style={{ position: "relative", overflow: "hidden" }}
          >
            {/* Tactical HUD Corner Accents */}
            <div className="hud-corner hud-tl" />
            <div className="hud-corner hud-tr" />
            <div className="hud-corner hud-bl" />
            <div className="hud-corner hud-br" />

            <img
              src="/images/Profile.jpg"
              alt="Siva S profile portrait"
              style={{ objectFit: "cover", width: "100%", height: "100%" }}
            />
            <div className="portrait-label">
              <span className="badge-pulse" /> SIVA S // DEVOPS OPERATOR
            </div>
          </motion.div>

          <motion.div
            className="about-copy"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="eyebrow" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <ShieldCheck size={14} /> IDENTITY FILE // ACTIVE CLEARANCE
            </span>
            <h2>
              Engineering with curiosity. <span className="accent">Operating with discipline.</span>
            </h2>
            <p>
              My work sits at the intersection of modern software development and cloud operations:
              automating infrastructure as code, engineering CI/CD deployment pipelines, managing
              Linux servers, and conducting deep root-cause analysis (RCA) to eliminate production downtime.
            </p>
            <div className="contact-mini">
              <a href={`mailto:${profile.email}`}>
                <Mail size={17} /> {profile.email}
              </a>
              <a href={`tel:${profile.phone}`}>
                <Phone size={17} /> {profile.phone}
              </a>
              <span>
                <MapPin size={17} /> {profile.location}
              </span>
            </div>
            
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "24px" }}>
              <Link className="btn btn-primary" to="/contact" onClick={() => sfx.playClick()}>
                Start a Conversation <ArrowRight size={17} />
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
            </div>
          </motion.div>
        </div>
      </section>

      <section className="section section-dark">
        <div className="container">
          <div className="section-title">
            <span className="eyebrow"><Award size={14} /> ACADEMIC RECORD</span>
            <h2>THE FOUNDATION</h2>
          </div>
          <div className="education-list">
            {education.map((item, i) => (
              <motion.article
                className="education-row panel"
                key={item.year}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: i * 0.08 }}
              >
                <span className="education-year">{item.year}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.place}</p>
                  <small>{item.detail}</small>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Resume Dossier Modal */}
      <ResumeModal isOpen={showResume} onClose={() => setShowResume(false)} />
    </PageShell>
  );
}