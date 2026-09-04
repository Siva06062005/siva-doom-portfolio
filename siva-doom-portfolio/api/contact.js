/**
 * Serverless Contact Uplink Endpoint (/api/contact)
 * 
 * Supports:
 * - Vercel Serverless Functions
 * - Node.js HTTP / Express / Vite Dev Middleware
 * - Resend Transactional Email API
 * - In-memory IP Rate Limiting (5 requests / 10 mins)
 * - Bot Honeypot Protection
 * - Input Sanitization & Email Header Injection Defense
 */

// In-memory rate limiting store (sliding window per IP)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS_PER_WINDOW = 5;

// Clean up stale rate-limit entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of rateLimitMap.entries()) {
    if (now - record.startTime > RATE_LIMIT_WINDOW_MS) {
      rateLimitMap.delete(ip);
    }
  }
}, 5 * 60 * 1000).unref?.();

function getClientIp(req) {
  const forwarded = req.headers?.['x-forwarded-for'];
  if (forwarded) {
    return typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : forwarded[0];
  }
  return req.headers?.['x-real-ip'] || req.socket?.remoteAddress || '127.0.0.1';
}

function checkRateLimit(ip) {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now - record.startTime > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, startTime: now });
    return { allowed: true };
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    const retryAfter = Math.ceil((record.startTime + RATE_LIMIT_WINDOW_MS - now) / 1000);
    return { allowed: false, retryAfter };
  }

  record.count += 1;
  return { allowed: true };
}

