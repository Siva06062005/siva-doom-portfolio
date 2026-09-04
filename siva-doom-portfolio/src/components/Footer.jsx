import { Github, Linkedin, Mail, ArrowUpRight } from "lucide-react";
import { profile } from "../data/portfolio";
import { sfx } from "../utils/sfx";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <div className="footer-brand">
            <img src="/images/logo.png" alt="SIVA Logo" className="footer-logo-img" />
            <span>SIVA<span className="accent">.</span>S</span>
          </div>
          <p>
            Engineering reliable, scalable systems with zero tolerance for downtime.
          </p>
        </div>
        <div className="footer-links">
          <a
            href={profile.socials.github}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub Profile"
            onClick={() => sfx.playClick()}
          >
            <Github size={18} />
          </a>
          <a
            href={profile.socials.linkedin}
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn Profile"
            onClick={() => sfx.playClick()}
          >
            <Linkedin size={18} />
          </a>
          <a
            href={`mailto:${profile.email}`}
            aria-label="Send Email"
            onClick={() => sfx.playClick()}
          >
            <Mail size={18} />
          </a>
          <a
            href="#top"
            aria-label="Back to top"
            onClick={() => sfx.playClick()}
          >
            <ArrowUpRight size={18} />
          </a>
        </div>
      </div>
      <div className="container copyright">
        © {new Date().getFullYear()} SIVA S // DOOM CYBER TERMINAL — DevOps Engineer
      </div>
    </footer>
  );
}