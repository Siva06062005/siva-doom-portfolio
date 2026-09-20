import { useState, useEffect } from "react";
import { ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PageShell from "../components/PageShell";
import ProjectCard from "../components/ProjectCard";
import ProjectModal from "../components/ProjectModal";
import { projects } from "../data/portfolio";
import { sfx } from "../utils/sfx";

const projectTabs = [
  { id: "ALL", label: "ALL BUILDS" },
  { id: "smartpanchayat", label: "SMARTPANCHAYAT (DAPP)", highlight: true },
  { id: "DATA", label: "DATA & ML" },
  { id: "CLOUD", label: "CLOUD & WEB" },
];

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const fadeSlideUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash.replace("#", "").toLowerCase();
      if (hash === "smartpanchayat" || hash === "smart-panchayat") return "smartpanchayat";
      const params = new URLSearchParams(window.location.search);
      if (params.get("tab")) return params.get("tab");
    }
    return "ALL";
  });

  useEffect(() => {
    const handleOpenModal = (e) => {
      const idOrTitle = (e.detail || "").toLowerCase();
      const match = projects.find(
        (p) => p.id.toLowerCase() === idOrTitle || p.title.toLowerCase().includes(idOrTitle)
      ) || projects[0];
      setSelectedProject(match);
    };

    const handleCloseModal = () => {
      setSelectedProject(null);
    };

    window.addEventListener("open-project-modal", handleOpenModal);
    window.addEventListener("close-project-modal", handleCloseModal);

    return () => {
      window.removeEventListener("open-project-modal", handleOpenModal);
      window.removeEventListener("close-project-modal", handleCloseModal);
    };
  }, []);

  const filteredProjects = projects.filter((p) => {
    if (activeTab === "ALL") return true;
    if (activeTab === "smartpanchayat") return p.id === "smartpanchayat";
    if (activeTab === "DATA") return p.id === "fake-news-pipeline";
    if (activeTab === "CLOUD") return p.id === "genious-shoppy" || p.id === "scalable-ecommerce";
    return true;
  });

  return (
    <PageShell
      eyebrow="03 / BUILDS & ARCHITECTURE"
      title="Selected Projects"
      intro="Production-grade engineering work across cloud infrastructure, CI/CD automation, distributed blockchain ledgers, and analytics. Select any build for operational specs or launch live apps."
    >
      <section className="section" style={{ paddingTop: "10px" }}>
        <div className="container">
          {/* Tactical Project Tabs */}
          <motion.div
            className="skills-filter-bar"
            role="tablist"
            aria-label="Project filter tabs"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {projectTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <motion.button
                  key={tab.id}
                  role="tab"
                  aria-selected={isActive}
                  className={`filter-btn ${isActive ? "active" : ""}`}
                  onClick={() => {
                    sfx.playClick();
                    setActiveTab(tab.id);
                  }}
                  onMouseEnter={() => sfx.playHover()}
                  whileHover={{ y: -2, scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <span>{`// ${tab.label}`}</span>
                  {tab.highlight && <span className="tab-pill-accent">LIVE</span>}
                </motion.button>
              );
            })}
          </motion.div>

          {/* SmartPanchayat Quick-Launch Tab Banner */}
          <AnimatePresence mode="wait">
            {activeTab === "smartpanchayat" && (
              <motion.div
                className="project-tab-banner panel"
                style={{ marginBottom: "26px", padding: "20px 24px" }}
                key="smartpanchayat-banner"
                initial={{ opacity: 0, y: -20, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -20, height: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
                  <div>
                    <span className="eyebrow" style={{ color: "var(--accent-secondary)", display: "flex", alignItems: "center", gap: "6px" }}>
                      <span className="badge-pulse" /> LIVE PRODUCTION DAPP // SMARTPANCHAYAT
                    </span>
                    <h3 style={{ margin: "6px 0 4px", fontSize: "1.25rem" }}>SmartPanchayat Governance Platform</h3>
                    <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                      Deployed on Vercel: <code style={{ color: "var(--accent-secondary)" }}>https://smart-panchayat-p2tr.vercel.app/</code>
                    </p>
                  </div>
                  <motion.a
                    href="https://smart-panchayat-p2tr.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                    onClick={() => sfx.playClick()}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ExternalLink size={16} /> Launch Live Build ↗
                  </motion.a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            className="projects-grid projects-grid-large"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            key={activeTab}
          >
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((p, i) => (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, y: 30, rotateX: 8 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -20 }}
                  transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                >
                  <ProjectCard
                    project={p}
                    index={i}
                    onInspect={(project) => setSelectedProject(project)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Project Specs Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </PageShell>
  );
}