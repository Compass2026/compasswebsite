# Compass Marketing — Website

Marketing site for **Compass Marketing**. Clear direction. Relentless execution. 🧭

## Stack

Pure static HTML + CSS + vanilla JS. No frameworks, no build step — it loads instantly and deploys anywhere.

```
index.html        # single-page site
privacy.html      # Privacy Policy
terms.html        # Terms & Conditions
css/style.css     # design system + all styles
js/main.js        # scroll reveals, count-ups, particles, nav, form
assets/           # favicon
```

## Design

- **Palette:** Chicago Bears–inspired navy (`#0B162A`) and orange (`#C83803` / `#FF6B1A`)
- **Type:** Unbounded (display) + Inter (body) via Google Fonts
- **Signature moments:** animated compass hero with a needle that settles on load and rotates with scroll, N·E·S·W "Compass Way" process, count-up stats, tilted marquee, cursor-tracked card glows
- Respects `prefers-reduced-motion`

## Run locally

Any static server works:

```bash
npx serve .
# or
python3 -m http.server 8000
```

## Deploy

Drop it on Vercel, Netlify, or GitHub Pages as-is — no config needed.

## TODO

- Have counsel review `privacy.html` and `terms.html` before launch, and update both if you add analytics, cookies, or new data processors.
- Wire the contact form to a backend (Formspree, Netlify Forms, or an API route) — see the submit handler in `js/main.js`.
