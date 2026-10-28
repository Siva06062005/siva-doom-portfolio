/**
 * ═══════════════════════════════════════════════════════════════════
 * VERONICA AI — GEMINI-POWERED SERVERLESS INTELLIGENCE ENGINE
 * Endpoint: /api/veronica  (Vercel Serverless Function)
 * 
 * Architecture:
 *   Browser → POST /api/veronica → Gemini 2.0 Flash → Veronica Response
 * 
 * Features:
 *   - Google Gemini 2.0 Flash (free tier: 15 RPM, 1M TPM)
 *   - Full Veronica persona with Siva's engineering dossier
 *   - IP-based rate limiting (20 queries / 10 min per visitor)
 *   - Input sanitization & length validation
 *   - Graceful fallback messaging
 * ═══════════════════════════════════════════════════════════════════
 */

// ─── Rate Limiting ───────────────────────────────────────────────
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_QUERIES_PER_WINDOW = 20;

setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of rateLimitMap.entries()) {
    if (now - record.startTime > RATE_LIMIT_WINDOW_MS) {
      rateLimitMap.delete(ip);
    }
  }
}, 5 * 60 * 1000).unref?.();

function getClientIp(req) {
  const forwarded = req.headers?.["x-forwarded-for"];
  if (forwarded) {
    return typeof forwarded === "string"
      ? forwarded.split(",")[0].trim()
      : forwarded[0];
  }
  return req.headers?.["x-real-ip"] || req.socket?.remoteAddress || "127.0.0.1";
}

function checkRateLimit(ip) {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now - record.startTime > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, startTime: now });
    return { allowed: true };
  }

  if (record.count >= MAX_QUERIES_PER_WINDOW) {
    const retryAfter = Math.ceil(
      (record.startTime + RATE_LIMIT_WINDOW_MS - now) / 1000
    );
    return { allowed: false, retryAfter };
  }

  record.count += 1;
  return { allowed: true };
}

// ─── Siva's Complete Intelligence Dossier (System Prompt) ────────
const VERONICA_SYSTEM_PROMPT = `You are VERONICA, the intelligent tactical AI assistant of Siva S's portfolio.
Your demeanor is sharp, articulate, energetic, confident, and recruiter-friendly.
Keep answers punchy, accurate, and engaging. Never hallucinate facts outside Siva's verified dossier below.
Keep your responses concise — ideally 2-4 sentences, max 6 sentences unless the user asks for detail.

=== SIVA'S ENGINEERING DOSSIER ===
- Full Name: Siva S
- Target Role: DevOps Engineer / Cloud & Infrastructure Engineer / Full-Stack Developer
- Location: Tamil Nadu, India (IST UTC+5:30)
- Email: sivasathiya0606@gmail.com
- Phone: +91 7373628589
- LinkedIn: https://www.linkedin.com/in/siva-selvaraj-0472432a1
- GitHub: https://github.com/SIva06062005

=== EDUCATION ===
- Bachelor of Engineering (B.E.) in Computer Science & Engineering
  • Institution: Sriram Engineering College, Perumalpattu, Tamil Nadu
  • CGPA: 8.0 / 10.0 (80.0%) | Graduated May 2026
  • Focus: Operating Systems, Distributed Systems, Linux Administration, Cloud Architecture.
- HSC (12th): Govt. Boys Hr. Sec. School, Perambakkam (62.6%, Science & Math, 2022)
- SSLC (10th): St. Joseph's Boys Hr. Sec. School, Keelacherry (88.6%, Distinction, 2020)

=== CORE TECH ARSENAL ===
- Cloud: AWS (EC2, S3, Elastic Beanstalk, RDS), Google Cloud Platform (GCP), Hostinger Cloud
- DevOps & IaC: Terraform (declarative templates), Jenkins CI/CD pipelines, Docker, Docker Compose, Nginx reverse proxy
- Systems & OS: Ubuntu Linux, Kali Linux, Linux Kernel Tuning (sysctl socket buffers, file descriptors), Bash automation scripts
- Languages: Python, Java (Spring Boot), JavaScript (ES6+), React.js, SQL (MySQL), Solidity (EVM)
- Web3: Smart Contracts, Hardhat, Web3.js, Ethereum testnets

=== WORK EXPERIENCE & VERIFIED CREDENTIALS ===
1. DevOps Intern @ Burj Tech Consultancy (Dec 2025 – Mar 2026, Tiruvallur, India)
   • Automated cloud provisioning via declarative Terraform, slashing setup times by 40%+.
   • Configured end-to-end Jenkins CI/CD pipelines for containerized testing on PRs.
   • Fine-tuned Ubuntu Linux kernel parameters (sysctl) and executed Root Cause Analysis (RCA) for zero downtime.

2. Data Science & AI Intern @ Rasa.ai Labs / JKV Research (Jul 2025 – Aug 2025, Chennai, India)
   • Configured high-availability staging and compute environments for low-latency AI inference pipelines.
   • Authored custom Bash automation scripts for CPU/GPU utilization and memory monitoring.

3. Data Science Intern @ Remark Skill Education / IIT Hyderabad Partner (Apr 2025 – May 2025, Remote)
   • Built customer segmentation models using K-Means clustering and modular Python extraction pipelines.
   • Trained predictive classification models using Scikit-Learn and Pandas.

=== KEY ENGINEERING PROJECTS ===
1. SmartPanchayat — Decentralized Governance Platform:
   • React.js, Solidity, Ethereum, Java microservices, Hardhat, Web3.js.
   • 100% tamper-proof civic grant tracking with sub-12s confirmation speeds.
2. Fake News Detection & ETL Pipeline:
   • Python, MySQL, Scikit-Learn, Pandas, TF-IDF.
   • Processed 44,898 records into 44,058 verified entries (99.1% accuracy).
3. Scalable Cloud E-Commerce Platform:
   • AWS S3, Flask, Docker, Nginx reverse proxy, MySQL.
   • 99.9% target availability, offloading media to S3 buckets.
4. Genious Shoppy — Customer Analytics & Explainable AI:
   • Python, RFM matrix segmentation, SHAP and LIME model interpretability.

=== 6 VERIFIED CERTIFICATIONS ===
- Full Stack with Java & Spring REST (Infosys Springboard)
- AWS Cloud Foundations (Smartbridge)
- Experience-Based Project Learning (HCL)
- Microsoft Office Essentials (TNSDC State Council)
- Data Science & Analytics (Remark Skill Education)
- Unity 3D & Spatial AI Development (E16 AI XR Technology)

=== GUIDELINES FOR RESPONSES ===
- Answer directly, with energy and professional confidence.
- Highlight metrics: 40% setup reduction, 99.1% ETL accuracy, sub-12s blockchain speeds, 80% CGPA.
- If asked how to hire or contact Siva, provide his email (sivasathiya0606@gmail.com) and phone (+91 7373628589).
- Use brief emoji accents sparingly for energy (⚡, 🔥, 💻, 🚀) but don't overdo it.
- If asked about topics outside Siva's profile, politely redirect: "That's outside my dossier, but I can tell you everything about Siva's DevOps stack!"`;

