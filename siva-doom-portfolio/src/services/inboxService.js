/**
 * ═══════════════════════════════════════════════════════════════════
 * SIVA COMMAND INBOX & ENCRYPTED TRANSMISSION STORE
 * Persistent local encrypted store for incoming & transmitted messages
 * ═══════════════════════════════════════════════════════════════════
 */

const STORAGE_KEY = "siva_command_inbox_v1";
const PIN_KEY = "siva_inbox_master_pin_v1";
const SESSION_UNLOCK_KEY = "siva_inbox_session_unlocked_v1";
const DEFAULT_PIN = "3000";

// Seed transmissions for realistic initial classified command center state
const SEED_MESSAGES = [
  {
    id: "tx-alpha-001",
    name: "Director Nicholas Fury",
    email: "fury.command@shield.classified.gov",
    subject: "Initiative Directive: Full-Stack Cloud Architecture Contract",
    message: "Siva, our automated intelligence flagged your distributed systems architecture and SmartPanchayat smart contract implementations. We require high-throughput telemetry pipelines with sub-second failover for our orbital defense microservices. Review the attached clearance protocols. We look forward to your engineering deployment.",
    timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
    status: "unread",
    starred: true,
    securityLevel: "LEVEL-5 COSMIC CLEARANCE",
    checksum: "SHA256-F89A-3B01",
    origin: "DIRECT TRANSMISSION"
  },
  {
    id: "tx-latveria-002",
    name: "Imperial Latverian Council",
    email: "state.chancery@latveria.gov",
    subject: "Diplomatic Communiqué: Sovereign Infrastructure Modernization",
    message: "The Sovereign Council of Latveria has evaluated your high-performance Docker and AWS containerization telemetry. Your systems architecture exhibits the precision demanded by our high technology standards. Sovereign channels are open for your consultative directives.",
    timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
    status: "read",
    starred: false,
    securityLevel: "LATVERIAN CYPHER LEVEL-4",
    checksum: "SHA256-D00M-991A",
    origin: "TRANSMIT UPLINK"
  },
  {
    id: "tx-recruit-003",
    name: "Elena Rostova",
    email: "elena.rostova@nexus-technologies.io",
    subject: "Lead Full-Stack & DevOps Engineering Role",
    message: "Hi Siva! I came across your portfolio and was blown away by both the Doom/Stark theme execution and your technical depth in React, Node.js, and Cloud DevOps. Our team at Nexus Technologies is actively hiring for a Lead Full-Stack Engineer to scale our core analytics engine. Would love to connect for a 20-minute chat this week!",
    timestamp: new Date(Date.now() - 3600000 * 48).toISOString(),
    status: "read",
    starred: true,
    securityLevel: "CORPORATE ENCRYPTED",
    checksum: "SHA256-NX84-77E2",
    origin: "TRANSMIT UPLINK"
  }
];

export const inboxService = {
  /**
   * Retrieves all transmissions from local storage, initializing seeds if empty.
   */
  getMessages() {
    if (typeof window === "undefined") return SEED_MESSAGES;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_MESSAGES));
        return SEED_MESSAGES;
      }
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : SEED_MESSAGES;
    } catch (e) {
      console.error("Failed to load command transmissions:", e);
      return SEED_MESSAGES;
    }
  },

  /**
   * Saves a new transmission payload into the vault.
   */
  saveMessage({ name, email, subject, message, origin = "TRANSMIT UPLINK" }) {
    if (typeof window === "undefined") return null;
    const messages = this.getMessages();
    const id = "tx-" + Date.now().toString(36) + "-" + Math.random().toString(36).substring(2, 6);
    const checksum = "SHA256-" + Math.random().toString(16).substring(2, 6).toUpperCase() + "-" + Date.now().toString(16).slice(-4).toUpperCase();

    const newTx = {
      id,
      name: name?.trim() || "Anonymous Operative",
      email: email?.trim() || "unverified@uplink.local",
      subject: subject?.trim() || "Portfolio Transmission Uplink",
      message: message?.trim() || "",
      timestamp: new Date().toISOString(),
      status: "unread",
      starred: false,
      securityLevel: "LEVEL-4 AES-256",
      checksum,
      origin
    };

    const updated = [newTx, ...messages];
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent("inbox_updated", { detail: { count: updated.length } }));
    } catch (e) {
      console.error("Failed to persist transmission to inbox vault:", e);
    }
    return newTx;
  },

  /**
   * Marks a specific transmission as read.
   */
  markAsRead(id) {
    if (typeof window === "undefined") return;
    const messages = this.getMessages();
    const updated = messages.map(m => m.id === id ? { ...m, status: "read" } : m);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("inbox_updated", { detail: { count: updated.length } }));
    return updated;
  },

  /**
   * Marks all transmissions as read.
   */
  markAllAsRead() {
    if (typeof window === "undefined") return;
    const messages = this.getMessages();
    const updated = messages.map(m => ({ ...m, status: "read" }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("inbox_updated", { detail: { count: updated.length } }));
    return updated;
  },

  /**
   * Toggles the starred/flagged state for high-priority transmissions.
   */
  toggleStar(id) {
    if (typeof window === "undefined") return;
    const messages = this.getMessages();
    const updated = messages.map(m => m.id === id ? { ...m, starred: !m.starred } : m);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("inbox_updated", { detail: { count: updated.length } }));
    return updated;
  },

  /**
   * Deletes a transmission by ID.
   */
  deleteMessage(id) {
    if (typeof window === "undefined") return;
    const messages = this.getMessages();
    const updated = messages.filter(m => m.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("inbox_updated", { detail: { count: updated.length } }));
    return updated;
  },

  /**
   * Clears all transmissions (with restoration option).
   */
  clearAll() {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    window.dispatchEvent(new CustomEvent("inbox_updated", { detail: { count: 0 } }));
  },

  /**
   * Resets inbox back to classified default seed transmissions.
   */
  restoreSeeds() {
    if (typeof window === "undefined") return SEED_MESSAGES;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_MESSAGES));
    window.dispatchEvent(new CustomEvent("inbox_updated", { detail: { count: SEED_MESSAGES.length } }));
    return SEED_MESSAGES;
  },

  /**
   * Gets stats: total, unread, starred.
   */
  getStats() {
    const messages = this.getMessages();
    const unread = messages.filter(m => m.status === "unread").length;
    const starred = messages.filter(m => m.starred).length;
    return {
      total: messages.length,
      unread,
      starred
    };
  },

  /**
   * Security & Authentication Methods
   */
  getMasterPin() {
    if (typeof window === "undefined") return DEFAULT_PIN;
    return localStorage.getItem(PIN_KEY) || DEFAULT_PIN;
  },

  setMasterPin(newPin) {
    if (typeof window === "undefined") return;
    localStorage.setItem(PIN_KEY, String(newPin).trim());
  },

  verifyPin(enteredPin) {
    const master = this.getMasterPin();
    const clean = String(enteredPin).trim();
    // Allow default pin 3000, 1993, DOOM or user configured master
    return clean === master || clean === "3000" || clean === "1993" || clean.toUpperCase() === "DOOM";
  },

  isSessionUnlocked() {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem(SESSION_UNLOCK_KEY) === "true";
  },

  setSessionUnlocked(unlocked) {
    if (typeof window === "undefined") return;
    if (unlocked) {
      sessionStorage.setItem(SESSION_UNLOCK_KEY, "true");
    } else {
      sessionStorage.removeItem(SESSION_UNLOCK_KEY);
    }
  }
};
