/**
 * Client-Side Contact Uplink Service
 * Dispatches verified contact payloads to deliver inquiries directly to Siva's email.
 *
 * Architecture:
 * 1. Attempts /api/contact (Serverless function)
 * 2. Seamless fallback to direct browser dispatch via Web3Forms gateway
 */

const DEFAULT_WEB3FORMS_KEY = "22a82d65-a90a-436b-b16f-690c07099084";

export async function sendContactMessage({ name, email, subject, message, honeypot = "" }) {
  const cleanName = typeof name === "string" ? name.trim() : "";
  const cleanEmail = typeof email === "string" ? email.trim() : "";
  const cleanSubject = typeof subject === "string" ? subject.trim() : "";
  const cleanMessage = typeof message === "string" ? message.trim() : "";
  const cleanHoneypot = honeypot ? String(honeypot).trim() : "";

  // 1. Primary: Dispatch via serverless backend /api/contact
  try {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        name: cleanName,
        email: cleanEmail,
        subject: cleanSubject,
        message: cleanMessage,
        honeypot: cleanHoneypot
      })
    });

    const data = await response.json().catch(() => ({}));

    if (response.ok && data.success) {
      return {
        success: true,
        message: data.message || "Message sent successfully. I'll get back to you soon."
      };
    }

    console.warn("Backend /api/contact gateway notification:", data.error || "Attempting direct browser gateway fallback...");
  } catch (err) {
    console.warn("Backend /api/contact unavailable, activating direct browser gateway fallback:", err?.message);
  }

  // 2. Direct browser delivery to Web3Forms gateway (direct client delivery with browser TLS)
  try {
    const accessKey = (typeof import.meta !== "undefined" && import.meta.env?.VITE_WEB3FORMS_ACCESS_KEY) || DEFAULT_WEB3FORMS_KEY;

    const w3Response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        access_key: accessKey,
        name: cleanName,
        email: cleanEmail,
        replyto: cleanEmail,
        subject: `[Portfolio Contact] ${cleanSubject}`,
        message: `Sender: ${cleanName}\nEmail: ${cleanEmail}\nSubject: ${cleanSubject}\nDate: ${new Date().toLocaleString()}\nSource: Siva Doom React Portfolio\n\nMessage:\n${cleanMessage}`,
        from_name: `${cleanName} (Portfolio Inquirer)`,
        botcheck: cleanHoneypot
      })
    });

    const w3Data = await w3Response.json().catch(() => ({}));

    if (w3Response.ok && w3Data.success !== false) {
      return {
        success: true,
        message: "Message sent successfully. I'll get back to you soon."
      };
    }

    return {
      success: false,
      error: w3Data.message || "Unable to send your message. Please try again or contact me directly."
    };
  } catch (directErr) {
    console.error("Direct transmission gateway fault:", directErr?.message || "Unknown error");
    return {
      success: false,
      error: "Unable to send your message. Please try again or contact me directly."
    };
  }
}
