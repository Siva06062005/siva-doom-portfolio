import { motion } from "framer-motion";

export default function SectionDivider() {
  return (
    <div className="section-divider-wrap" aria-hidden="true">
      <motion.div
        className="section-divider-line"
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.div
        className="section-divider-dot"
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.4, delay: 0.3, ease: "backOut" }}
      />
    </div>
  );
}
