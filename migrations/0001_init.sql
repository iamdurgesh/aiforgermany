-- Schema laut WORKING MAP §2: zwei Tabellen, Datenminimierung (§6.7).
-- leads: E-Mail + Einwilligungs-/Bestätigungszeitpunkte + IP-abgeleitetes Land.
-- check_results: Antworten pseudonym; lead_id wird ERST bei Double-Opt-in-
-- Bestätigung gesetzt (vorher verweist nur leads.pending_check_result_id).

CREATE TABLE IF NOT EXISTS leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL,
  source TEXT NOT NULL CHECK (source IN ('schnellcheck', 'newsletter')),
  token TEXT NOT NULL UNIQUE,
  land TEXT,
  pending_check_result_id INTEGER,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  confirmed_at TEXT,
  UNIQUE (email, source)
);

CREATE TABLE IF NOT EXISTS check_results (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  answers_json TEXT NOT NULL,
  risk_summary TEXT NOT NULL,
  lead_id INTEGER REFERENCES leads (id) ON DELETE SET NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_leads_unconfirmed ON leads (confirmed_at, created_at);
