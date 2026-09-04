import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Mic, MicOff, Volume2, VolumeX, X, Send, Bot, MessageSquare } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { sfx } from "../utils/sfx";
import { processVoiceCommand } from "../utils/voiceCommands";

// ═══════════════════════════════════════════════════════════════════
// SIVA S PORTFOLIO — VERONICA AI VOICE ASSISTANT & CHATBOT
// Dual Accessibility: Live Voice Speech Recognition + Interactive Text Chat
// ═══════════════════════════════════════════════════════════════════

const SpeechRecognition = typeof window !== "undefined"
  ? window.SpeechRecognition || window.webkitSpeechRecognition
  : null;

export default function VoiceAssistant() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const [hasSpeechRecognition] = useState(() => !!SpeechRecognition);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | listening | speaking
  const [isOpen, setIsOpen] = useState(false);
  const [voiceMuted, setVoiceMuted] = useState(false);
  const [textInput, setTextInput] = useState("");

  // Dynamic time-aware initial greeting
  const [messages, setMessages] = useState(() => {
    const hour = new Date().getHours();
    const timeGreet = hour >= 4 && hour < 12 ? "Good morning" : hour >= 12 && hour < 17 ? "Good afternoon" : "Good evening";
    return [{
      id: "init",
      sender: "ai",
      text: `${timeGreet}, sir. I am Veronica, your tactical AI assistant. Type or speak any directive — I can navigate the portfolio, run diagnostics, inspect projects, play music, explain technical concepts, or connect you directly with Siva.`,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }];
  });

  const isSessionActiveRef = useRef(false);
  const statusRef = useRef("idle");
  const voiceMutedRef = useRef(false);
  const recognitionRef = useRef(null);
  const synthRef = useRef(typeof window !== "undefined" ? window.speechSynthesis : null);
  const voicesRef = useRef([]);  // Preloaded voices cache — critical for Chrome
  const resumeTimerRef = useRef(null);  // Chrome long-utterance resume workaround
  const restartTimer = useRef(null);
  const chatBottomRef = useRef(null);

  // Keep refs synced with states for async event handlers
  useEffect(() => {
    isSessionActiveRef.current = isSessionActive;
  }, [isSessionActive]);

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  useEffect(() => {
    voiceMutedRef.current = voiceMuted;
  }, [voiceMuted]);

  // Scroll chat to bottom when messages update
  useEffect(() => {
    if (isOpen && chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  // ═══ CRITICAL: Preload SpeechSynthesis voices ═══════════════════
  // Chrome loads voices asynchronously. getVoices() returns [] until
  // the 'voiceschanged' event fires. We cache them in voicesRef.
  useEffect(() => {
    const synth = synthRef.current;
    if (!synth) return;

    const loadVoices = () => {
      const allVoices = synth.getVoices();
      if (allVoices.length > 0) {
        voicesRef.current = allVoices;
        console.log(`[Veronica] ${allVoices.length} voices loaded`);
      }
    };

    // Try immediately (Firefox loads synchronously)
    loadVoices();

    // Listen for async load (Chrome, Edge)
    synth.addEventListener("voiceschanged", loadVoices);
    return () => synth.removeEventListener("voiceschanged", loadVoices);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isSessionActiveRef.current = false;
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch {}
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
      clearTimeout(restartTimer.current);
      clearInterval(resumeTimerRef.current);
    };
  }, []);

  // Execute the action returned by the command engine with full portfolio access
  const executeAction = useCallback((action) => {
    if (!action) return;

    switch (action.type) {
      case "navigate":
        setTimeout(() => navigate(action.payload), 300);
        break;

      case "theme":
        if (action.payload === "toggle") {
          toggleTheme();
        } else if (action.payload === "ironman" && theme !== "ironman") {
          toggleTheme();
        } else if (action.payload === "doom" && theme !== "doom") {
          toggleTheme();
        }
        break;

      case "music":
        if (action.payload === "play" && !sfx.bgmPlaying) {
          sfx.toggleBgm();
        } else if (action.payload === "stop" && sfx.bgmPlaying) {
          sfx.toggleBgm();
        } else if (action.payload === "toggle") {
          sfx.toggleBgm();
        }
        break;

      case "volume":
        sfx.adjustVolume(action.payload);
        break;

      case "sfx":
        if (action.payload === "on" && !sfx.enabled) {
          sfx.toggle();
        } else if (action.payload === "off" && sfx.enabled) {
          sfx.toggle();
        }
        break;

      case "scroll":
        if (action.payload === "down") {
          window.scrollBy({ top: 520, behavior: "smooth" });
        } else if (action.payload === "up") {
          window.scrollBy({ top: -520, behavior: "smooth" });
        } else if (action.payload === "top") {
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else if (action.payload === "bottom") {
          window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
        }
        break;

      case "link":
        if (action.payload.startsWith("mailto:") || action.payload.startsWith("tel:")) {
          window.location.href = action.payload;
        } else {
          window.open(action.payload, "_blank", "noopener,noreferrer");
        }
        break;

      case "modal":
        navigate("/projects");
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent("open-project-modal", { detail: action.payload }));
        }, 400);
        break;

      case "close-modal":
        window.dispatchEvent(new CustomEvent("close-project-modal"));
        break;

      case "focus-contact":
        navigate("/contact");
        setTimeout(() => {
          const inputEl = document.getElementById("contact_name");
          if (inputEl) inputEl.focus();
        }, 450);
        break;

      case "terminal":
        setTimeout(() => {
          navigate("/skills");
          setTimeout(() => {
            const terminalEl = document.querySelector(".terminal-cli-container");
            if (terminalEl) terminalEl.scrollIntoView({ behavior: "smooth" });
          }, 300);
        }, 350);
        break;

      default:
        break;
    }
  }, [navigate, theme, toggleTheme]);

  // Forward declarations for mutual calls
  const startRecognitionRef = useRef(null);

  // Stop session completely
  const stopSession = useCallback(() => {
    isSessionActiveRef.current = false;
    setIsSessionActive(false);
    setStatus("idle");
    statusRef.current = "idle";
    clearTimeout(restartTimer.current);

    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch {}
      recognitionRef.current = null;
    }
    if (synthRef.current) {
      synthRef.current.cancel();
    }
  }, []);

  // ═══ Pick the best female voice from cached voicesRef ═══════════
  const pickFemaleVoice = useCallback(() => {
    const voices = voicesRef.current;
    if (!voices.length) return null;

    // Priority 1: British English female (FRIDAY / JARVIS style)
    const gbFemale = voices.find(v => {
      const n = v.name.toLowerCase();
      const l = v.lang.toLowerCase();
      return l.includes("en-gb") && (n.includes("female") || n.includes("libby") || n.includes("sonia") || n.includes("hazel"));
    });
    if (gbFemale) return gbFemale;

    // Priority 2: Any English female
    const enFemale = voices.find(v => {
      const n = v.name.toLowerCase();
      return v.lang.toLowerCase().startsWith("en") &&
        (n.includes("google uk english female") || n.includes("female") || n.includes("victoria") ||
         n.includes("samantha") || n.includes("jenny") || n.includes("aria") ||
         n.includes("zira") || n.includes("karen"));
    });
    if (enFemale) return enFemale;

    // Priority 3: Any voice with "female" or known female name
    const anyFemale = voices.find(v => {
      const n = v.name.toLowerCase();
      return n.includes("female") || n.includes("zira") || n.includes("samantha");
    });
    if (anyFemale) return anyFemale;

    // Priority 4: Any English voice
    return voices.find(v => v.lang.toLowerCase().startsWith("en")) || null;
  }, []);

  // Speak text using female SpeechSynthesis and handle session continuation
  const speak = useCallback((text, action) => {
    // If voice audio is muted by user, simply execute action directly!
    if (voiceMutedRef.current || !synthRef.current) {
      executeAction(action);
      if (action?.type === "exit") stopSession();
      return;
    }

    synthRef.current.cancel();
    clearInterval(resumeTimerRef.current);

    // Immediately mark as speaking to block onend race condition
    setStatus("speaking");
    statusRef.current = "speaking";
    clearTimeout(restartTimer.current);

    // Stop recognition right now to prevent Veronica from hearing her own voice
    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch {}
      recognitionRef.current = null;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.02;
    utterance.pitch = 1.15;
    utterance.volume = 0.92;

    // Use preloaded cached voice (fixes Chrome async voice loading bug)
    const chosenVoice = pickFemaleVoice();
    if (chosenVoice) {
      utterance.voice = chosenVoice;
    }

    utterance.onstart = () => {
      sfx.playTone(920, 0.04, "sine", 0.03);
      setStatus("speaking");
      statusRef.current = "speaking";

      // Chrome bug workaround: Chrome pauses long utterances after ~15s.
      // We poll speechSynthesis.speaking and call resume() to keep it alive.
      clearInterval(resumeTimerRef.current);
      resumeTimerRef.current = setInterval(() => {
        if (synthRef.current && synthRef.current.speaking) {
          synthRef.current.resume();
        } else {
          clearInterval(resumeTimerRef.current);
        }
      }, 5000);
    };

    utterance.onend = () => {
      clearInterval(resumeTimerRef.current);
      executeAction(action);

      if (action?.type === "exit") {
        stopSession();
      } else if (isSessionActiveRef.current) {
        setTimeout(() => {
          if (isSessionActiveRef.current && statusRef.current !== "speaking") {
            setStatus("listening");
            statusRef.current = "listening";
            if (startRecognitionRef.current) {
              startRecognitionRef.current();
            }
          }
        }, 450);
      } else {
        setStatus("idle");
        statusRef.current = "idle";
      }
    };

    utterance.onerror = (e) => {
      clearInterval(resumeTimerRef.current);
      console.warn("[Veronica] Speech error:", e.error);
      if (isSessionActiveRef.current) {
        setTimeout(() => {
          if (isSessionActiveRef.current) {
            setStatus("listening");
            statusRef.current = "listening";
            if (startRecognitionRef.current) startRecognitionRef.current();
          }
        }, 300);
      } else {
        setStatus("idle");
        statusRef.current = "idle";
      }
    };

    synthRef.current.speak(utterance);
  }, [executeAction, stopSession, pickFemaleVoice]);

  // Dispatch directive (from voice, typing, or quick chips)
  const dispatchDirective = useCallback((rawQuery) => {
    const query = (rawQuery || "").trim();
    if (!query) return;

    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    // Append user message
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), sender: "user", text: query, time },
    ]);

    const result = processVoiceCommand(query);
    if (result) {
      // Append AI response
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { id: Date.now() + 1, sender: "ai", text: result.text, time },
        ]);
        speak(result.text, result.action);
      }, 100);
    }
  }, [speak]);

  // Low-level recognition runner
  const startRecognition = useCallback(() => {
    if (!SpeechRecognition || !isSessionActiveRef.current) return;
    if (statusRef.current === "speaking") return;

    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch {}
      recognitionRef.current = null;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;

    recognition.onstart = () => {
      setStatus("listening");
      statusRef.current = "listening";
    };

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      dispatchDirective(text);
    };

    recognition.onerror = (event) => {
      console.warn("Speech recognition event:", event.error);
      if (event.error === "not-allowed") {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            sender: "ai",
            text: "Microphone permission is denied or unavailable. You can continue typing directives below as a chatbot!",
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
        stopSession();
      }
    };

    recognition.onend = () => {
      recognitionRef.current = null;
      if (isSessionActiveRef.current && statusRef.current !== "speaking") {
        clearTimeout(restartTimer.current);
        restartTimer.current = setTimeout(() => {
          if (isSessionActiveRef.current && statusRef.current !== "speaking") {
            startRecognition();
          }
        }, 200);
      }
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
    } catch (err) {
      console.warn("Failed to start speech recognition:", err);
    }
  }, [dispatchDirective, stopSession]);

  useEffect(() => {
    startRecognitionRef.current = startRecognition;
  }, [startRecognition]);

  // Start complete continuous session (Voice Mode)
  const startVoiceSession = useCallback(() => {
    setIsOpen(true);
    if (!hasSpeechRecognition) return;

    isSessionActiveRef.current = true;
    setIsSessionActive(true);
    setStatus("listening");
    statusRef.current = "listening";
    sfx.playClick();

    startRecognition();
  }, [hasSpeechRecognition, startRecognition]);

  // Open Chatbot Panel (Text Mode or Voice)
  const openChatbot = useCallback(() => {
    setIsOpen((prev) => !prev);
    sfx.playClick();
  }, []);

  // Handle typed chat submission
  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!textInput.trim()) return;
    sfx.playClick();
    const query = textInput;
    setTextInput("");
    dispatchDirective(query);
  };

  // Toggle voice recognition microphone on/off inside HUD
  const toggleMicInHUD = () => {
    sfx.playClick();
    if (isSessionActive) {
      stopSession();
    } else {
      startVoiceSession();
    }
  };

  // Toggle TTS Audio Mute
  const toggleMuteTTS = () => {
    sfx.playClick();
    setVoiceMuted((prev) => !prev);
    if (!voiceMuted && synthRef.current) {
      synthRef.current.cancel();
    }
  };

  return (
    <>
      {/* ── Navbar Launcher Button (Mic + Chat trigger) ─────────── */}
      <button
        className={`voice-btn ${isSessionActive ? (status !== "idle" ? status : "listening") : ""}`}
        onClick={openChatbot}
        onMouseEnter={() => sfx.playHover()}
        title="Veronica AI — Tactical Voice Assistant & Chatbot"
        aria-label="Toggle Veronica AI Voice Assistant and Chatbot"
        id="voice-assistant-btn"
      >
        {isSessionActive && status === "speaking" ? (
          <>
            <Volume2 size={16} />
            <span className="voice-btn-label">SPEAKING</span>
          </>
        ) : isSessionActive ? (
          <>
            <div className="voice-waveform" aria-hidden="true">
              <span /><span /><span /><span /><span />
            </div>
            <span className="voice-btn-label">LISTENING</span>
          </>
        ) : (
          <>
            <Bot size={16} />
            <span className="voice-btn-label">
              // VERONICA
            </span>
          </>
        )}
      </button>

      {/* ── Floating Chatbot & Tactical HUD Panel ───────────────── */}
      {isOpen && (
        <div className={`voice-transcript voice-chatbot-panel ${status}`}>
          {/* Header Controls */}
          <div className="voice-transcript-header">
            <div className="voice-chatbot-header-left">
              <span className="voice-access-badge">
                ● VERONICA AI ONLINE
              </span>
              <span className="voice-mode-tag">
                {isSessionActive ? "VOICE ACTIVE" : "CHATBOT MODE"}
              </span>
            </div>

            <div className="voice-chatbot-header-actions">
              {/* Mic Toggle Button */}
              {hasSpeechRecognition && (
                <button
                  type="button"
                  className={`voice-ctrl-btn ${isSessionActive ? "active" : ""}`}
                  onClick={toggleMicInHUD}
                  title={isSessionActive ? "Disable Live Microphone" : "Enable Live Microphone"}
                  aria-label="Toggle microphone"
                >
                  {isSessionActive ? <Mic size={13} /> : <MicOff size={13} />}
                </button>
              )}

              {/* TTS Audio Mute Button */}
              <button
                type="button"
                className={`voice-ctrl-btn ${voiceMuted ? "muted" : ""}`}
                onClick={toggleMuteTTS}
                title={voiceMuted ? "Unmute Voice Audio" : "Mute Voice Audio"}
                aria-label="Toggle voice sound"
              >
                {voiceMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}
              </button>

              {/* Close Button */}
              <button
                type="button"
                className="voice-transcript-close"
                onClick={() => setIsOpen(false)}
                aria-label="Close Veronica AI panel"
                title="Close panel"
              >
                <X size={13} />
              </button>
            </div>
          </div>

          {/* Chat Messages Stream */}
          <div className="voice-chat-messages">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`voice-chat-bubble-row ${msg.sender === "user" ? "user-row" : "ai-row"}`}
              >
                <div className={`voice-chat-bubble ${msg.sender}`}>
                  <div className="voice-chat-bubble-meta">
                    <span className="voice-chat-author">
                      {msg.sender === "user" ? "YOU" : "VERONICA AI"}
                    </span>
                    <span className="voice-chat-time">{msg.time}</span>
                  </div>
                  <p className="voice-chat-text">{msg.text}</p>
                </div>
              </div>
            ))}
            <div ref={chatBottomRef} />
          </div>

          {/* Quick Directives Bar — top 6 most impactful for recruiters */}
          <div className="voice-quick-chips">
            <div className="voice-chips-row">
              <button type="button" className="voice-chip-btn" onClick={() => dispatchDirective("pitch siva")}>
                💼 Pitch Siva
              </button>
              <button type="button" className="voice-chip-btn" onClick={() => dispatchDirective("how can i contact siva")}>
                📬 Contact Siva
              </button>
              <button type="button" className="voice-chip-btn" onClick={() => dispatchDirective("status report")}>
                📊 Status Report
              </button>
              <button type="button" className="voice-chip-btn" onClick={() => dispatchDirective("inspect smartpanchayat")}>
                🔎 Inspect Project
              </button>
              <button type="button" className="voice-chip-btn" onClick={() => dispatchDirective("open encyclopedia")}>
                📚 Encyclopedia
              </button>
              <button type="button" className="voice-chip-btn" onClick={() => dispatchDirective("drop a needle")}>
                🎵 Play Music
              </button>
            </div>
          </div>

          {/* Chatbot Text Input Form */}
          <form className="voice-chat-input-form" onSubmit={handleChatSubmit}>
            <input
              type="text"
              className="voice-chat-input"
              placeholder="Ask Veronica anything (or speak)..."
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              aria-label="Type a directive for Veronica"
            />
            <button
              type="submit"
              className="voice-chat-send-btn"
              disabled={!textInput.trim()}
              aria-label="Send directive to Veronica"
              title="Send directive"
            >
              <Send size={13} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
