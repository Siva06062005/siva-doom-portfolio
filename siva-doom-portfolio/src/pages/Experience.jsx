import PageShell from "../components/PageShell";
import TimelineItem from "../components/TimelineItem";
import { experience } from "../data/portfolio";

export default function Experience() {
  return (
    <PageShell
      eyebrow="04 / MISSION DEPLOYMENTS"
      title="Professional Experience"
      intro="Hands-on track record across DevOps infrastructure, cloud automation, container orchestration, and system reliability."
    >
      <section className="section">
        <div className="container timeline">
          {experience.map((item, i) => (
            <TimelineItem key={item.company} item={item} index={i} />
          ))}
        </div>
      </section>
    </PageShell>
  );
}