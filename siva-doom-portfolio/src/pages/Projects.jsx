import { useState, useEffect } from "react";
import PageShell from "../components/PageShell";
import ProjectCard from "../components/ProjectCard";
import ProjectModal from "../components/ProjectModal";
import { projects } from "../data/portfolio";

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState(null);

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

  return (
    <PageShell
      eyebrow="03 / BUILDS & ARCHITECTURE"
      title="Selected Projects"
      intro="Production-grade engineering work across cloud infrastructure, CI/CD automation, distributed blockchain ledgers, and analytics. Select any build for operational specs."
    >
      <section className="section">
        <div className="container projects-grid projects-grid-large">
          {projects.map((p, i) => (
            <ProjectCard
              key={p.title}
              project={p}
              index={i}
              onInspect={(project) => setSelectedProject(project)}
            />
          ))}
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