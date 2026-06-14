# CaveBeat Group — cavebeat.com

Static marketing one-pager for **CaveBeat Group** (the technology holding company).

## Files
- `index.html`, `cavebeat.css`, `cavebeat.js`, `assets/logo.png` — the site (no framework).
- `npm run build` → assembles `dist/` (what Netlify publishes).

## Deploy
Shipped via the self-hosted **Jenkins** job `ventures/cavebeat-story/deploy` → **Netlify**
site `cavebeat` → **cavebeat.com**. Push to `main` auto-deploys **production**; other
branches / manual builds deploy a **preview**. (See the Cavebeat CI runbook.)

## Contact form
Front-end only — shows a thank-you state. To wire a backend, set `data-endpoint="<url>"`
on `#contactForm` in `index.html` (it POSTs `FormData`).

## History
The previous site (Vite/React "CaveBeat – Digital Innovation Studio") is archived on branch
**`archive/v1-live-main`**.
