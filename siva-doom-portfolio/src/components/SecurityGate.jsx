import { useState, useEffect, useCallback } from "react";
import { Shield, ShieldAlert, Lock, Unlock, Fingerprint, KeyRound, AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { sfx } from "../utils/sfx";
import { inboxService } from "../services/inboxService";

export default function SecurityGate({ onUnlock, onCancel }) {

  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const handleDigit = useCallback((digit) => {
    if (isScanning || scanSuccess) return;
    setError(false);
    setErrorMessage("");
    sfx.playPinClick();

    setPin((prev) => {
      if (prev.length >= 6) return prev;
      const next = prev + digit;
      return next;
    });
  }, [isScanning, scanSuccess]);

  const handleBackspace = useCallback(() => {
    if (isScanning || scanSuccess) return;
    sfx.playPinClick();
    setPin((prev) => prev.slice(0, -1));
    setError(false);
    setErrorMessage("");
  }, [isScanning, scanSuccess]);

  const handleClear = useCallback(() => {
    if (isScanning || scanSuccess) return;
    sfx.playClick();
    setPin("");
    setError(false);
    setErrorMessage("");
  }, [isScanning, scanSuccess]);

  const handleVerify = useCallback((codeToTest) => {
    const candidate = codeToTest !== undefined ? codeToTest : pin;
    if (!candidate || candidate.length < 3) {
      setError(true);
      setErrorMessage("Enter authorized security passcode (e.g. 3000)");
      sfx.playAccessDenied();
      return;
    }

    const isValid = inboxService.verifyPin(candidate);
    if (isValid) {
      setError(false);
      setScanSuccess(true);
      sfx.playAccessGranted();
      inboxService.setSessionUnlocked(true);
      setTimeout(() => {
        onUnlock();
      }, 750);
    } else {
      setError(true);
      setErrorMessage("ACCESS DENIED — Invalid security cipher code.");
      sfx.playAccessDenied();
      setPin("");
    }
  }, [pin, onUnlock]);

  // Auto-verify when 4 digits are reached if it matches
  useEffect(() => {
    if (pin.length === 4) {
      if (inboxService.verifyPin(pin)) {
        handleVerify(pin);
      }
    }
  }, [pin, handleVerify]);

  // Keyboard support for digits, backspace, and enter
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isScanning || scanSuccess) return;

      if (e.key >= "0" && e.key <= "9") {
        e.preventDefault();
        handleDigit(e.key);
      } else if (e.key === "Backspace") {
        e.preventDefault();
        handleBackspace();
      } else if (e.key === "Enter") {
        e.preventDefault();
        handleVerify();
      } else if (e.key === "Escape") {
        if (onCancel) onCancel();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleDigit, handleBackspace, handleVerify, onCancel, isScanning, scanSuccess]);

  // Biometric / Authorized Bypass simulation
  const handleBiometricOverride = () => {
    if (isScanning || scanSuccess) return;
    setIsScanning(true);
    setError(false);
    sfx.playTransmission();

    setTimeout(() => {
      setIsScanning(false);
      setScanSuccess(true);
      sfx.playAccessGranted();
      inboxService.setSessionUnlocked(true);
      setTimeout(() => {
        onUnlock();
      }, 650);
    }, 1100);
  };

  const keypad = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    ["CLR", "0", "DEL"]
  ];

  return (
    <div className="security-gate-wrapper">
      <motion.div
        className={`security-gate-panel ${error ? "gate-error-shake" : ""} ${scanSuccess ? "gate-success" : ""}`}
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Top Security Banner */}
        <div className="gate-header">
          <div className="gate-icon-pulse">
            {scanSuccess ? (
              <Unlock size={28} className="icon-success" />
            ) : error ? (
              <ShieldAlert size={28} className="icon-error" />
            ) : (
              <Lock size={28} className="icon-lock" />
            )}
          </div>
          <div className="gate-title-block">
            <span className="gate-eyebrow">
              CYBER SECURITY // RESTRICTED ACCESS
            </span>
            <h2 className="gate-heading">
              Command Transmission Vault
            </h2>
            <p className="gate-subtext">
              Operational transmissions restricted to authorized personnel. Provide cipher passcode (Default: 3000) or initiate biometric bypass to decrypt communications.
            </p>
          </div>
        </div>

        {/* PIN Display Visualizer */}
        <div className="gate-display-box">
          <div className="gate-code-dots" aria-label="Passcode digits">
            {[0, 1, 2, 3].map((idx) => {
              const filled = pin.length > idx;
              return (
                <div
                  key={idx}
                  className={`code-dot ${filled ? "filled" : ""} ${error ? "error" : ""} ${scanSuccess ? "success" : ""}`}
                >
                  {filled ? "•" : ""}
                </div>
              );
            })}
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                className="gate-status-message error"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <AlertCircle size={14} />
                <span>{errorMessage}</span>
              </motion.div>
            )}
            {scanSuccess && (
              <motion.div
                className="gate-status-message success"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Unlock size={14} />
                <span>CLEARANCE VERIFIED — DECRYPTING TRANSMISSION ARCHIVES...</span>
              </motion.div>
            )}
            {isScanning && (
              <motion.div
                className="gate-status-message scanning"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <RefreshCw size={14} className="spin-inline" />
                <span>SCANNING BIOMETRIC SIGNATURE & TELEMETRY...</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Interactive Numeric Keypad */}
        <div className="gate-keypad-grid">
          {keypad.map((row, rIdx) => (
            <div key={rIdx} className="keypad-row">
              {row.map((btnVal) => {
                const isSpecial = btnVal === "CLR" || btnVal === "DEL";
                return (
                  <button
                    key={btnVal}
                    type="button"
                    className={`keypad-key ${isSpecial ? "key-special" : ""}`}
                    disabled={isScanning || scanSuccess}
                    onClick={() => {
                      if (btnVal === "CLR") handleClear();
                      else if (btnVal === "DEL") handleBackspace();
                      else handleDigit(btnVal);
                    }}
                    onMouseEnter={() => sfx.playHover()}
                  >
                    {btnVal}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Action Controls */}
        <div className="gate-actions">
          <button
            type="button"
            className="btn btn-primary gate-unlock-btn"
            onClick={() => handleVerify()}
            disabled={isScanning || scanSuccess || pin.length === 0}
            onMouseEnter={() => sfx.playHover()}
          >
            <KeyRound size={16} />
            <span>DECRYPT & UNLOCK</span>
          </button>

          <button
            type="button"
            className={`btn gate-biometric-btn ${isScanning ? "scanning" : ""}`}
            onClick={handleBiometricOverride}
            disabled={isScanning || scanSuccess}
            onMouseEnter={() => sfx.playHover()}
            title="Siva Authorized Biometric Bypass"
          >
            <Fingerprint size={18} />
            <span>{isScanning ? "VERIFYING SIGNATURE..." : "BIOMETRIC OVERRIDE (SIVA)"}</span>
          </button>
        </div>

        {/* Security Help & Quick Hint */}
        <div className="gate-footer-hint">
          <button
            type="button"
            className="gate-hint-toggle"
            onClick={() => {
              sfx.playClick();
              setShowHint(!showHint);
            }}
          >
            {showHint ? "Hide Security Hint" : "Need Security Clearance Hint?"}
          </button>

          {showHint && (
            <motion.div
              className="gate-hint-box"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
            >
              <code>AUTHORIZED MASTER PIN: 3000</code>
              <small>
                (Hint: Tony Stark&apos;s &quot;3000&quot;, &quot;1993&quot;, or &quot;DOOM&quot;. You can also click Biometric Override anytime.)
              </small>
            </motion.div>
          )}

          {onCancel && (
            <button
              type="button"
              className="gate-back-btn"
              onClick={() => {
                sfx.playClick();
                onCancel();
              }}
            >
              <ArrowLeft size={14} />
              <span>Return to Portfolio</span>
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
