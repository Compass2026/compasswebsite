# Logic Solar — On-Page SEO & GEO Audit

**Site:** logic-solar.com · **Repo:** `Compass2026/Logic-Solar` @ `cd8f787` · **Date:** 2026-08-24
**Method:** Codebase audit per FoundIt SEO/GEO SOP, Section 2 (Phase 1 audit prompt).
**Scope note:** This environment's network policy blocks direct fetches of logic-solar.com, so live-site checks (SOP §5.2 — sitemap/robots serving, rendered head tags) could not be run. Everything below is verified against source; items marked ⚠ LIVE need a browser/GSC confirmation pass.

---

## Scores

| Category | Score | Summary |
|---|---|---|
| Technical SEO | **6 / 10** | Strong prerender architecture; missing robots.txt, wrong-domain og:image default, coverage gaps |
| Local SEO | **5 / 10** | NAP consistent, 3 excellent city pages — but 597 templated near-duplicate city pages |
| Schema Markup | **5 / 10** | LocalBusiness + FAQPage present; no Organization/WebSite/SearchAction; Service schema stranded in dead code |
| GEO / AI Search | **4 / 10** | Dedicated pages are entity-rich; the other 597 cities are formulaic; thin E-E-A-T; no comparison content or blog |
| Content Architecture | **6 / 10** | Services have pages, internal linking exists, internal tools noindexed — but `/solar-landing` is indexable |
| Core Web Vitals | **3 / 10** | 13 MB hero images, multi-MB PNG heroes, synchronous chat widget |

---

## What's already good (don't re-do)

- **Prerender pipeline** (`scripts/prerender.js`): every static/state/city route gets a real HTML file with unique title, meta description, canonical, og:title/description/url, LocalBusiness JSON-LD, and crawlable H1 + body copy. This solves the SPA meta-gating problem without react-helmet-async — a valid alternative the SOP should recognize.
- **Sitemap generation** (`scripts/generate-sitemap.js`) runs on every build; GSC verification file present (`public/googlea9a32a28e7a38189.html`).
- **NAP is consistent** everywhere: Logic Solar · (816) 300-5781 · 7300 W 110th St, Plaza 1, 7th Floor, Overland Park, KS 66210 (`src/data/siteData.ts:6-8`, `scripts/prerender.js`, dedicated city pages).
- **Dedicated Austin / Kansas City / Wichita pages** (1,000–1,600 lines each) are genuinely strong: Service + BreadcrumbList + FAQPage schema, Wikipedia `sameAs` entity links, suburb entity lists, rich localized FAQs.
- **Internal utility pages** (`/adders`, `/credit`, `/logins`, `/onboard`, `/sitesurvey`, `/thankyou`, `/deal`, `/service`, `/commercial`, `/credit-repair`) all use `InternalFormPageTemplate` with `noindex={true}` (`src/components/InternalFormPageTemplate.tsx:31`).
- **Internal linking:** footer `InternalLinks`, city→state cross-links, prerendered state hubs list every city with descriptive anchor text.

---

## Issues

### CRITICAL

| # | Issue | Where | Effort |
|---|---|---|---|
| C1 | **`public/robots.txt` does not exist.** No crawler directives, no `Sitemap:` reference. | `public/` | 15 min |
| C2 | **Wrong domain in default og:image** — `https://logicsolar.com/images/missouri-hero.jpg` (missing hyphen; dead URL). Every page not passing `ogImage` ships a broken share image. | `src/components/SEO.tsx:21` | 5 min |
| C3 | **`/solar-landing` (ad landing page) is indexable.** No `<SEO>` and no noindex; served via catch-all with homepage meta. SOP requires noindex on all campaign pages. | `src/pages/SolarLanding.tsx`, `src/App.tsx:...` (route `/solar-landing`) | 30 min |
| C4 | **Homepage has no `<SEO>` component.** Direct loads are covered by prerender, but client-side navigation back to `/` keeps the previous page's title, canonical, OG tags, and JSON-LD (stale metadata; ⚠ LIVE-verifiable). | `src/pages/Home.tsx` | 1 hr |
| C5 | **597 of 600 city pages are templated near-duplicates** — same `CityTemplate` copy with the city name swapped, same 4 boilerplate FAQs, all in the sitemap at priority 0.7. Classic doorway-page pattern; dilutes crawl budget and risks a helpful-content demotion that could drag the 3 good city pages down. See Conflicts — needs a deliberate decision, not a mechanical fix. | `src/components/CityTemplate.tsx`, `src/components/CityFAQSection.tsx:23-49`, `src/data/locations-solar.json` (100 cities × 6 states) | Decision + 1–2 hrs/page kept |

