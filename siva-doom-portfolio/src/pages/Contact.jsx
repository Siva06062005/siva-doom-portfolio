import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Send, Github, Linkedin, ShieldCheck, AlertTriangle, Loader2, Inbox, Lock } from "lucide-react";
import { motion } from "framer-motion";
import PageShell from "../components/PageShell";
import { profile } from "../data/portfolio";
import { sfx } from "../utils/sfx";
import { sendContactMessage } from "../services/contactService";

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
    error: null,
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
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters.";
    } else if (formData.name.trim().length > 80) {
      errors.name = "Name must not exceed 80 characters.";
    }

    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      errors.email = "Please enter a valid email address.";
    }

    if (formData.subject && formData.subject.trim().length > 150) {
      errors.subject = "Subject must not exceed 150 characters.";
    }

    if (!formData.message.trim() || formData.message.trim().length < 10) {
      errors.message = "Message must be at least 10 characters.";
    } else if (formData.message.trim().length > 5000) {
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

    setStatus({ submitting: true, success: false, error: null, message: "" });
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
        error: null,
        message: "UPLINK SUCCESSFUL — Transmission received by command channel."
      });
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
        honeypot: ""
      });
    } else {
      setStatus({
        submitting: false,
        success: false,
        error: true,
        message: result.error || "TRANSMISSION FAILED — Please try again later."
      });
    }
  };

  return (
    <PageShell
      eyebrow="05 / COMMS & UPLINK"
      title="Transmit Uplink"
      intro="Transmit an operational message to the terminal. Encrypted background delivery to command inbox."
    >
      <section className="section">
        <div className="container contact-grid">
          {/* Direct Channels Column */}
          <motion.div
            className="contact-info"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="eyebrow">TERMINAL COMMS</span>
            <h2>
              YOUR MESSAGE.
              <br />
              <span className="accent">MY TERMINAL.</span>
            </h2>
            <p>
              For DevOps contracts, cloud infrastructure design, and technical collaborations, dispatch a transmission below.
            </p>

            <div className="contact-stack">
              <div className="contact-item">
                <MapPin size={18} />
                <span>{profile.location}</span>
              </div>
              <a
                href={`mailto:${profile.email}`}
                className="contact-item contact-interactive"
                onClick={() => sfx.playClick()}
              >
                <Mail size={18} />
                <span>{profile.email}</span>
              </a>
              <a
                href={`tel:${profile.phone}`}
                className="contact-item contact-interactive"
                onClick={() => sfx.playClick()}
              >
                <Phone size={18} />
                <span>{profile.phone}</span>
              </a>
            </div>

            <div className="social-links-row">
              <a
                href={profile.socials.github}
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary social-btn"
                onClick={() => sfx.playClick()}
              >
                <Github size={16} /> GitHub
              </a>
              <a
                href={profile.socials.linkedin}
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary social-btn"
                onClick={() => sfx.playClick()}
              >
                <Linkedin size={16} /> LinkedIn
              </a>
            </div>

            {/* Command Transmission Vault Access Card */}
            <div className="contact-vault-access panel">
              <div className="vault-access-badge">
                <Lock size={14} />
                <span>COMMAND VAULT // CLEARANCE</span>
              </div>
              <p className="vault-access-desc">
                Command intelligence. Enter security clearance terminal to decrypt and inspect transmission records.
              </p>
              <Link
                to="/inbox"
                className="btn btn-sm btn-outline vault-access-link"
                onMouseEnter={() => sfx.playHover()}
                onClick={() => sfx.playClick()}
              >
                <Inbox size={15} />
                <span>ACCESS SECURE INBOX</span>
              </Link>
            </div>
          </motion.div>

          {/* Secure Contact Form Panel */}
          <motion.form
            className="contact-form panel"
            onSubmit={handleSubmit}
            noValidate
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
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
              <div className="status-banner status-success" role="alert">
                <ShieldCheck size={20} />
                <div>
                  <strong>{status.message}</strong>
                  <p>Your message has been safely delivered and recorded in the command vault.</p>
                  <Link
                    to="/inbox"
                    className="status-inbox-link"
                    onClick={() => sfx.playClick()}
                  >
                    View in Secure Command Inbox →
                  </Link>
                </div>
              </div>
            )}

            {status.error && (
              <div className="status-banner status-error" role="alert">
                <AlertTriangle size={20} />
                <div>
                  <strong>{status.message}</strong>
                  <p>If the error persists, you may reach out directly via the direct channels listed.</p>
                </div>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="contact_name">Name *</label>
              <input
                id="contact_name"
                name="name"
                type="text"
                required
                disabled={status.submitting}
                placeholder="e.g. Alex Morgan"
                value={formData.name}
                onChange={handleChange}
                className={validationErrors.name ? "input-invalid" : ""}
                maxLength={80}
              />
              {validationErrors.name && (
                <span className="field-error">{validationErrors.name}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="contact_email">Email Address *</label>
              <input
                id="contact_email"
                name="email"
                type="email"
                required
                disabled={status.submitting}
                placeholder="e.g. alex@company.com"
                value={formData.email}
                onChange={handleChange}
                className={validationErrors.email ? "input-invalid" : ""}
                maxLength={100}
              />
              {validationErrors.email && (
                <span className="field-error">{validationErrors.email}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="contact_subject">Subject</label>
              <input
                id="contact_subject"
                name="subject"
                type="text"
                disabled={status.submitting}
                placeholder="e.g. Cloud Architecture Consultation"
                value={formData.subject}
                onChange={handleChange}
                className={validationErrors.subject ? "input-invalid" : ""}
                maxLength={150}
              />
              {validationErrors.subject && (
                <span className="field-error">{validationErrors.subject}</span>
              )}
            </div>

            <div className="form-group">
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
            </div>

            <button
              className={`btn btn-primary submit-btn ${status.submitting ? "btn-submitting" : ""}`}
              type="submit"
              disabled={status.submitting}
            >
              {status.submitting ? (
                <>
                  <Loader2 size={18} className="spinner-icon" />
                  <span>TRANSMITTING...</span>
                </>
              ) : (
                <>
                  <span>TRANSMIT UPLINK</span>
                  <Send size={16} />
                </>
              )}
            </button>

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