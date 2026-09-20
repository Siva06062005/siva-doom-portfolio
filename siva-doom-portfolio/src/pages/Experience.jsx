import { motion } from "framer-motion";
import PageShell from "../components/PageShell";
import TimelineItem from "../components/TimelineItem";
import SectionDivider from "../components/SectionDivider";
import { experience } from "../data/portfolio";

export default function Experience() {
  return (
    <PageShell
      eyebrow="04 / MISSION DEPLOYMENTS"
      title="Professional Experience"
      intro="Hands-on track record across DevOps infrastructure, cloud automation, container orchestration, and system reliability."
    >
      <section className="section">
        <div className="container">
          {/* Animated timeline line that draws itself */}
          <motion.div
            className="timeline"
            style={{ position: "relative" }}
          >
            <motion.div
              className="timeline-draw-line"
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, amount: 0.05 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            />
            {experience.map((item, i) => (
              <TimelineItem key={item.company} item={item} index={i} />
            ))}
          </motion.div>
        </div>
      </section>
    </PageShell>
  );
}