### HIGH

| # | Issue | Where | Effort |
|---|---|---|---|
| H1 | **og:image is relative** (`/og-image.png`) in the head template and never rewritten per-route by prerender. OG scrapers require absolute URLs. | `index.html:15`, `scripts/prerender.js` (no og:image replacement) | 30 min |
| H2 | **Prerender + sitemap coverage gaps:** `/services/incentives`, `/services/how-it-works`, `/roofing`, `/privacy`, `/terms` are routed pages but are neither prerendered nor in the sitemap — crawlers get the homepage-prerendered HTML with the **homepage canonical** on those URLs (duplicate-canonical signal). | `src/App.tsx` routes vs `scripts/prerender.js` + `scripts/generate-sitemap.js` | 2 hrs |
| H3 | **Colorado hub missing from sitemap** — `/locations/colorado` is never listed while its 100 city URLs are. | `scripts/generate-sitemap.js:22-33` vs `stateSlugMap:40` | 10 min |
| H4 | **Title/description length overruns:** homepage prerender title is 71 chars (`Logic Solar | Solar Panel Installation, Battery Backup & Commercial Solar`); prerendered city descriptions run ~180+ chars (keyword + secondary list + avg bill + phone). | `scripts/prerender.js` (`push('/')`, city loop) | 1 hr |
| H5 | **Core Web Vitals — image weight:** `public/images/colorado-hero.jpg` 13 MB, `public/Sunny Denver Skyline Mar 20 2026.jpg` 13 MB, `New Hero Image.jpeg` 4 MB, `Website H1.jpeg` 3.9 MB, multi-MB PNG heroes. No `width`/`height`, no `loading="lazy"`, no preload/fetchpriority on LCP images. Also a synchronous LeadConnector widget script in `index.html:28`. | `public/`, `index.html:28` | 4 hrs |
| H6 | **No Organization or WebSite+SearchAction schema on the homepage.** Prerender emits a bare LocalBusiness (no `sameAs`, `logo`, `geo`, `openingHours`, `image`, `priceRange`). | `scripts/prerender.js` (`orgSchema`) | 2 hrs |
| H7 | **Live service pages have no Service schema.** `/services/:slug` renders `ServiceTemplate` (no `schema` prop); the good Service JSON-LD sits in `SolarInstallation.tsx`, `BatteryBackup.tsx`, `CommercialSolar.tsx` — **orphaned files nothing imports**. | `src/components/ServiceTemplate.tsx:26-28`; orphans in `src/pages/` | 2 hrs |

### MEDIUM

| # | Issue | Where | Effort |
|---|---|---|---|
| M1 | Sitemap entries have no `lastmod`/`changefreq` (SOP §4.4 requires both). | `scripts/generate-sitemap.js` | 30 min |
| M2 | No BreadcrumbList schema outside the 3 dedicated city pages. | sitewide | 2 hrs |
| M3 | No Twitter Card tags anywhere (`twitter:card`, `twitter:title`, …). | `index.html`, `SEO.tsx`, `prerender.js` | 30 min |
| M4 | `ServiceTemplate` meta description is `fullDescription.substring(0, 160)` — truncates mid-word and exceeds the 155-char target. | `src/components/ServiceTemplate.tsx:28` | 30 min |
| M5 | Generic city pages have only 4 templated FAQs (SOP wants 10+, localized). Folded into the C5 decision. | `src/components/CityFAQSection.tsx` | with C5 |
| M6 | Alt text: 30 `<img>` tags, 1 empty `alt=""`, several generic values (e.g. `"{city} Solar"`); no keyword-rich descriptive alts. | `src/components/CityTemplate.tsx:~100` and sitewide | 1 hr |
| M7 | City-page hero falls back to a hotlinked Unsplash URL (external dependency, no local optimization). | `src/components/CityTemplate.tsx:45,98` | 30 min |
| M8 | E-E-A-T thin sitewide: no team/technician profiles, no years-in-business or license/cert page (Tesla Energy Certified & BBB logos exist as images only), no comparison content (e.g. lease vs loan, Powerwall vs FranklinWH), no blog/content hub. | sitewide | Ongoing |
| M9 | No AggregateRating/Review schema. Only add if backed by real, displayed reviews — see Conflicts. | — | 1 hr (if reviews exist) |

