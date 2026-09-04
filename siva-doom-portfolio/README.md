# Siva-Doom-Portfolio

> **SIVA S — DevOps Engineer • Builder • Systems Thinker**  
> Dual-Theme Production Portfolio (**🦾 STARK MODE** × **☠️ DOOM MODE**) with Secure Server-Side Contact Uplink.

---

## ⚡ Overview

A self-contained personal engineering portfolio designed with:
- **Dual Visual Concept**:
  - **🦾 STARK MODE (`data-theme="stark"`)**: Graphite black, deep red, gold, cyan HUD telemetry, glass panels, arc-reactor circular geometry, futuristic command center aesthetic.
  - **☠️ DOOM MODE (`data-theme="doom"`)**: Charcoal, gunmetal, emerald green, crimson warnings, CRT scanlines, terminal CLI, classified underground engineering terminal.
- **Data Architecture**: Decoupled static data layer in `src/data/portfolio.js` with service accessors, prepared for headless CMS / API expansion without frontend redesigns.
- **Secure Contact Uplink**: Production-grade `POST /api/contact` serverless endpoint with Resend transactional email integration, sliding window IP rate limiting, bot honeypot protection, input sanitization, and zero client-side credential exposure.

---

## 🛠️ Technology Stack

- **Frontend**: [React 18](https://react.dev/), [Vite 6](https://vitejs.dev/), [React Router v7](https://reactrouter.com/)
- **Styling**: Vanilla CSS with CSS Custom Properties, dynamic theming engine, responsive layout
- **Animation & Icons**: [Framer Motion](https://www.framer.com/motion/), [Lucide React](https://lucide.dev/)
- **Backend / Serverless**: Node.js / Vercel Serverless Function (`api/contact.js`)
- **Email Delivery**: [Resend Transactional Email API](https://resend.com/)
- **Audio / HUD Effects**: Web Audio API Sound Generator & Synthesized HUD SFX (`src/utils/sfx.js`)

---

## 📁 Repository Structure

```text
siva-doom-portfolio/
│
├── api/
│   └── contact.js                # Serverless contact uplink handler (Rate limiting, Resend, Honeypot)
│
├── public/
│   ├── images/                   # Real project diagrams, profile portrait & hero artwork
│   └── sounds/                   # Background audio assets
│
├── src/
│   ├── components/
│   │   ├── BackgroundEffects.jsx # Scanlines, noise grain & atmospheric glows
│   │   ├── ErrorBoundary.jsx     # Production runtime error boundary with themed fallback UI
│   │   ├── Footer.jsx            # Dynamic themed footer with social links
│   │   ├── Navbar.jsx            # Responsive navigation, mobile drawer & telemetry status
│   │   ├── PageShell.jsx         # Uniform animated page wrapper with HUD headers
│   │   ├── ProjectCard.jsx       # Interactive prototype card
│   │   ├── ProjectModal.jsx      # Technical specification inspect modal
│   │   ├── ScrollToTop.jsx       # Route-change instant scroll restoration
│   │   ├── SectionTitle.jsx      # HUD-styled section headings
│   │   ├── SkillGroup.jsx        # Modular categorized skill panel
│   │   ├── SystemTelemetry.jsx   # Live system status bar with theme and audio status
│   │   ├── TerminalCLI.jsx       # Interactive terminal command shell
│   │   ├── ThemeSwitcher.jsx     # Global STARK ⇄ DOOM switcher
│   │   └── ThemeTransition.jsx   # Cinematic portal transition overlay
│   │
│   ├── context/
│   │   └── ThemeContext.jsx      # Theme state management & localStorage persistence
│   │
│   ├── data/
│   │   └── portfolio.js          # Centralized portfolio data & future-CMS accessor functions
│   │
│   ├── pages/
│   │   ├── Home.jsx              # Hero section, system status, impact stats, featured work
│   │   ├── About.jsx             # Personnel dossier, engineering philosophy, education
│   │   ├── Skills.jsx            # Technology arsenal, domain filter, interactive CLI
│   │   ├── Projects.jsx          # Prototype gallery with deep-dive specification modals
│   │   ├── Experience.jsx        # Deployment timeline and enterprise track record
│   │   ├── Contact.jsx           # Secure contact uplink form with live validation
│   │   └── NotFound.jsx          # 404 Route handler with themed return actions
│   │
│   ├── services/
│   │   └── contactService.js     # Client API communication service
│   │
│   ├── utils/
│   │   └── sfx.js                # Web Audio sound engine for interactive feedback
│   │
│   ├── App.jsx                   # Route composition & root layout
│   ├── main.jsx                  # React DOM mount
│   └── styles.css                # Core design system tokens, themes & animations
│
├── .env.example                  # Environment variable blueprint
├── .gitignore                    # Comprehensive secrets & build artifact exclusion
├── index.html                    # HTML shell with Google Fonts & anti-flash theme script
├── package.json                  # Dependencies & execution scripts
├── vercel.json                   # Security headers (CSP, HSTS, X-Frame-Options) & route rewrites
├── vite.config.js                # Vite build config with dev API middleware
└── README.md                     # Project documentation
```

---

## 🚀 Getting Started

### 1. Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd siva-doom-portfolio

# Install dependencies
npm install
```

### 2. Environment Configuration

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Configure your environment variables in `.env.local`:

```env
# Resend API Key (Obtain from https://resend.com/api-keys)
RESEND_API_KEY=re_your_api_key_here

# Destination Email where contact messages will be delivered
CONTACT_TO_EMAIL=sivasathiya0606@gmail.com

# Verified Sender Email (e.g., onboarding@resend.dev or your custom domain)
CONTACT_FROM_EMAIL=Portfolio Contact <onboarding@resend.dev>
```

> **Security Note**: Never prefix private email keys with `VITE_`. The contact endpoint operates server-side, keeping all credentials isolated from the browser.

### 3. Local Development

```bash
npm run dev
```

The application will be accessible at `http://localhost:5173`.  
The Vite development server includes a built-in dev middleware that proxies `POST /api/contact` to `api/contact.js`, allowing full end-to-end testing of the contact form in development mode.

### 4. Production Build & Preview

```bash
# Create optimized production build
npm run build

# Preview the production build locally
npm run preview
```

---

## 🛡️ Security Architecture

1. **Zero Client Secret Exposure**: All email credentials reside exclusively on the server / serverless function layer.
2. **IP Rate Limiting**: Max 5 submissions per IP in a 10-minute sliding window (`HTTP 429 Too Many Requests` on breach).
3. **Bot Honeypot Protection**: Invisible trap field (`bot_field`) discards automated spam submissions silently without wasting email quota.
4. **Input Sanitization & Validation**:
   - Name: 2–80 characters
   - Email: RFC 5322 regex validation
   - Subject: 2–150 characters
   - Message: 10–5000 characters
   - Payload limit: 50 KB maximum
   - Header injection prevention: Newlines/CRLF stripped from header values.
   - HTML entity encoding for all dynamic content in email templates.
5. **Production Security Headers** (via `vercel.json`):
   - `Content-Security-Policy`
   - `X-Content-Type-Options: nosniff`
   - `X-Frame-Options: DENY`
   - `Referrer-Policy: strict-origin-when-cross-origin`
   - `Permissions-Policy: camera=(), microphone=(), geolocation=()`

---

## 🚢 Deployment

### Deploying to Vercel (Recommended)

1. Push your repository to GitHub.
2. Import the project in [Vercel](https://vercel.com).
3. Under **Project Settings → Environment Variables**, add:
   - `RESEND_API_KEY`
   - `CONTACT_TO_EMAIL`
   - `CONTACT_FROM_EMAIL`
4. Deploy! Vercel automatically detects the Vite frontend and the serverless `api/contact.js` function.

### Deploying to Netlify / Other Providers

If deploying to Netlify, configure the build command as `npm run build`, publish directory as `dist`, and set up Netlify Serverless Functions for `/api/contact` or use standard Node environment variables.

---

## 📄 License

MIT © [Siva S](https://github.com/SIva06062005)
