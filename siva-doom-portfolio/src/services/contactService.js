/**
 * Client-Side Contact Uplink Service
 * Dispatches verified contact payloads to /api/contact
 * to deliver inquiries directly to the portfolio email.
 */

export async function sendContactMessage({ name, email, subject, message, honeypot = "" }) {
  const cleanName = typeof name === "string" ? name.trim() : "";
  const cleanEmail = typeof email === "string" ? email.trim() : "";
  const cleanSubject = typeof subject === "string" ? subject.trim() : "";
  const cleanMessage = typeof message === "string" ? message.trim() : "";

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
        honeypot: honeypot ? String(honeypot).trim() : ""
      })
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return {
        success: false,
        error: data.error || "Unable to send your message. Please try again or contact me directly."
      };
    }

    return {
      success: true,
      message: data.message || "Message sent successfully. I'll get back to you soon."
    };
  } catch (err) {
    // Log minimal message for client debugging without sensitive information
    console.error("Transmission uplink network fault:", err?.message || "Unknown error");
    return {
      success: false,
      error: "Unable to send your message. Please try again or contact me directly."
    };
  }
}
