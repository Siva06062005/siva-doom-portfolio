import { useState } from "react";
import { Mail, Phone, MapPin, Send, Github, Linkedin, Instagram, ShieldCheck, AlertTriangle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import PageShell from "../components/PageShell";
import MagneticButton from "../components/MagneticButton";
import SectionDivider from "../components/SectionDivider";
import { profile } from "../data/portfolio";
import { sfx } from "../utils/sfx";
import { sendContactMessage } from "../services/contactService";

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const fadeSlideUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
};

const socialLinks = [
  { href: "socials.github", label: "GitHub", Icon: Github, key: "github" },
  { href: "socials.linkedin", label: "LinkedIn", Icon: Linkedin, key: "linkedin" },
  { href: "socials.instagram", label: "Instagram", Icon: Instagram, key: "instagram" },
];

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    honeypot: ""
  });

  const [status, setStatus] = useState({
    submitting: false,
    success: false,
    error: false,
    message: ""
  });

  const [validationErrors, setValidationErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const errors = {};
    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();
    const trimmedSubject = formData.subject.trim();
    const trimmedMessage = formData.message.trim();

    if (!trimmedName || trimmedName.length < 2) {
      errors.name = "Name must be at least 2 characters.";
    } else if (trimmedName.length > 80) {
      errors.name = "Name must not exceed 80 characters.";
    }

    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
      errors.email = "Please enter a valid email address.";
    }

    if (!trimmedSubject || trimmedSubject.length < 2) {
      errors.subject = "Subject must be at least 2 characters.";
    } else if (trimmedSubject.length > 150) {
      errors.subject = "Subject must not exceed 150 characters.";
    }

    if (!trimmedMessage || trimmedMessage.length < 10) {
      errors.message = "Message must be at least 10 characters.";
    } else if (trimmedMessage.length > 5000) {
      errors.message = "Message must not exceed 5000 characters.";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status.submitting) return;

    if (!validate()) {
      sfx.playClick();
      return;
    }

    setStatus({ submitting: true, success: false, error: false, message: "" });
    sfx.playTransmission();

    const result = await sendContactMessage({
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      message: formData.message,
      honeypot: formData.honeypot
    });

    if (result.success) {
      setStatus({
        submitting: false,
        success: true,
        error: false,
        message: "Message sent successfully. I'll get back to you soon."
      });
      setFormData({ name: "", email: "", subject: "", message: "", honeypot: "" });
    } else {
      setStatus({
        submitting: false,
        success: false,
        error: true,
        message: result.error || "Unable to send your message. Please try again or contact me directly."
      });
    }
  };

  return (
    <PageShell
      eyebrow="05 / COMMS & UPLINK"
      title="Transmit Uplink"
      intro="Have an inquiry, project proposal, or DevOps collaboration in mind? Dispatch a message directly to my email."
    >
      <section className="section">
        <div className="container contact-grid">
          {/* Direct Channels Column */}
          <motion.div
            className="contact-info"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
          >
            <motion.span className="eyebrow" variants={fadeSlideUp}>TERMINAL COMMS</motion.span>
            <motion.h2 variants={fadeSlideUp}>
              YOUR MESSAGE.
              <br />
              <span className="accent">MY TERMINAL.</span>
            </motion.h2>
            <motion.p variants={fadeSlideUp}>
              For DevOps contracts, cloud infrastructure design, and technical collaborations, dispatch a transmission below.
            </motion.p>

            <motion.div className="contact-stack" variants={staggerContainer}>
              <motion.div className="contact-item" variants={fadeSlideUp}>
                <MapPin size={18} />
                <span>{profile.location}</span>
              </motion.div>
              <motion.a
                href={`mailto:${profile.email}`}
                className="contact-item contact-interactive"
                onClick={() => sfx.playClick()}
                variants={fadeSlideUp}
                whileHover={{ x: 5, color: "var(--accent-secondary)" }}
              >
                <Mail size={18} />
                <span>{profile.email}</span>
              </motion.a>
              <motion.a
                href={`tel:${profile.phone}`}
                className="contact-item contact-interactive"
                onClick={() => sfx.playClick()}
                variants={fadeSlideUp}
                whileHover={{ x: 5, color: "var(--accent-secondary)" }}
              >
                <Phone size={18} />
                <span>{profile.phone}</span>
              </motion.a>
            </motion.div>

            <motion.div
              className="social-links-row"
              variants={staggerContainer}
            >
              {[
                { href: profile.socials.github, label: "GitHub", Icon: Github },
                { href: profile.socials.linkedin, label: "LinkedIn", Icon: Linkedin },
                { href: profile.socials.instagram, label: "Instagram", Icon: Instagram },
              ].map(({ href, label, Icon }) => (
                <motion.div key={label} variants={fadeSlideUp}>
                  <MagneticButton>
                    <a
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-secondary social-btn"
                      onClick={() => sfx.playClick()}
                    >
                      <Icon size={16} /> {label}
                    </a>
                  </MagneticButton>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Secure Contact Form Panel */}
          <motion.form
            className="contact-form panel"
            onSubmit={handleSubmit}
            noValidate
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Honeypot field for bot detection */}
            <div style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px", overflow: "hidden" }} aria-hidden="true">
              <label htmlFor="bot_field_check">Leave empty</label>
              <input
                id="bot_field_check"
                type="text"
                name="honeypot"
                value={formData.honeypot}
                onChange={handleChange}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            {/* Inline Status Alerts */}
            {status.success && (
              <motion.div
                className="status-banner status-success"
                role="alert"
                initial={{ opacity: 0, y: -10, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <ShieldCheck size={20} />
                <div>
                  <strong>{status.message}</strong>
                  <p>Thank you for reaching out. Your transmission has been dispatched directly to my email address.</p>
                </div>
              </motion.div>
            )}

            {status.error && (
              <motion.div
                className="status-banner status-error"
                role="alert"
                initial={{ opacity: 0, y: -10, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <AlertTriangle size={20} />
                <div>
                  <strong>{status.message}</strong>
                  <p>If the issue persists, feel free to reach out directly via email or LinkedIn.</p>
                </div>
              </motion.div>
            )}

            {[
              { id: "contact_name", name: "name", type: "text", label: "Name *", placeholder: "e.g. Alex Morgan", maxLength: 80 },
              { id: "contact_email", name: "email", type: "email", label: "Email Address *", placeholder: "e.g. alex@company.com", maxLength: 100 },
              { id: "contact_subject", name: "subject", type: "text", label: "Subject *", placeholder: "e.g. Cloud Architecture Consultation", maxLength: 150 },
            ].map(({ id, name, type, label, placeholder, maxLength }, i) => (
              <motion.div
                className="form-group"
                key={id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.45 }}
              >
                <label htmlFor={id}>{label}</label>
                <input
                  id={id}
                  name={name}
                  type={type}
                  required
                  disabled={status.submitting}
                  placeholder={placeholder}
                  value={formData[name]}
                  onChange={handleChange}
                  className={validationErrors[name] ? "input-invalid" : ""}
                  maxLength={maxLength}
                />
                {validationErrors[name] && (
                  <span className="field-error">{validationErrors[name]}</span>
                )}
              </motion.div>
            ))}

            <motion.div
              className="form-group"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.24, duration: 0.45 }}
            >
              <label htmlFor="contact_message">Message *</label>
              <textarea
                id="contact_message"
                name="message"
                required
                rows={5}
                disabled={status.submitting}
                placeholder="Describe the system or infrastructure challenge you are solving..."
                value={formData.message}
                onChange={handleChange}
                className={validationErrors.message ? "input-invalid" : ""}
                maxLength={5000}
              />
              {validationErrors.message && (
                <span className="field-error">{validationErrors.message}</span>
              )}
            </motion.div>

            <motion.button
              className={`btn btn-primary submit-btn ${status.submitting ? "btn-submitting" : ""}`}
              type="submit"
              disabled={status.submitting}
              aria-label={status.submitting ? "Sending transmission..." : "Send Message"}
              whileHover={!status.submitting ? { scale: 1.02, boxShadow: "0 0 35px rgba(57,230,139,0.4)" } : {}}
              whileTap={!status.submitting ? { scale: 0.97 } : {}}
            >
              {status.submitting ? (
                <>
                  <Loader2 size={18} className="spinner-icon" />
                  <span>SENDING...</span>
                </>
              ) : (
                <>
                  <span>SEND MESSAGE</span>
                  <Send size={16} />
                </>
              )}
            </motion.button>

            <div className="form-footer-meta">
              <small>
                🔒 Protected by server-side rate limiting & honeypot filtering.
              </small>
            </div>
          </motion.form>
        </div>
      </section>
    </PageShell>
  );
}