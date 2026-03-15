# aiforgermany
AI insights and analysis on how artificial intelligence is transforming Germany’s industry, economy, and innovation ecosystem.

## Run locally

```bash
npm install
npm start
```

Production build with SSR output:

```bash
npm run build
npm run serve:ssr
```

## Project structure

```text
src/app
├── content              # Mock editorial content and topic data
├── core
│   ├── config           # Site-wide configuration
│   ├── models           # Shared TypeScript models
│   ├── seo              # SEO metadata service
│   └── services         # Content and future app services
├── pages                # Route-level standalone pages
└── shared/components    # Reusable layout and content components
```

## Included pages

- Home
- Articles
- Article Detail
- Topics
- About
- Newsletter
- Not Found
