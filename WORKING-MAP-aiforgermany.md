# WORKING MAP — aiforgermany.de
### Build brief for the coding agent (Claude Code / Cowork)
*Read this file completely before writing any code. It is the single source of truth
for scope, compliance, and coding standards. When in doubt: smaller, simpler, German.*

---

## 1. WHAT WE ARE BUILDING

**Product:** "AI for Germany — das unabhängige Informationsportal für KI-Einsatz
und KI-Regulierung im deutschen Mittelstand."

A German-language content portal + one interactive lead-generation tool
(the **KI-Act Schnellcheck**). This is NOT a SaaS product and NOT the company's
product website. It is a Fachportal: articles, glossary, newsletter, Schnellcheck.

**Primary domain:** aiforgermany.de (aiforgermany.com, aiingermany.de,
aiingermany.com → 301 redirect to primary).

**Audience:** IT-Leiter, CISOs, Datenschutzbeauftragte, Geschäftsführer of German
companies (100–2,000 employees). They read German. The entire UI and all content
are German-first. No language switcher in v1.

**Business goals (in order):**
1. Rank for German queries around KI-Regulierung / Schatten-KI / EU AI Act Mittelstand.
2. Capture emails (Schnellcheck results + newsletter), double-opt-in.
3. Later: send traffic to the product site via content links (placeholder now).

**Explicit NON-goals for v1:** user accounts, payments, CMS admin UI, English
version, comments, chatbots, any third-party marketing pixels.

---

## 2. TECH STACK & ARCHITECTURE

- **Framework:** Angular (latest stable), **standalone components only** (no NgModules),
  **signals** for state, typed reactive forms.
- **Rendering:** Angular SSR with **prerendering (SSG) for all content routes** —
  this is an SEO site; every article and static page must be crawlable as HTML.
  The Schnellcheck may hydrate client-side, but its landing route prerenders.
- **Content:** articles as local **Markdown files in the repo** (`/content/artikel/*.md`)
  with frontmatter (title, slug, description, date, keywords). Build-time parsing →
  prerendered routes. NO headless CMS, NO database for v1. Git is the CMS.
- **Backend:** minimal. One small API (Node/Nest or serverless functions, hosted in
  Germany) with exactly two endpoints:
  - `POST /api/schnellcheck-result` — store result + email (pending double opt-in)
  - `POST /api/newsletter` — newsletter signup (pending double opt-in)
  Plus the confirm endpoint `GET /api/confirm?token=...`.
- **Persistence:** one Postgres or SQLite instance, German/EU hosting. Two tables:
  `leads` (email, source, confirmed_at, created_at, token) and
  `check_results` (answers JSON, risk_summary, lead_id nullable).
- **Hosting:** German or EU-sovereign only (e.g. Hetzner, IONOS, netcup, or
  EU-region of a provider with EU data residency guarantees). **No US-hosted
  CDN/edge that processes personal data.** TLS everywhere.
- **Email sending (double opt-in + results):** EU/German transactional provider
  (e.g. Brevo EU, Mailjet EU region, or SMTP at the German host). Document choice
  in the Datenschutzerklärung.

### Coding principles (enforced)
- **KISS:** if a feature can be a static page, it is a static page. No state
  library (no NgRx) — signals + services suffice. No component libraries with
  heavy runtime; plain Angular + a small utility CSS approach or hand-rolled SCSS
  design tokens.
- **DRY, but not premature:** shared layout, typography, and form controls become
  shared components AFTER the second usage, not before.
- **Declarative:** templates express state via signals/computed; no imperative DOM
  manipulation; Schnellcheck logic is a **pure, data-driven rules structure**
  (questions + scoring as typed constants), rendered generically — adding a
  question must require zero component changes.
- Strict TypeScript (`strict: true`), ESLint + Prettier, no `any`.
- Accessibility: semantic HTML, labels on all inputs, keyboard-navigable
  Schnellcheck, WCAG AA contrast. (BFSG accessibility expectations apply in
  Germany — build accessible by default.)

