# JanSahayak — Civic Services, Documentation & Certificate Assistant

A single mobile-first web app covering 15 real, interactive modules for navigating Indian civic
services: Aadhaar/address wizards, Parivahan (DL/RC), education & passport document checks,
visa guidance, vital records, emergency SOS, welfare scheme matching, an anonymous anti-bribery
portal, a universal certificate hub, an AI document authenticator, an encrypted-style document
vault, a jargon translator, and a data-saver mode.

## Honesty Notes (read before demoing)
- **Auth is mock OTP.** No SMS gateway is used — the OTP is shown on-screen (`123456` by
  default, configurable via `NEXT_PUBLIC_DEMO_OTP`). Swap `lib/auth.js`'s `sendOtp` for a real
  provider (Firebase Phone Auth, MSG91, Twilio Verify) for production.
- **No real cloud bucket is wired up.** The Document Vault (`lib/storage.js`) stores uploaded
  files as base64 in LocalStorage behind a `cloudUploadDocument()` function whose shape (signed
  URL, latency, metadata) mirrors a real Firebase Storage / Cloudinary call, so swapping in a
  live SDK only touches that one function.
- **All certificate/scheme/emergency data is either synthetic or public information.**
  Emergency helpline numbers (100/108/112/etc.) are real published national numbers used only
  to trigger your device's own dialer — nothing is transmitted by this app.
- **The AI Document Inspector's OpenAI integration is real** (gpt-4o via `pages/api/analyze-doc.js`)
  with a fully deterministic offline fallback (`lib/aiEngine.js`) so every module works with zero
  internet access or API key.
- **The Grievance Portal never stores identity data** — no name, phone, or session ID is written
  alongside a complaint, even though the user is logged in elsewhere in the app.
- **Voice/text assistant uses the browser's real Web Speech API** for speech-to-text and
  text-to-speech — quality depends on voice packs installed on the demo device/browser.

## Quick Start
```bash
npm install
npm run dev
# open http://localhost:3000
```
Login with any 10-digit number starting 6-9; the OTP is shown on-screen. To enable live AI
document analysis, add a real key to `.env.local`:
```
OPENAI_API_KEY=sk-abcdef1234567890abcdef1234567890abcdef12
```

## Project Structure
```
jansahayak-civic/
├── context/AppContext.js        # session, data-saver, language, i18n
├── lib/
│   ├── auth.js                  # mock OTP + session
│   ├── storage.js                # localStorage + simulated cloud vault
│   ├── aiEngine.js                # offline document heuristic engine
│   └── data/                     # languages, schemes, certificates, jargon, contacts, wizards
├── components/                   # Layout, ModuleCard, ProtectedRoute
└── pages/
    ├── index.js, auth.js, dashboard.js
    ├── api/analyze-doc.js
    └── modules/                  # all 15 modules, one file each
```

## Module → File Map
| # | Module | File |
|---|--------|------|
| 1 | Voice & Text Assistant | `pages/modules/voice-assistant.js` |
| 2 | Guided Wizards | `pages/modules/guided-wizards.js` |
| 3 | Driving Licence & Parivahan | `pages/modules/driving-license.js` |
| 4 | Education Document Verifier | `pages/modules/education-verifier.js` |
| 5 | Passport Seva Workflow | `pages/modules/passport-seva.js` |
| 6 | Visa & Immigration Guidance | `pages/modules/visa-guidance.js` |
| 7 | Vital Records Portal | `pages/modules/vital-records.js` |
| 8 | Emergency SOS Hotline | `pages/modules/emergency-sos.js` |
| 9 | Welfare Scheme Matchmaker | `pages/modules/scheme-matchmaker.js` |
| 10 | Anonymous Grievance Portal | `pages/modules/grievance-portal.js` |
| 11 | Government Certificate Portal | `pages/modules/certificate-portal.js` |
| 12 | AI Document Inspector | `pages/modules/doc-inspector.js` |
| 13 | Secure Document Vault | `pages/modules/document-vault.js` |
| 14 | Jargon & Status Translator | `pages/modules/jargon-translator.js` |
| 15 | Data Saver Mode | `pages/modules/data-saver.js` |
