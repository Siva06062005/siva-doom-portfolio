import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Inbox as InboxIcon,
  Shield,
  ShieldCheck,
  Lock,
  Star,
  Trash2,
  Mail,
  Search,
  CheckCircle2,
  Copy,
  Download,
  Send,
  RefreshCw,
  PlusCircle,
  ExternalLink,
  ChevronRight,
  Filter
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PageShell from "../components/PageShell";
import SecurityGate from "../components/SecurityGate";
import { sfx } from "../utils/sfx";
import { inboxService } from "../services/inboxService";

export default function Inbox() {
  const navigate = useNavigate();

  const [isUnlocked, setIsUnlocked] = useState(() => inboxService.isSessionUnlocked());
  const [messages, setMessages] = useState(() => inboxService.getMessages());
  const [selectedId, setSelectedId] = useState(() => {
    const list = inboxService.getMessages();
    return list.length > 0 ? list[0].id : null;
  });
  const [filter, setFilter] = useState("all"); // all | unread | starred
  const [searchQuery, setSearchQuery] = useState("");
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const refreshMessages = () => {
    const updated = inboxService.getMessages();
    setMessages(updated);
    if (updated.length > 0 && (!selectedId || !updated.some((m) => m.id === selectedId))) {
      setSelectedId(updated[0].id);
    }
  };

  // Listen to cross-component inbox update events
  useEffect(() => {
    const handleUpdate = () => refreshMessages();
    window.addEventListener("inbox_updated", handleUpdate);
    return () => window.removeEventListener("inbox_updated", handleUpdate);
  }, [selectedId]);

  const showToast = (text) => {
    setToastMessage(text);
    setTimeout(() => setToastMessage(""), 2600);
  };

  const handleLock = () => {
    sfx.playWarning();
    inboxService.setSessionUnlocked(false);
    setIsUnlocked(false);
  };

  const handleSelectMessage = (msg) => {
    sfx.playClick();
    setSelectedId(msg.id);
    if (msg.status === "unread") {
      inboxService.markAsRead(msg.id);
      refreshMessages();
    }
  };

  const handleToggleStar = (id, e) => {
    if (e) e.stopPropagation();
    sfx.playClick();
    inboxService.toggleStar(id);
    refreshMessages();
  };

  const handleDeleteMessage = (id, e) => {
    if (e) e.stopPropagation();
    sfx.playWarning();
    inboxService.deleteMessage(id);
    const updated = inboxService.getMessages();
    setMessages(updated);
    if (selectedId === id) {
      setSelectedId(updated.length > 0 ? updated[0].id : null);
    }
    showToast("Transmission purged from vault.");
  };

  const handleClearAll = () => {
    if (window.confirm("CONFIRMATION REQUIRED: Purge all transmissions from the command archive?")) {
      sfx.playWarning();
      inboxService.clearAll();
      setMessages([]);
      setSelectedId(null);
      showToast("All transmissions purged.");
    }
  };

  const handleRestoreSeeds = () => {
    sfx.playTransmission();
    inboxService.restoreSeeds();
    refreshMessages();
    showToast("Classified demo transmissions restored.");
  };

  const handleSimulateUplink = () => {
    sfx.playTransmission();
    const testNames = ["Dr. Bruce Banner", "Natasha Romanoff", "Peter Parker", "Pepper Potts", "Doom Intelligence"];
    const randomName = testNames[Math.floor(Math.random() * testNames.length)];
    const newTx = inboxService.saveMessage({
      name: randomName,
      email: `${randomName.toLowerCase().replace(/[^a-z]/g, "")}@uplink.simulation`,
      subject: `Simulated Priority Directive #${Math.floor(100 + Math.random() * 900)}`,
      message: `Operational simulation test generated at ${new Date().toLocaleTimeString()}. Verification of telemetry pipeline, AES-256 payload ingestion, and command inbox notifications confirmed.`,
      origin: "SIMULATED UPLINK"
    });
    refreshMessages();
    setSelectedId(newTx.id);
    showToast(`Incoming uplink received from ${randomName}!`);
  };

  const handleCopyPayload = (msg) => {
    if (!msg) return;
    sfx.playClick();
    const payloadText = `[SIVA COMMAND VAULT // DECRYPTED TRANSMISSION]
ID: ${msg.id}
SENDER: ${msg.name} <${msg.email}>
SUBJECT: ${msg.subject}
SECURITY: ${msg.securityLevel}
ORIGIN: ${msg.origin}
TIMESTAMP: ${new Date(msg.timestamp).toLocaleString()}
CHECKSUM: ${msg.checksum}

MESSAGE:
${msg.message}`;

    navigator.clipboard.writeText(payloadText);
    setCopied(true);
    showToast("Transmission copied to clipboard.");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportTxt = (msg) => {
    if (!msg) return;
    sfx.playClick();
    const payloadText = `=====================================================
SIVA PORTFOLIO // COMMAND TRANSMISSION VAULT LOG
=====================================================
TRANSMISSION ID: ${msg.id}
DATE RECORDED   : ${new Date(msg.timestamp).toLocaleString()}
AUTHENTICATED AS: ${msg.name}
RETURN CHANNEL  : ${msg.email}
DIRECTIVE/SUBJ  : ${msg.subject}
ENCRYPTION SPEC : ${msg.securityLevel}
ORIGIN CHANNEL  : ${msg.origin}
DIGITAL CHECKSUM: ${msg.checksum}
-----------------------------------------------------
PAYLOAD TRANSMISSION:
${msg.message}
=====================================================`;

    const blob = new Blob([payloadText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `transmission-${msg.id}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    showToast("Transmission log downloaded.");
  };

  // Filter & Search computation
  const filteredMessages = useMemo(() => {
    return messages.filter((m) => {
      if (filter === "unread" && m.status !== "unread") return false;
      if (filter === "starred" && !m.starred) return false;

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = m.name?.toLowerCase().includes(query);
        const matchesEmail = m.email?.toLowerCase().includes(query);
        const matchesSubject = m.subject?.toLowerCase().includes(query);
        const matchesMessage = m.message?.toLowerCase().includes(query);
        return matchesName || matchesEmail || matchesSubject || matchesMessage;
      }
      return true;
    });
  }, [messages, filter, searchQuery]);

  const selectedMessage = useMemo(() => {
    return messages.find((m) => m.id === selectedId) || null;
  }, [messages, selectedId]);

  const stats = useMemo(() => {
    return inboxService.getStats();
  }, [messages]);

  // If locked, present the Security Gatekeeper
  if (!isUnlocked) {
    return (
      <PageShell
        eyebrow="06 / RESTRICTED"
        title="Secure Command Terminal"
        intro="Authentication clearance required to view tactical uplink transmissions and incoming inquiries."
      >
        <div className="container" style={{ padding: "40px 0 80px" }}>
          <SecurityGate
            onUnlock={() => {
              setIsUnlocked(true);
              refreshMessages();
            }}
            onCancel={() => navigate("/contact")}
          />
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell
      eyebrow="06 / COMMAND COMMS"
      title="Secure Transmission Vault"
      intro="Decrypted operational command log. Inspect incoming directives, recruiter communications, and technical collaboration transmissions."
    >
      <section className="section inbox-section">
        <div className="container">
          {/* Toast Notification */}
          <AnimatePresence>
            {toastMessage && (
              <motion.div
                className="inbox-toast"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
              >
                <CheckCircle2 size={16} />
                <span>{toastMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Top Command Telemetry & Stats Bar */}
          <div className="inbox-telemetry-bar panel">
            <div className="telemetry-stat">
              <span className="telemetry-label">TRANSMISSION STATUS</span>
              <span className="telemetry-value active-badge">
                <span className="live-dot" /> DECRYPTED // ACTIVE SESSION
              </span>
            </div>

            <div className="telemetry-stat">
              <span className="telemetry-label">TOTAL UPLINKS</span>
              <span className="telemetry-value">{stats.total}</span>
            </div>

            <div className="telemetry-stat">
              <span className="telemetry-label">UNREAD DIRECTIVES</span>
              <span className={`telemetry-value ${stats.unread > 0 ? "accent" : ""}`}>
                {stats.unread}
              </span>
            </div>

            <div className="telemetry-stat">
              <span className="telemetry-label">SECURITY PROTOCOL</span>
              <span className="telemetry-value">AES-256 GCM VERIFIED</span>
            </div>

            {/* Quick Actions in Telemetry Bar */}
            <div className="telemetry-actions">
              <button
                className="btn btn-sm btn-ghost"
                onClick={handleSimulateUplink}
                title="Inject simulated incoming test message"
                onMouseEnter={() => sfx.playHover()}
              >
                <PlusCircle size={14} />
                <span>Simulate Uplink</span>
              </button>

              <button
                className="btn btn-sm btn-outline lock-vault-btn"
                onClick={handleLock}
                title="Lock Command Vault and require passcode"
                onMouseEnter={() => sfx.playHover()}
              >
                <Lock size={14} />
                <span>Lock Vault</span>
              </button>
            </div>
          </div>

          {/* Main Inbox Dashboard Grid */}
          <div className="inbox-dashboard-grid">
            {/* ════════════ Left Column: Transmission List ════════════ */}
            <div className="inbox-list-column panel">
              {/* Search & Filter Header */}
              <div className="inbox-list-controls">
                <div className="inbox-search-box">
                  <Search size={16} className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search transmissions, senders, subjects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="inbox-search-input"
                  />
                  {searchQuery && (
                    <button
                      className="search-clear-btn"
                      onClick={() => setSearchQuery("")}
                    >
                      ×
                    </button>
                  )}
                </div>

                <div className="inbox-filter-chips">
                  <button
                    className={`filter-chip ${filter === "all" ? "active" : ""}`}
                    onClick={() => {
                      sfx.playClick();
                      setFilter("all");
                    }}
                  >
                    All ({messages.length})
                  </button>
                  <button
                    className={`filter-chip ${filter === "unread" ? "active" : ""}`}
                    onClick={() => {
                      sfx.playClick();
                      setFilter("unread");
                    }}
                  >
                    Unread ({stats.unread})
                  </button>
                  <button
                    className={`filter-chip ${filter === "starred" ? "active" : ""}`}
                    onClick={() => {
                      sfx.playClick();
                      setFilter("starred");
                    }}
                  >
                    Starred ({stats.starred})
                  </button>
                </div>
              </div>

              {/* Message Items Scroll Container */}
              <div className="inbox-messages-scroll">
                {filteredMessages.length === 0 ? (
                  <div className="inbox-empty-state">
                    <InboxIcon size={36} className="empty-icon" />
                    <h4>No Transmissions Found</h4>
                    <p>
                      {searchQuery
                        ? "No transmissions match your search criteria."
                        : "No messages in this category yet."}
                    </p>
                    <div className="empty-actions">
                      <button
                        className="btn btn-sm btn-outline"
                        onClick={handleSimulateUplink}
                      >
                        Simulate Test Uplink
                      </button>
                      <button
                        className="btn btn-sm btn-ghost"
                        onClick={handleRestoreSeeds}
                      >
                        Restore Sample Intel
                      </button>
                    </div>
                  </div>
                ) : (
                  filteredMessages.map((msg) => {
                    const isSelected = msg.id === selectedId;
                    const isUnread = msg.status === "unread";
                    const formattedDate = new Date(msg.timestamp).toLocaleDateString([], {
                      month: "short",
                      day: "numeric",
                    });

                    return (
                      <motion.div
                        key={msg.id}
                        className={`inbox-message-item ${isSelected ? "selected" : ""} ${isUnread ? "unread" : ""}`}
                        onClick={() => handleSelectMessage(msg)}
                        onMouseEnter={() => sfx.playHover()}
                        layout
                      >
                        <div className="msg-item-top">
                          <div className="msg-sender-info">
                            {isUnread && <span className="unread-dot" title="Unread Directive" />}
                            <span className="msg-sender-name">{msg.name}</span>
                          </div>
                          <span className="msg-date">{formattedDate}</span>
                        </div>

                        <div className="msg-subject">{msg.subject}</div>
                        <div className="msg-preview">{msg.message}</div>

                        <div className="msg-item-bottom">
                          <span className="msg-tag">{msg.origin}</span>
                          <div className="msg-quick-actions">
                            <button
                              className={`star-btn ${msg.starred ? "starred" : ""}`}
                              onClick={(e) => handleToggleStar(msg.id, e)}
                              title={msg.starred ? "Unflag transmission" : "Flag as high priority"}
                            >
                              <Star size={14} fill={msg.starred ? "currentColor" : "none"} />
                            </button>
                            <button
                              className="delete-btn"
                              onClick={(e) => handleDeleteMessage(msg.id, e)}
                              title="Purge transmission"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>

              {/* List Footer Toolbar */}
              <div className="inbox-list-footer">
                <button
                  className="btn-text-action"
                  onClick={() => {
                    inboxService.markAllAsRead();
                    refreshMessages();
                    showToast("All marked as read.");
                  }}
                  disabled={stats.unread === 0}
                >
                  <CheckCircle2 size={13} />
                  <span>Mark all read</span>
                </button>

                <button
                  className="btn-text-action text-danger"
                  onClick={handleClearAll}
                  disabled={messages.length === 0}
                >
                  <Trash2 size={13} />
                  <span>Purge Vault</span>
                </button>
              </div>
            </div>

            {/* ════════════ Right Column: Decrypted Inspector ════════════ */}
            <div className="inbox-inspector-column panel">
              {selectedMessage ? (
                <div className="inspector-content">
                  {/* Inspector Header */}
                  <div className="inspector-header">
                    <div className="inspector-header-left">
                      <div className="inspector-security-seal">
                        <ShieldCheck size={18} />
                        <span>{selectedMessage.securityLevel}</span>
                      </div>
                      <span className="inspector-checksum">
                        CHECKSUM: <code>{selectedMessage.checksum}</code>
                      </span>
                    </div>

                    <div className="inspector-header-actions">
                      <button
                        className={`btn btn-sm btn-icon ${selectedMessage.starred ? "starred" : ""}`}
                        onClick={(e) => handleToggleStar(selectedMessage.id, e)}
                        title={selectedMessage.starred ? "Unflag" : "Flag as High Priority"}
                        onMouseEnter={() => sfx.playHover()}
                      >
                        <Star size={16} fill={selectedMessage.starred ? "currentColor" : "none"} />
                      </button>

                      <button
                        className="btn btn-sm btn-icon"
                        onClick={() => handleCopyPayload(selectedMessage)}
                        title="Copy decrypted transmission"
                        onMouseEnter={() => sfx.playHover()}
                      >
                        <Copy size={16} />
                      </button>

                      <button
                        className="btn btn-sm btn-icon"
                        onClick={() => handleExportTxt(selectedMessage)}
                        title="Export transmission log"
                        onMouseEnter={() => sfx.playHover()}
                      >
                        <Download size={16} />
                      </button>

                      <button
                        className="btn btn-sm btn-icon btn-danger-icon"
                        onClick={(e) => handleDeleteMessage(selectedMessage.id, e)}
                        title="Purge transmission"
                        onMouseEnter={() => sfx.playHover()}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Metadata Header Block */}
                  <div className="inspector-meta-block">
                    <h3 className="inspector-subject">{selectedMessage.subject}</h3>

                    <div className="inspector-dossier-grid">
                      <div className="dossier-item">
                        <span className="dossier-label">FROM:</span>
                        <span className="dossier-val font-highlight">{selectedMessage.name}</span>
                      </div>
                      <div className="dossier-item">
                        <span className="dossier-label">EMAIL:</span>
                        <a
                          href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject)}`}
                          className="dossier-val dossier-link"
                          target="_blank"
                          rel="noreferrer"
                        >
                          {selectedMessage.email}
                          <ExternalLink size={12} />
                        </a>
                      </div>
                      <div className="dossier-item">
                        <span className="dossier-label">ORIGIN:</span>
                        <span className="dossier-val tag-pill">{selectedMessage.origin}</span>
                      </div>
                      <div className="dossier-item">
                        <span className="dossier-label">TIMESTAMP:</span>
                        <span className="dossier-val">
                          {new Date(selectedMessage.timestamp).toLocaleString("en-US", {
                            dateStyle: "full",
                            timeStyle: "medium",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Decrypted Payload Terminal Body */}
                  <div className="inspector-terminal-payload">
                    <div className="terminal-header-bar">
                      <span className="terminal-title">
                        DECRYPTED SECURE PAYLOAD
                      </span>
                      <span className="terminal-dot green" />
                    </div>
                    <div className="terminal-body-text">
                      {selectedMessage.message}
                    </div>
                  </div>

                  {/* Reply Directive Actions */}
                  <div className="inspector-footer-actions">
                    <a
                      href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject)}`}
                      className="btn btn-primary reply-mail-btn"
                      onMouseEnter={() => sfx.playHover()}
                    >
                      <Mail size={16} />
                      <span>REPLY VIA EMAIL CLIENT</span>
                    </a>

                    <Link
                      to="/contact"
                      className="btn btn-outline"
                      onMouseEnter={() => sfx.playHover()}
                    >
                      <Send size={15} />
                      <span>Transmit New Uplink</span>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="inspector-placeholder">
                  <InboxIcon size={48} className="placeholder-icon" />
                  <h3>No Transmission Selected</h3>
                  <p>Choose an uplink from the transmission register to inspect and decrypt.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
