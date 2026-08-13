-- Cooldown for double-opt-in mails (mail-bombing protection, WORKING MAP §6.9):
-- timestamp of the last confirmation-mail send per lead.
ALTER TABLE leads ADD COLUMN optin_sent_at TEXT;
