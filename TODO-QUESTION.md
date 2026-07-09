# TODO-QUESTION — offene Entscheidungen

Gemäß WORKING MAP §10: fehlende Scope-Entscheidungen werden hier dokumentiert,
nicht erfunden. Jede Entscheidung trifft der Betreiber.

## 1. Hosting: Cloudflare Workers vs. Map §2 „DE/EU-sovereign only“

- Die Map verbietet US-Edge-Infrastruktur, die personenbezogene Daten verarbeitet.
- **Entscheidung des Betreibers (2026-07-07):** vorerst Cloudflare Workers mit
  europäischem/deutschem Serverstandort. Build bleibt darauf ausgerichtet.
- **Offen vor Launch:** Cloudflare EU Data Localisation / Regional Services
  vertraglich fixieren, AVV/DPA abschließen und in `docs/processors.md`
  dokumentieren. Sovereignty-Frage vor Go-Live erneut prüfen.

## 2. Datenbank für Step 7 (Leads + Check-Results)

- Map: „ein Postgres oder SQLite, DE/EU-Hosting“.
- Auf Cloudflare Workers naheliegend: **D1 (SQLite)** mit EU location hint —
  Datenresidenz-Garantie muss der Betreiber prüfen.
- Alternative: Postgres bei deutschem Anbieter (Hetzner o. ä.), Zugriff aus dem Worker.
- **Entscheidung nötig, bevor Step 7 gebaut wird.**

## 3. E-Mail-Provider für Double-Opt-in (Step 7/8)

- Map: Brevo EU, Mailjet EU-Region oder SMTP beim deutschen Host.
- **Entscheidung nötig, bevor der Mail-Versand gebaut wird.** Wahl muss in der
  Datenschutzerklärung und in `docs/processors.md` dokumentiert werden.
