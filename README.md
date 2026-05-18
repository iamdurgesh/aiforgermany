# aiforgermany
AI insights and analysis on how artificial intelligence is transforming Germany’s industry, economy, and innovation ecosystem.

## Run locally

```bash
npm install
npm run start:dev
```

Production build with SSR output:
```bash
npm run serve:ssr
```

## Project structure

```text
src
├── app                  # Angular public-facing frontend
│   ├── content          # Mock editorial content and topic data
│   ├── core             # Site config, i18n, models, SEO, services
│   ├── pages            # Route-level standalone pages
│   └── shared           # Reusable layout and content components
└── backend              # Express API mounted under /api in the SSR server
    ├── config           # Environment parsing
    ├── http             # API route composition
    ├── integrations     # External provider boundaries
    ├── middleware       # Request IDs, rate limits, API errors
    ├── newsletter       # Newsletter validation and service layer
    └── shared           # Backend shared utilities
```

## Included pages

- Home
- Articles
- Article Detail
- Topics
- About
- Newsletter
- Not Found

## Backend API

The initial backend is mounted inside the Angular SSR Express server at `/api`.

Available endpoints:

- `GET /api/health`
- `POST /api/newsletter/subscribe`

The newsletter endpoint validates email, explicit consent, consent version, and privacy policy version. It is rate-limited and currently returns `503` until a newsletter provider is configured.

Copy `.env.example` to your deployment environment and configure secrets there. Do not expose backend environment variables to Angular/browser code.

Useful backend checks:

```bash
npm run typecheck
curl http://localhost:4000/api/health
```