---

## 3. SITE MAP (v1 routes)

| Route | Type | Content |
|---|---|---|
| `/` | prerendered | Hero, portal mission, Schnellcheck teaser, latest 3 articles, newsletter box |
| `/schnellcheck` | hybrid | The interactive KI-Act Schnellcheck (Section 4) |
| `/artikel` | prerendered | Article index |
| `/artikel/:slug` | prerendered | Article pages (8 launch articles, Section 5) |
| `/glossar` | prerendered | Glossary of ~20 terms (Anhang III, Hochrisiko-KI, GPAI, KI-MIG, Schatten-KI, …) |
| `/newsletter` | prerendered | Newsletter signup ("KI-Regulierung in 5 Minuten — monatlich") |
| `/ueber` | prerendered | About the portal, independence statement |
| `/impressum` | prerendered | **Legally required** (Section 6) |
| `/datenschutz` | prerendered | **Legally required** (Section 6) |
| `/*` | prerendered | 404 with search-friendly links |

Global: header (logo, Artikel, Schnellcheck, Glossar, Newsletter), footer
(Impressum, Datenschutz, Über, © year). Sitemap.xml + robots.txt generated at build.
Meta/OG tags per route from frontmatter.

---

## 4. THE KI-ACT SCHNELLCHECK (the one real feature)

**Purpose:** 8–10 guided questions → preliminary, non-binding orientation about the
company's likely EU-AI-Act exposure → summary on screen → **full result via email**
(lead capture with double opt-in).

**Implementation:** data-driven. One typed constant `SCHNELLCHECK: CheckDefinition`
containing questions, answer options, weights/flags. A generic renderer component
walks it. Scoring is a pure function `evaluate(answers): CheckResult`. Unit-test the
scoring function exhaustively.

**Question set v1 (German, single/multi choice):**
1. Wie viele Mitarbeitende hat Ihr Unternehmen? (Größenklassen)
2. Nutzen Mitarbeitende KI-Tools wie ChatGPT, Copilot oder DeepL? (ja bewusst /
   vermutlich ja / nein / unbekannt)
3. Setzen Sie KI im Personalwesen ein (Bewerber-Screening, Leistungsbewertung)?
   → flag: potenziell Anhang III (Hochrisiko)
4. Setzen Sie KI bei Kreditvergabe, Versicherung oder Bonitätsprüfung ein? → flag Anhang III
5. Nutzen Sie KI in Produkten mit Sicherheitsfunktion (Maschinen, Medizinprodukte)? → flag Anhang I
6. Verarbeiten Ihre KI-Anwendungen personenbezogene Daten? → DSGVO-Hinweis-Flag
7. Interagieren Kunden direkt mit KI (Chatbots, generierte Inhalte)? → Art.-50-Transparenz-Flag
8. Existiert ein Inventar aller KI-Systeme im Unternehmen? (ja / teilweise / nein)
9. Gibt es interne KI-Richtlinien und Schulungen (KI-Kompetenz, Art. 4)? (ja/teilweise/nein)
10. In welcher Branche sind Sie tätig? (für Kontext im E-Mail-Ergebnis)

