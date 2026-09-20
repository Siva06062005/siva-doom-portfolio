import { Github, Linkedin, Instagram, Mail, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { profile } from "../data/portfolio";
import { sfx } from "../utils/sfx";

const socialLinks = [
  { href: profile.socials.github, Icon: Github, label: "GitHub Profile" },
  { href: profile.socials.linkedin, Icon: Linkedin, label: "LinkedIn Profile" },
  { href: profile.socials.instagram, Icon: Instagram, label: "Instagram Profile" },
  { href: `mailto:${profile.email}`, Icon: Mail, label: "Send Email" },
  { href: "#top", Icon: ArrowUpRight, label: "Back to top" },
];

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const iconVariant = {
  hidden: { opacity: 0, y: 15, scale: 0.7 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
};

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="footer-brand">
            <img src="/images/logo.png" alt="SIVA Logo" className="footer-logo-img" />
            <span>SIVA<span className="accent">.</span>S</span>
          </div>
          <p>
            Engineering reliable, scalable systems with zero tolerance for downtime.
          </p>
        </motion.div>

        <motion.div
          className="footer-links"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
        >
          {socialLinks.map(({ href, Icon, label }) => (
            <motion.a
              key={label}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noreferrer" : undefined}
              aria-label={label}
              onClick={() => sfx.playClick()}
              variants={iconVariant}
              whileHover={{
                y: -4,
                rotate: 8,
                scale: 1.15,
                color: "var(--accent-secondary)",
                borderColor: "var(--accent-secondary)",
                boxShadow: "0 0 18px rgba(57, 230, 139, 0.25)",
              }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              <Icon size={18} />
            </motion.a>
          ))}
        </motion.div>
      </div>

      <motion.div
        className="container copyright"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        © {new Date().getFullYear()} SIVA S // DOOM CYBER TERMINAL — DevOps Engineer
      </motion.div>
    </footer>
  );
}