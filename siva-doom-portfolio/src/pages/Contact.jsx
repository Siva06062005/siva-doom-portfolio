import { useState } from "react";
import { Mail, Phone, MapPin, Send, Github, Linkedin, ShieldCheck, AlertTriangle, Loader2 } from "lucide-react";
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
                  <p>Thank you for reaching out. Your transmission has been dispatched directly to my email address.</p>
                </div>
              </div>
            )}

            {status.error && (
              <div className="status-banner status-error" role="alert">
                <AlertTriangle size={20} />
                <div>
                  <strong>{status.message}</strong>
                  <p>If the issue persists, feel free to reach out directly via email or LinkedIn.</p>
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
              <label htmlFor="contact_subject">Subject *</label>
              <input
                id="contact_subject"
                name="subject"
                type="text"
                required
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
              aria-label={status.submitting ? "Sending transmission..." : "Send Message"}
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