**Result logic (on screen, ~150 words):** traffic-light summary (Grün/Gelb/Rot) +
3 headline findings (e.g. "Mindestens eine Anwendung fällt voraussichtlich unter
Hochrisiko-Pflichten — relevante Frist: Dezember 2027" / "Transparenzpflichten nach
Art. 50 gelten bereits seit August 2026" / "Ohne KI-Inventar fehlt die Grundlage
für alle weiteren Pflichten").
**Email gate:** "Ihre vollständige Auswertung mit Pflichten-Checkliste senden wir
Ihnen per E-Mail." Email field + consent checkbox → double opt-in → full result mail.
The on-screen summary must be genuinely useful WITHOUT the email (no dark pattern:
email is for the extended version, clearly labeled, skippable via "Ergebnis ohne
E-Mail anzeigen" link showing the short version only).

**MANDATORY disclaimer (legal boundary, Rechtsdienstleistungsgesetz):** visible
before start and in the result:
> "Der Schnellcheck bietet eine unverbindliche erste Orientierung und ersetzt keine
> Rechtsberatung. Für verbindliche Einschätzungen wenden Sie sich an qualifizierte
> Rechtsberatung."
Never phrase results as legal conclusions ("Sie sind verpflichtet…") — always
"voraussichtlich / könnte unter … fallen".

---

## 5. LAUNCH CONTENT (8 articles — create as MD stubs with outline + intro; mark TODO for full text)

1. `schatten-ki-erkennen` — Schatten-KI erkennen: Anleitung für IT-Leiter
2. `eu-ai-act-mittelstand` — EU AI Act für den Mittelstand: was ab wann gilt (inkl. Dez-2027-Frist)
3. `ki-inventar-pflicht` — KI-Inventar erstellen: die Pflicht, die kaum jemand kennt
4. `chatgpt-im-unternehmen` — ChatGPT im Unternehmen: was rechtlich wirklich gilt
5. `deadline-dezember-2027` — Die Dezember-2027-Deadline erklärt
6. `ki-mig-erklaert` — KI-MIG: Deutschlands Umsetzungsgesetz und die Rolle der Bundesnetzagentur
7. `art-50-transparenzpflichten` — Transparenzpflichten seit August 2026: betrifft das uns?
8. `ki-richtlinie-unternehmen` — Eine KI-Richtlinie fürs Unternehmen: Vorlage und Aufbau

Each article: H1, description ≤160 chars, structured H2s, internal links to
Schnellcheck + glossary, JSON-LD `Article` schema, author "Redaktion AI for Germany".

---

## 6. GERMAN LEGAL & PRIVACY REQUIREMENTS (non-negotiable, build-blocking)

1. **Impressum (§ 5 DDG — beachte: DDG hat das TMG 2024 abgelöst):** full provider
   name, address, contact email, responsible person (§ 18 Abs. 2 MStV for editorial
   content). Placeholder fields clearly marked `[AUSFÜLLEN]` — page and route must
   exist and be linked from every page footer.
2. **Datenschutzerklärung (DSGVO Art. 13):** covers hosting/server logs, Schnellcheck
   data processing, newsletter, email provider, cookies (if any), rights of data
   subjects, controller identity. Template structure with `[AUSFÜLLEN]` markers.
3. **NO third-party trackers. NO Google Analytics. NO marketing pixels.** If
   analytics is wanted: **self-hosted Matomo, cookieless configuration** — then no
   consent banner is needed at all. Preferred v1: no analytics beyond server logs.
4. **NO cookie banner by design:** the site must function with zero non-essential
   cookies. Only technically required storage (TDDDG § 25 Abs. 2 exemption).
   If Matomo cookieless is used, still no banner required. Do not add a consent
   management platform "just in case".
5. **Fonts self-hosted.** Never load Google Fonts from Google servers
   (LG München I, Az. 3 O 17493/20 — IP transfer to US = DSGVO violation).
   Download fonts into `/assets/fonts`, serve locally. Same rule for all assets:
   no external CDNs for JS/CSS.
6. **Double opt-in for ALL email capture** (newsletter AND Schnellcheck result) —
   UWG § 7 / established German case law. Store consent timestamp + confirmation
   timestamp + IP-derived country only (data minimization). Unsubscribe link in
   every mail.
7. **Data minimization:** Schnellcheck answers stored pseudonymously; email linked
   only after opt-in confirmation. No IP addresses persisted beyond standard
   short-retention server logs. Define retention: unconfirmed leads auto-deleted
   after 30 days.
8. **Hosting & processing in DE/EU only.** Every external service (email, hosting)
   must have EU data residency and an AVV/DPA. List all processors in
   `/docs/processors.md` for the Datenschutzerklärung.
9. **Security baseline:** HTTPS + HSTS; CSP headers (no `unsafe-inline` where
   avoidable); input validation on both API endpoints; rate limiting on POST
   endpoints; parameterized queries; secrets via env vars, never in repo;
   dependency audit in CI (`npm audit` gate).
10. **Barrierefreiheit:** semantic structure, alt texts, focus states, form errors
    announced — WCAG 2.1 AA as the working standard.

---

## 7. DESIGN DIRECTION (keep it simple)

Sober, trustworthy, editorial — closer to a Fachmedium than a startup landing page.
White/light background, one restrained accent color (deep blue or green), generous
whitespace, strong typographic hierarchy, system-adjacent self-hosted font
(e.g. Inter or Source Sans, hosted locally). No stock photos of robots. Simple
inline SVG illustrations where needed. Mobile-first responsive. Traffic-light
result component (Grün/Gelb/Rot) is the only "colorful" element.

---

## 8. BUILD ORDER (work in this sequence, commit per step)

1. Scaffold Angular workspace (standalone, SSR/prerender configured), lint/prettier,
   strict TS, folder structure: `core/`, `features/schnellcheck/`, `features/artikel/`,
   `shared/`, `content/`.
2. Layout shell: header, footer (with Impressum/Datenschutz links), design tokens.
3. Static legal pages with `[AUSFÜLLEN]` placeholders (unblocks legal review early).
4. Markdown content pipeline + article routes + prerendering + sitemap/robots/meta.
5. Glossary page (data-driven from one typed constant).
6. Schnellcheck: definition constant → generic renderer → pure scoring fn (+ unit
   tests) → result view → email gate UI.
7. Backend API: two POST endpoints + confirm endpoint, DB schema, double-opt-in
   mails via EU provider, retention cron (30-day cleanup).
8. Newsletter page wired to same opt-in flow.
9. Security pass: headers, CSP, rate limits, audit. Accessibility pass.
10. Deployment config for German host, all four domains → 301 to aiforgermany.de,
    HTTPS/HSTS. README with run/deploy instructions.

---

## 9. DEFINITION OF DONE (acceptance checklist)

- [ ] All routes prerender; `curl` on any article returns full HTML content.
- [ ] Lighthouse: Performance ≥ 90, SEO ≥ 95, Accessibility ≥ 95 on `/` and one article.
- [ ] Zero cookies set on first visit (verify in devtools) — and therefore no banner.
- [ ] Zero requests to non-EU third-party hosts (verify network tab: only own origin).
- [ ] Fonts served from `/assets/fonts`.
- [ ] Schnellcheck completable via keyboard only; scoring function 100% unit-tested;
      adding a new question requires editing only the definition constant.
- [ ] Double opt-in works end-to-end (signup → mail → confirm → status flip);
      unconfirmed leads have deletion job.
- [ ] Disclaimer visible before Schnellcheck start and in results.
- [ ] Impressum + Datenschutz linked in footer on every page, placeholders marked.
- [ ] `docs/processors.md` lists every external service touching personal data.
- [ ] README documents: local dev, build, deploy, content-authoring (how to add an
      article), and env vars.

---

## 10. GUARDRAILS FOR THE AGENT

- Do not add libraries, features, or abstractions not listed here. If something
  seems missing, add a `TODO-QUESTION.md` entry instead of inventing scope.
- Never phrase Schnellcheck output as legal advice. Never weaken the disclaimer.
- Never introduce a third-party script, font, or CDN — this is a compliance
  property of the product, not a style preference.
- Content tone: nüchtern, präzise, hilfreich. Kein Marketing-Superlativ.
- The product-company link is a placeholder (`<!-- PRODUKT-LINK folgt -->`) — do not
  invent a product name or branding.

*This map encodes decisions already made upstream (portal ≠ product; German-first;
lead capture with strict privacy; KISS architecture). Build within it.*
