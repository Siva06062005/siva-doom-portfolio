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

// ─── Client-side In-Memory Cache ────────────────────────────────
const clientQueryCache = new Map();
const CLIENT_CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

/**
 * Queries the Gemini-powered Vercel serverless endpoint.
 * Returns the AI response text, or null on failure.
 */
export async function queryGeminiVeronica(prompt) {
  try {
    const controller = new AbortController();
    // 4.5s total browser timeout (covers 3.5s serverless execution + network transfer)
    const timeout = setTimeout(() => controller.abort(), 4500);

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
    console.info("[Veronica AI] Gemini query timeout or offline:", err.message);
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
  } catch {
    console.info("[Veronica AI] Ollama query bypassed or offline, using tactical engine.");
    return null;
  }
}

/**
 * Master query function — tries engines in priority order.
 * Returns { text: string, engine: string } or { text: null, engine: "tactical" }
 */
export async function queryVeronica(prompt) {
  const cacheKey = (prompt || "").toLowerCase().trim();
  const cached = clientQueryCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CLIENT_CACHE_TTL_MS) {
    return { text: cached.text, engine: cached.engine };
  }

  // 1. Try Gemini (cloud — works on Vercel production and local dev)
  if (activeEngine !== "ollama") {
    const geminiResponse = await queryGeminiVeronica(prompt);
    if (geminiResponse) {
      activeEngine = "gemini";
      clientQueryCache.set(cacheKey, { text: geminiResponse, engine: "gemini", timestamp: Date.now() });
      return { text: geminiResponse, engine: "gemini" };
    }
  }

  // 2. Try Ollama ONLY if confirmed online/active to avoid dead connection stalls
  if (activeEngine === "ollama") {
    const ollamaResponse = await queryOllamaVeronica(prompt);
    if (ollamaResponse) {
      clientQueryCache.set(cacheKey, { text: ollamaResponse, engine: "ollama", timestamp: Date.now() });
      return { text: ollamaResponse, engine: "ollama" };
    }
  }

  // 3. Tactical fallback — handled immediately by voiceCommands.js
  activeEngine = "tactical";
  return { text: null, engine: "tactical" };
}