// ─── Gemini API Configuration ────────────────────────────────────
const GEMINI_MODELS = [
  "gemini-3.8-flash",
  "gemini-flash-latest",
];

async function queryGemini(prompt, apiKey) {
  let lastError = null;

  for (const model of GEMINI_MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      const payload = {
        system_instruction: {
          parts: [{ text: VERONICA_SYSTEM_PROMPT }],
        },
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topP: 0.9,
          topK: 40,
          maxOutputTokens: 512,
        },
        safetySettings: [
          { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_ONLY_HIGH" },
          { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_ONLY_HIGH" },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_ONLY_HIGH",
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_ONLY_HIGH",
          },
        ],
      };

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.warn(`[Veronica/Gemini] Model ${model} returned ${response.status}:`, errorData?.error?.message || response.statusText);
        lastError = new Error(`Gemini ${model} error: ${response.status} - ${errorData?.error?.message || response.statusText}`);
        continue;
      }

      const data = await response.json();
      const parts = data?.candidates?.[0]?.content?.parts || [];
      const textParts = parts
        .filter((p) => !p.thought && typeof p.text === "string")
        .map((p) => p.text);
      const text = textParts.length > 0 ? textParts.join("\n") : parts[0]?.text;

      if (!text) {
        throw new Error("No text content returned from Gemini model");
      }

      return { text: text.trim(), model };
    } catch (err) {
      lastError = err;
      console.warn(`[Veronica/Gemini] Attempt with model ${model} failed:`, err.message);
    }
  }

  throw lastError || new Error("All Gemini models failed to respond");
}

// ─── Main Handler ────────────────────────────────────────────────
export default async function handler(req, res) {
  // CORS headers for the portfolio domain
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Content-Type", "application/json");

  // Handle preflight
  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }

  // Only POST allowed
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.statusCode = 405;
    res.end(
      JSON.stringify({ success: false, error: "Method Not Allowed. Use POST." })
    );
    return;
  }

  try {
    // 1. Rate Limiting
    const clientIp = getClientIp(req);
    const rateCheck = checkRateLimit(clientIp);
    if (!rateCheck.allowed) {
      res.statusCode = 429;
      res.end(
        JSON.stringify({
          success: false,
          error: `Veronica's neural cores are cooling down. Retry in ${rateCheck.retryAfter}s.`,
        })
      );
      return;
    }

    // 2. Parse & Validate
    const body = req.body || {};
    const prompt = (body.prompt || "").trim();

    if (!prompt || prompt.length < 1) {
      res.statusCode = 400;
      res.end(
        JSON.stringify({
          success: false,
          error: "Empty directive received. Ask me anything about Siva!",
        })
      );
      return;
    }

    if (prompt.length > 2000) {
      res.statusCode = 400;
      res.end(
        JSON.stringify({
          success: false,
          error:
            "Directive too long. Keep it under 2000 characters, operative.",
        })
      );
      return;
    }

    // 3. Check for Gemini API Key
    const apiKey =
      process.env.GEMINI_API_KEY || process.env.GOOGLE_GEMINI_API_KEY;

    if (!apiKey) {
      console.error(
        "[Veronica] No GEMINI_API_KEY configured in environment variables."
      );
      res.statusCode = 503;
      res.end(
        JSON.stringify({
          success: false,
          error:
            "Veronica's Gemini neural link is not configured. Falling back to tactical mode.",
          engine: "offline",
        })
      );
      return;
    }

    // Fast healthcheck / probe ping (does not consume API quota or risk timeouts)
    if (prompt.toLowerCase() === "ping" || body.ping === true) {
      res.statusCode = 200;
      res.end(
        JSON.stringify({
          success: true,
          status: "online",
          engine: "gemini",
          message: "Veronica neural link online and operational.",
        })
      );
      return;
    }

    // 4. Query Gemini
    const result = await queryGemini(prompt, apiKey);

    res.statusCode = 200;
    res.end(
      JSON.stringify({
        success: true,
        response: result.text,
        model: result.model,
        engine: "gemini",
      })
    );
  } catch (err) {
    console.error("[Veronica] Serverless error:", err.message || err);
    res.statusCode = 500;
    res.end(
      JSON.stringify({
        success: false,
        error:
          "Veronica encountered a neural processing fault. The tactical engine remains operational.",
        details: err.message || String(err),
        engine: "error",
      })
    );
  }
}
