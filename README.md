# AI for Germany — aiforgermany.de

Das unabhängige Informationsportal für KI-Einsatz und KI-Regulierung im
deutschen Mittelstand: Artikel, Glossar, Newsletter und der interaktive
**KI-Act Schnellcheck**. Gebaut nach der `WORKING-MAP-aiforgermany.md`
(Single Source of Truth für Scope, Compliance und Coding-Standards).

## Stack

- **Angular 22** — Standalone Components, Signals, typisierte Reactive Forms,
  zoneless, strict TypeScript
- **SSR + Prerendering** — alle Inhaltsrouten werden beim Build als HTML
  prerendert (SEO); unbekannte Routen rendert der Server mit echtem 404
- **Inhalte:** Markdown in `content/artikel/*.md` — Git ist das CMS
- **Backend:** Cloudflare Worker (`src/server.ts` + `src/api/`) mit D1 (SQLite),
  drei Endpunkte, Double-Opt-in, 30-Tage-Retention-Cron
- **Kein** Cookie-Banner (keine nicht-technischen Cookies), **keine** Dritt-
  Skripte/-Fonts/-CDNs, Fonts self-hosted (`public/assets/fonts/`)

## Lokale Entwicklung

```bash
npm ci
npm start            # ng serve (ohne API) auf http://localhost:4200
npm run preview      # Build + wrangler dev (mit API/D1) auf http://localhost:8787
```

Für die lokale API einmalig die D1-Migrationen anwenden:

```bash
npx wrangler d1 migrations apply aiforgermany --local
```

Weitere Skripte: `npm run lint`, `npm run typecheck`, `npm test`,
`npm run generate` (Content-Pipeline manuell).

## Artikel schreiben (Content-Authoring)

1. Neue Datei `content/artikel/<slug>.md` anlegen — der Dateiname ist der Slug.
2. Frontmatter (alle Felder Pflicht):

   ```markdown
   ---
   title: Titel des Artikels
   description: Meta-Description, maximal 160 Zeichen.
   date: 2026-07-08
   keywords: Begriff1, Begriff2, Begriff3
   ---

   Einleitung … (kein H1 — den rendert die Seite aus `title`)

   ## Erste Zwischenüberschrift
   ```

3. `npm run build` — die Pipeline (`tools/build-content.mjs`) validiert das
   Frontmatter, generiert die Artikel-Konstante, prerendert die Route und
   aktualisiert `sitemap.xml`. Fehler brechen den Build ab.

Glossar-Einträge: `src/app/features/glossar/glossar.data.ts`.
Schnellcheck-Fragen: nur `src/app/features/schnellcheck/schnellcheck.definition.ts`
anpassen — Renderer und Bewertung sind vollständig datengetrieben.

## Deployment (Cloudflare)

```bash
npx wrangler d1 create aiforgermany        # einmalig; EU location hint wählen!
# → database_id in wrangler.jsonc eintragen
npx wrangler d1 migrations apply aiforgermany --remote
npm run deploy                             # Build + wrangler deploy
```

Danach im Cloudflare-Dashboard:

1. **Custom Domain** `aiforgermany.de` an den Worker binden (HTTPS/HSTS sind
   im Code bzw. via `public/_headers` gesetzt).
2. **Redirect Rules (Zone-Level)** für die Nebendomains anlegen — jeweils
   301 auf `https://aiforgermany.de/$1`, Pfad und Query erhalten:
   `www.aiforgermany.de`, `aiforgermany.com`, `www.aiforgermany.com`,
   `aiingermany.de`, `www.aiingermany.de`, `aiingermany.com`,
   `www.aiingermany.com`. (Der Worker leitet dieselben Hosts zusätzlich
   selbst um, falls sie direkt auf ihn zeigen.)
3. **WAF-Rate-Limiting** für `POST /api/*` ergänzen (das In-Worker-Limit ist
   nur Best-Effort je Isolate).

## Umgebungsvariablen

| Variable | Ort | Bedeutung |
|---|---|---|
| `PUBLIC_SITE_URL` | `wrangler.jsonc` → `vars` | Basis-URL für Bestätigungslinks |
| `MAIL_PROVIDER` | `wrangler.jsonc` → `vars` | `none` bis der EU-Provider entschieden ist (`TODO-QUESTION.md` #3) |
| künftige Secrets (z. B. `MAIL_API_KEY`) | `wrangler secret put` / `.dev.vars` | nie im Repo |

Lokale Overrides: `.dev.vars` (Vorlage: `.dev.vars.example`).

## Compliance-Status (vor Go-Live abarbeiten)

- `[AUSFÜLLEN]`-Platzhalter in `/impressum` und `/datenschutz` ersetzen
  (Suche im Code nach `AUSFÜLLEN`).
- `docs/processors.md` vervollständigen (AVV/DPA, EU-Datenresidenz belegen).
- Offene Betreiber-Entscheidungen: `TODO-QUESTION.md` (Hosting-Souveränität,
  D1-Region, E-Mail-Provider inkl. Abmeldelink-Mechanik).
- Definition of Done: WORKING MAP §9.

## Projektstruktur

```
content/artikel/          Markdown-Artikel (Git = CMS)
migrations/               D1-Schema (leads, check_results)
tools/                    Build-Pipeline (Content, Sitemap, CSP-Hashes)
src/api/                  Worker-API: Endpunkte, Validierung, Mail, Retention
src/app/core/             Layout-Shell, Meta-Service, Site-Konstanten
src/app/features/         home, artikel, glossar, schnellcheck, newsletter, legal, …
src/app/shared/           Newsletter-Signup (geteilt: /newsletter + Startseite)
public/                   Statische Assets, Fonts, robots.txt, _headers
```
