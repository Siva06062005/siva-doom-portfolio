import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, MapPin, Phone, ArrowRight, Download, ShieldCheck, Award, FileText } from "lucide-react";
import { motion } from "framer-motion";
import PageShell from "../components/PageShell";
import ResumeModal from "../components/ResumeModal";
import MagneticButton from "../components/MagneticButton";
import SectionDivider from "../components/SectionDivider";
import resumePdf from "../components/Siva Resume.pdf";
import { profile, education } from "../data/portfolio";
import { sfx } from "../utils/sfx";

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const fadeSlideUp = {
  hidden: { opacity: 0, y: 25 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

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
            initial={{ opacity: 0, x: -40, scale: 0.96 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            style={{ position: "relative", overflow: "hidden" }}
          >
            {/* Tactical HUD Corner Accents */}
            <div className="hud-corner hud-tl" />
            <div className="hud-corner hud-tr" />
            <div className="hud-corner hud-bl" />
            <div className="hud-corner hud-br" />

            <img
              src="/images/Profile.jpeg"
              alt="Siva S profile portrait"
              style={{ objectFit: "cover", width: "100%", height: "100%" }}
            />
            <motion.div
              className="portrait-label"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <span className="badge-pulse" /> SIVA S // DEVOPS OPERATOR
            </motion.div>
          </motion.div>

          <motion.div
            className="about-copy"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
          >
            <motion.span
              className="eyebrow"
              style={{ display: "flex", alignItems: "center", gap: "6px" }}
              variants={fadeSlideUp}
            >
              <ShieldCheck size={14} /> IDENTITY FILE // ACTIVE CLEARANCE
            </motion.span>

            <motion.h2 variants={fadeSlideUp}>
              Engineering with curiosity. <span className="accent">Operating with discipline.</span>
            </motion.h2>

            <motion.p variants={fadeSlideUp}>
              My work sits at the intersection of modern software development and cloud operations:
              automating infrastructure as code, engineering CI/CD deployment pipelines, managing
              Linux servers, and conducting deep root-cause analysis (RCA) to eliminate production downtime.
            </motion.p>

            <motion.div className="contact-mini" variants={staggerContainer}>
              <motion.a href={`mailto:${profile.email}`} variants={fadeSlideUp}>
                <Mail size={17} /> {profile.email}
              </motion.a>
              <motion.a href={`tel:${profile.phone}`} variants={fadeSlideUp}>
                <Phone size={17} /> {profile.phone}
              </motion.a>
              <motion.span variants={fadeSlideUp}>
                <MapPin size={17} /> {profile.location}
              </motion.span>
            </motion.div>

            <motion.div
              style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "24px" }}
              variants={fadeSlideUp}
            >
              <MagneticButton>
                <Link className="btn btn-primary" to="/contact" onClick={() => sfx.playClick()}>
                  Start a Conversation <ArrowRight size={17} />
                </Link>
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
            </motion.div>
          </motion.div>
        </div>
      </section>

      <SectionDivider />

      <section className="section section-dark">
        <div className="container">
          <motion.div
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="eyebrow"><Award size={14} /> ACADEMIC RECORD</span>
            <h2>THE FOUNDATION</h2>
          </motion.div>

          <motion.div
            className="education-list"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {education.map((item, i) => (
              <motion.article
                className="education-row panel panel-3d-hover"
                key={item.year}
                variants={fadeSlideUp}
                whileHover={{
                  y: -4,
                  boxShadow: "0 16px 50px rgba(57, 230, 139, 0.1)",
                  borderColor: "rgba(57, 230, 139, 0.35)",
                }}
              >
                <motion.span
                  className="education-year"
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + i * 0.1, type: "spring", stiffness: 400 }}
                >
                  {item.year}
                </motion.span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.place}</p>
                  <small>{item.detail}</small>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Resume Dossier Modal */}
      <ResumeModal isOpen={showResume} onClose={() => setShowResume(false)} />
    </PageShell>
  );
}