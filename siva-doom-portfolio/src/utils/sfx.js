// ═══════════════════════════════════════════════════════════════════
// SIVA S PORTFOLIO — HYBRID SFX & BGM AUDIO ENGINE
// Includes Loser.mp3 BGM Player + Custom SFX + Web Audio API fallback
// ═══════════════════════════════════════════════════════════════════

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.audioCache = {};
    this.bgmAudio = null;
    this.bgmPlaying = false;
    this.enabled = typeof window !== "undefined" ? localStorage.getItem("portfolio-sfx") === "true" : false;
  }

  initCtx() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    if (typeof window !== "undefined") {
      localStorage.setItem("portfolio-sfx", String(this.enabled));
    }
    if (this.enabled) {
      this.initCtx();
      this.playTone(880, 0.1, "sine");
    } else if (this.bgmPlaying) {
      this.stopBgm();
    }
    return this.enabled;
  }

  // 🎵 BGM CONTROLLER FOR Loser.mp3
  toggleBgm() {
    if (typeof window === "undefined") return false;

    if (!this.bgmAudio) {
      this.bgmAudio = new Audio("/sounds/Loser.mp3");
      this.bgmAudio.loop = true;
      this.bgmAudio.volume = 0.45;
    }

    if (this.bgmPlaying) {
      this.bgmAudio.pause();
      this.bgmPlaying = false;
    } else {
      this.enabled = true; // Auto-enable audio if user explicitly plays music
      localStorage.setItem("portfolio-sfx", "true");
      this.initCtx();
      const promise = this.bgmAudio.play();
      if (promise !== undefined) {
        promise.then(() => {
          this.bgmPlaying = true;
        }).catch((err) => {
          console.warn("BGM playback interrupted:", err);
          this.bgmPlaying = false;
        });
      }
    }
    return this.bgmPlaying;
  }

  stopBgm() {
    if (this.bgmAudio && this.bgmPlaying) {
      this.bgmAudio.pause();
      this.bgmPlaying = false;
    }
  }

  setVolume(val) {
    if (!this.bgmAudio) {
      this.bgmAudio = new Audio("/sounds/Loser.mp3");
      this.bgmAudio.loop = true;
    }
    const clamped = Math.max(0.05, Math.min(1.0, val));
    this.bgmAudio.volume = clamped;
    return clamped;
  }

  adjustVolume(delta) {
    if (!this.bgmAudio) return 0.45;
    return this.setVolume(this.bgmAudio.volume + delta);
  }

  playLoser() {
    if (!this.bgmPlaying) {
      this.toggleBgm();
    }
  }

  // Plays custom file from /sounds/<filename> if available, or calls fallbackFn
  playFileOrFallback(filename, fallbackFn) {
    if (!this.enabled) return;

    const soundPath = `/sounds/${filename}`;
    let audio = this.audioCache[filename];

    if (!audio) {
      audio = new Audio(soundPath);
      this.audioCache[filename] = audio;
    }

    const promise = audio.cloneNode().play();
    if (promise !== undefined) {
      promise.catch(() => {
        if (fallbackFn) fallbackFn();
      });
    }
  }

  // Low-level Web Audio API tone synthesizer
  playTone(freq = 440, duration = 0.08, type = "sine", gainVal = 0.05) {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Ignore
    }
  }

  playThemeSwitch() {
    this.playFileOrFallback("doom.mp3", () => {
      this.playTone(300, 0.08, "sawtooth", 0.05);
      setTimeout(() => this.playTone(200, 0.1, "sawtooth", 0.06), 70);
      setTimeout(() => this.playTone(110, 0.18, "square", 0.07), 140);
    });
  }

  playHover() {
    this.playFileOrFallback("hover.mp3", () => {
      this.playTone(1200, 0.02, "sine", 0.015);
    });
  }

  playClick() {
    this.playFileOrFallback("click.mp3", () => {
      this.playTone(600, 0.05, "triangle", 0.03);
    });
  }

  playKeypress() {
    this.playFileOrFallback("keypress.mp3", () => {
      this.playTone(800 + Math.random() * 400, 0.02, "square", 0.01);
    });
  }

  playWarning() {
    this.playFileOrFallback("warning.mp3", () => {
      this.playTone(180, 0.15, "sawtooth", 0.08);
    });
  }

  playTransmission() {
    this.playFileOrFallback("transmission.mp3", () => {
      this.playTone(440, 0.1, "sine", 0.05);
      setTimeout(() => this.playTone(880, 0.15, "triangle", 0.06), 80);
    });
  }

  playAccessGranted() {
    this.playFileOrFallback("access_granted.mp3", () => {
      this.playTone(523.25, 0.08, "sine", 0.06); // C5
      setTimeout(() => this.playTone(659.25, 0.08, "sine", 0.06), 70); // E5
      setTimeout(() => this.playTone(783.99, 0.1, "triangle", 0.07), 140); // G5
      setTimeout(() => this.playTone(1046.5, 0.18, "sine", 0.08), 210); // C6
    });
  }

  playAccessDenied() {
    this.playFileOrFallback("access_denied.mp3", () => {
      this.playTone(180, 0.12, "sawtooth", 0.09);
      setTimeout(() => this.playTone(120, 0.22, "sawtooth", 0.1), 100);
    });
  }

  playPinClick() {
    this.playTone(950 + Math.random() * 200, 0.03, "sine", 0.03);
  }
}

export const sfx = new SoundEngine();

