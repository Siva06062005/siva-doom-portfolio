import { useState, useEffect } from "react";
import { ExternalLink } from "lucide-react";
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
          <div className="skills-filter-bar" role="tablist" aria-label="Project filter tabs">
            {projectTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={isActive}
                  className={`filter-btn ${isActive ? "active" : ""}`}
                  onClick={() => {
                    sfx.playClick();
                    setActiveTab(tab.id);
                  }}
                  onMouseEnter={() => sfx.playHover()}
                >
                  <span>{`// ${tab.label}`}</span>
                  {tab.highlight && <span className="tab-pill-accent">LIVE</span>}
                </button>
              );
            })}
          </div>

          {/* SmartPanchayat Quick-Launch Tab Banner */}
          {activeTab === "smartpanchayat" && (
            <div className="project-tab-banner panel" style={{ marginBottom: "26px", padding: "20px 24px" }}>
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
                <a
                  href="https://smart-panchayat-p2tr.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  onClick={() => sfx.playClick()}
                >
                  <ExternalLink size={16} /> Tap for Project Link ↗
                </a>
              </div>
            </div>
          )}

          <div className="projects-grid projects-grid-large">
            {filteredProjects.map((p, i) => (
              <ProjectCard
                key={p.title}
                project={p}
                index={i}
                onInspect={(project) => setSelectedProject(project)}
              />
            ))}
          </div>
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