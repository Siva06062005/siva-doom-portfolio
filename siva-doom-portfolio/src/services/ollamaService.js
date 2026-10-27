// ═══════════════════════════════════════════════════════════════════
// SIVA S PORTFOLIO — VERONICA AI TRI-ENGINE SERVICE
// Priority Chain: Gemini Cloud → Ollama Local → Tactical Fallback
// ═══════════════════════════════════════════════════════════════════

// ─── Endpoints ───────────────────────────────────────────────────
// Gemini: Vercel serverless /api/veronica (works in production)
// Ollama: Vite proxy /api/ollama → localhost:11434 (works in dev only)
const GEMINI_ENDPOINT = "/api/veronica";
const OLLAMA_ENDPOINT = "/api/ollama/api/generate";
const OLLAMA_TAGS_ENDPOINT = "/api/ollama/api/tags";

// ─── Engine state (exposed to UI for status display) ─────────────
export let activeEngine = "tactical"; // "gemini" | "ollama" | "tactical"

/**
 * Checks if the Gemini-powered serverless endpoint is available.
 * Sends a lightweight probe query to validate the API key is configured.
 */
export async function isGeminiOnline() {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(GEMINI_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({ prompt: "ping" }),
    });

    clearTimeout(timeout);

    // 503 = no API key configured, 200 = working
    if (res.ok) {
      activeEngine = "gemini";
      return true;
    }

    // If 503 (no key), fall through to Ollama check
    return false;
  } catch {
    return false;
  }
}

/**
 * Checks if the local Ollama instance is reachable and has models available.
 */
export async function isOllamaOnline() {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1200);
    const res = await fetch(OLLAMA_TAGS_ENDPOINT, { signal: controller.signal });
    clearTimeout(timeout);

    if (res.ok) {
      activeEngine = "ollama";
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

/**
 * Probes both engines and returns the best available one.
 * Priority: Gemini (cloud/production) → Ollama (local/dev) → Tactical (fallback)
 */
export async function detectBestEngine() {
  // Try Gemini first (works on Vercel production)
  const geminiUp = await isGeminiOnline();
  if (geminiUp) {
    activeEngine = "gemini";
    console.log("[Veronica] Engine: Gemini Cloud ⚡");
    return "gemini";
  }

  // Try Ollama next (works on localhost dev)
  const ollamaUp = await isOllamaOnline();
  if (ollamaUp) {
    activeEngine = "ollama";
    console.log("[Veronica] Engine: Ollama Local 🔧");
    return "ollama";
  }

  // Fallback to tactical hardcoded engine
  activeEngine = "tactical";
  console.log("[Veronica] Engine: Tactical Fallback 🛡️");
  return "tactical";
}

/**
 * Queries the Gemini-powered Vercel serverless endpoint.
 * Returns the AI response text, or null on failure.
 */
export async function queryGeminiVeronica(prompt) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);

    const res = await fetch(GEMINI_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({ prompt }),
    });

    clearTimeout(timeout);
    if (!res.ok) return null;

    const data = await res.json();
    return data?.response?.trim() || null;
  } catch (err) {
    console.info("[Veronica AI] Gemini query failed, trying next engine.", err.message);
    return null;
  }
}

/**
 * Queries the personalized 'veronica' model running on Ollama.
 * Returns null if Ollama is offline or times out.
 */
export async function queryOllamaVeronica(prompt) {
  try {
    const controller = new AbortController();
    // 15-second timeout for CPU/GPU generation
    const timeout = setTimeout(() => controller.abort(), 15000);

    const res = await fetch(OLLAMA_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        model: "veronica",
        prompt: prompt,
        stream: false,
      }),
    });

    clearTimeout(timeout);
    if (!res.ok) return null;

    const data = await res.json();
    return data?.response?.trim() || null;
  } catch (err) {
    console.info("[Veronica AI] Ollama query bypassed or offline, using tactical engine.");
    return null;
  }
}

/**
 * Master query function — tries engines in priority order.
 * Returns { text: string, engine: string } or { text: null, engine: "tactical" }
 */
export async function queryVeronica(prompt) {
  // 1. Try Gemini (cloud — works on Vercel production) unless explicitly in local Ollama dev mode
  if (activeEngine !== "ollama") {
    const geminiResponse = await queryGeminiVeronica(prompt);
    if (geminiResponse) {
      activeEngine = "gemini";
      return { text: geminiResponse, engine: "gemini" };
    }
  }

  // 2. Try Ollama (local — works in dev with Ollama running)
  const ollamaResponse = await queryOllamaVeronica(prompt);
  if (ollamaResponse) {
    activeEngine = "ollama";
    return { text: ollamaResponse, engine: "ollama" };
  }

  // 3. Tactical fallback — handled by voiceCommands.js
  activeEngine = "tactical";
  return { text: null, engine: "tactical" };
}