### LOW

| # | Issue | Where | Effort |
|---|---|---|---|
| L1 | Dead code: `SolarInstallation.tsx`, `BatteryBackup.tsx`, `CommercialSolar.tsx` unrouted (but contain the best Service schema — harvest before deleting). | `src/pages/` | 30 min |
| L2 | AI Studio template leftovers: `README.md` (Gemini boilerplate), `metadata.json`, `package.json` name `react-example`. | root | 15 min |
| L3 | Unused multi-MB images in `public/` (e.g. `Sunny Denver Skyline…`, `Website H1.jpeg`) shipped in the deploy. | `public/` | 15 min |

---

## Conflicts requiring a decision (SOP Category 4)

1. **600 city pages vs. content quality.** The SOP demands 300+ unique words per location page, but 597 pages are template stamps. Options: (a) build out real content per city (~600–1,200 hrs — unrealistic), (b) keep ~10–20 priority metros, 301/consolidate the rest into state hubs, or (c) keep pages live but drop thin cities from the sitemap and add state-hub-canonical. Recommend (b) or (c). Do **not** mechanically "add 10 FAQs" to all 600 — that multiplies the boilerplate.
2. **react-helmet-async (SOP §4.2) vs. existing prerender.** The site's prerender + DOM-manipulation `SEO.tsx` already achieves the SOP's goal. Migrating to helmet would be churn with no crawler benefit. Recommend keeping prerender; update the SOP/skill to accept it as an approved pattern.
3. **SOP pitfall "SPA catch-all intercepts sitemap.xml".** On Vercel, filesystem matches win before `rewrites`, so `/sitemap.xml` and `/robots.txt` in the build output serve raw without passthrough rules. No vercel.json change needed (⚠ LIVE-verify once). Capture in the skill as host-specific guidance.
4. **AggregateRating.** SOP lists it as standard, but marking up ratings that aren't visibly displayed on the page violates Google's structured-data policy and risks a manual action. Only implement alongside a real reviews section.

---

## Prioritized action list (developer-ready)

1. Add `public/robots.txt` (allow all, `Sitemap: https://logic-solar.com/sitemap.xml`) — 15 min
2. Fix `SEO.tsx:21` default ogImage domain → `https://logic-solar.com/og-image.png` — 5 min
3. Noindex `/solar-landing` (add `<SEO noindex>` or fold into `InternalFormPageTemplate`) — 30 min
4. Add `<SEO>` (title/description/canonical/schema) to `Home.tsx` — 1 hr
5. Make og:image absolute in `index.html` + rewrite per-route in prerender; add Twitter Card tags — 1 hr
6. Extend prerender + sitemap to `/services/incentives`, `/services/how-it-works`, `/roofing`, `/privacy`, `/terms`; add Colorado hub; add `lastmod`/`changefreq` — 2.5 hrs
7. Shorten homepage title ≤60 chars; tighten city descriptions ≤155 — 1 hr
8. Wire Service schema into `ServiceTemplate` (harvest from orphaned pages), then delete orphans — 2 hrs
9. Upgrade homepage schema: Organization + WebSite/SearchAction + enriched LocalBusiness (`geo`, `openingHours`, `sameAs`, `logo`) — 2 hrs
10. Compress/convert hero images to WebP/AVIF ≤300 KB, add dimensions + `fetchpriority="high"` on LCP, lazy-load below-fold, defer chat widget — 4 hrs
11. **Decision meeting: city-page strategy (C5)** — then execute chosen option
12. Alt-text pass; BreadcrumbList rollout; E-E-A-T page (licenses, certs, team, years); comparison content + blog cadence — ongoing

**Post-fix (SOP §5):** deploy, then live-verify sitemap.xml/robots.txt serve raw, spot-check canonicals on 3+ routes, submit sitemap in GSC, request indexing on homepage + Austin/KC/Wichita.

---

## Score sheet (SOP §9)

| Category | Before | After | Notes |
|---|---|---|---|
| Technical SEO | 6 / 10 | / 10 | |
| Local SEO | 5 / 10 | / 10 | |
| Schema Markup | 5 / 10 | / 10 | |
| GEO / AI Search | 4 / 10 | / 10 | |
| Content Architecture | 6 / 10 | / 10 | |
| Core Web Vitals | 3 / 10 | / 10 | |