function sanitizeText(str) {
  if (!str || typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function stripHeaderInjection(str) {
  if (!str || typeof str !== 'string') return '';
  return str.replace(/[\r\n]+/g, ' ').trim();
}

function validateEmail(email) {
  if (!email || typeof email !== 'string') return false;
  // RFC 5322 standard email regex
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return email.length <= 100 && emailRegex.test(email.trim());
}

export default async function handler(req, res) {
  // Set response headers
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // Only allow POST method
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.statusCode = 405;
    res.end(JSON.stringify({
      success: false,
      error: 'Method Not Allowed. Use POST.'
    }));
    return;
  }

  try {
    // 1. IP Rate Limiting Check
    const clientIp = getClientIp(req);
    const rateCheck = checkRateLimit(clientIp);
    if (!rateCheck.allowed) {
      res.statusCode = 429;
      res.end(JSON.stringify({
        success: false,
        error: `Transmission rate limit exceeded. Please retry in ${rateCheck.retryAfter} seconds.`
      }));
      return;
    }

    // 2. Parse & Validate Payload Size
    const body = req.body || {};
    const bodyString = JSON.stringify(body);
    if (bodyString.length > 50 * 1024) {
      res.statusCode = 413;
      res.end(JSON.stringify({
        success: false,
        error: 'Payload oversized. Maximum permitted size is 50KB.'
      }));
      return;
    }

    const {
      name,
      email,
      subject,
      message,
      honeypot = ''
    } = body;

    // 3. Honeypot Spam Trap Check
    // If the invisible bot field is populated, pretend success without sending email
    if (honeypot && String(honeypot).trim().length > 0) {
      res.statusCode = 200;
      res.end(JSON.stringify({
        success: true,
        message: 'Message sent successfully.'
      }));
      return;
    }

    // 4. Input Validations
    if (!name || typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 80) {
      res.statusCode = 400;
      res.end(JSON.stringify({
        success: false,
        error: 'Invalid name parameter. Must be between 2 and 80 characters.'
      }));
      return;
    }

    if (!validateEmail(email)) {
      res.statusCode = 400;
      res.end(JSON.stringify({
        success: false,
        error: 'Invalid or malformed email address.'
      }));
      return;
    }

    if (!subject || typeof subject !== 'string' || subject.trim().length < 2 || subject.trim().length > 150) {
      res.statusCode = 400;
      res.end(JSON.stringify({
        success: false,
        error: 'Subject must be between 2 and 150 characters.'
      }));
      return;
    }

    if (!message || typeof message !== 'string' || message.trim().length < 10 || message.trim().length > 5000) {
      res.statusCode = 400;
      res.end(JSON.stringify({
        success: false,
        error: 'Message parameter must be between 10 and 5000 characters.'
      }));
      return;
    }

    // 5. Sanitize Inputs for Email Delivery
    const cleanName = stripHeaderInjection(name);
    const cleanEmail = stripHeaderInjection(email).toLowerCase();
    const cleanSubject = stripHeaderInjection(subject);
    const safeNameHtml = sanitizeText(cleanName);
    const safeEmailHtml = sanitizeText(cleanEmail);
    const safeSubjectHtml = sanitizeText(cleanSubject);
    const safeMessageHtml = sanitizeText(message.trim()).replace(/\n/g, '<br/>');
    const timestampIso = new Date().toISOString();
    const timestampFormatted = new Date().toLocaleString('en-US', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'full',
      timeStyle: 'long'
    });

    // 6. Check Provider Credentials
    // Supports RESEND_API_KEY or EMAIL_SERVICE_API_KEY
    const apiKey = process.env.RESEND_API_KEY || process.env.EMAIL_SERVICE_API_KEY;
    // Supports CONTACT_EMAIL or CONTACT_TO_EMAIL
    const toEmail = process.env.CONTACT_EMAIL || process.env.CONTACT_TO_EMAIL || 'sivasathiya0606@gmail.com';
    const fromEmail = process.env.CONTACT_FROM_EMAIL || 'Siva Portfolio Contact <onboarding@resend.dev>';

    // 7. Dev Mode Fallback (if no API key configured in local dev)
    if (!apiKey) {
      console.warn('⚠️ [CONTACT DEV LOG] RESEND_API_KEY / EMAIL_SERVICE_API_KEY not configured. Logging transmission locally:');
      console.log({
        from: cleanName,
        email: cleanEmail,
        subject: cleanSubject,
        timestamp: timestampIso,
        preview: message.substring(0, 100) + '...'
      });

      res.statusCode = 200;
      res.end(JSON.stringify({
        success: true,
        message: 'Message captured in local development environment. Configure RESEND_API_KEY for live delivery.'
      }));
      return;
    }

    // 8. Construct Email Payload for Resend API
    const emailPayload = {
      from: fromEmail,
      to: [toEmail],
      reply_to: cleanEmail,
      subject: `[Portfolio Contact] ${cleanSubject}`,
      text: `NEW CONTACT MESSAGE\n\nName: ${cleanName}\nEmail: ${cleanEmail}\nSubject: ${cleanSubject}\nDate: ${timestampFormatted} (IST)\nSource: Siva Doom Portfolio\n\nMessage:\n${message.trim()}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #0b0f0d; color: #e2ede4; margin: 0; padding: 20px; }
            .card { background: #131d17; border: 1px solid #234633; border-radius: 8px; max-width: 600px; margin: 0 auto; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
            .header { background: #1a2a21; border-bottom: 2px solid #39e68b; padding: 18px 24px; }
            .header h2 { margin: 0; color: #39e68b; font-size: 1.1rem; letter-spacing: 1px; text-transform: uppercase; }
            .body { padding: 24px; }
            .field { margin-bottom: 16px; }
            .label { font-size: 0.75rem; color: #7f9b87; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
            .value { font-size: 1rem; color: #f0f7f2; font-weight: 500; }
            .message-box { background: #0b0f0d; border-left: 3px solid #39e68b; padding: 16px; margin-top: 16px; border-radius: 4px; font-size: 0.95rem; line-height: 1.6; color: #d0e4d6; }
            .footer { background: #0c1410; padding: 14px 24px; font-size: 0.75rem; color: #5f7a67; border-top: 1px solid #1a2c20; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="header">
              <h2>⚡ Incoming Portfolio Contact Message</h2>
            </div>
            <div class="body">
              <div class="field">
                <div class="label">Sender Identity</div>
                <div class="value">${safeNameHtml} &lt;${safeEmailHtml}&gt;</div>
              </div>
              <div class="field">
                <div class="label">Subject</div>
                <div class="value">${safeSubjectHtml}</div>
              </div>
              <div class="field">
                <div class="label">Received Date & Time</div>
                <div class="value">${timestampFormatted} (IST)</div>
              </div>
              <div class="field">
                <div class="label">Source</div>
                <div class="value">Siva Doom React Portfolio (Production)</div>
              </div>
              <div class="field">
                <div class="label">Message</div>
                <div class="message-box">${safeMessageHtml}</div>
              </div>
            </div>
            <div class="footer">
              Securely dispatched via Siva Portfolio Contact Engine • Click Reply to respond directly to ${safeEmailHtml}
            </div>
          </div>
        </body>
        </html>
      `
    };

    // 9. Dispatch to Resend API
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(emailPayload)
    });

    const resendData = await resendResponse.json().catch(() => ({}));

    if (!resendResponse.ok) {
      console.error('❌ Resend API Error:', resendData);
      res.statusCode = 502;
      res.end(JSON.stringify({
        success: false,
        error: 'Email delivery uplink failed at provider gateway. Please try again later.'
      }));
      return;
    }

    res.statusCode = 200;
    res.end(JSON.stringify({
      success: true,
      message: 'Transmission successfully uplinked.',
      id: resendData.id
    }));
  } catch (err) {
    console.error('❌ Internal server error in contact uplink:', err);
    res.statusCode = 500;
    res.end(JSON.stringify({
      success: false,
      error: 'An internal server error occurred while transmitting your message.'
    }));
  }
}
