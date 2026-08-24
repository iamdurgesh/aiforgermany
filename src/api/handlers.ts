import { CfRequest, Env } from './env';
import { createMailer } from './mail';
import { SCHNELLCHECK } from '../app/features/schnellcheck/schnellcheck.definition';
import { evaluate } from '../app/features/schnellcheck/schnellcheck.scoring';
import type { CheckResultSummaryDto, LeadSourceDto } from './dto';
import {
  isNewsletterRequest,
  isSchnellcheckResultRequest,
  jsonResponse,
  readJsonBody,
} from './validation';

interface LeadRow {
  id: number;
  token: string;
  confirmed_at: string | null;
  pending_check_result_id: number | null;
  optin_sent_at: string | null;
}

/** At most one new opt-in mail per lead every 15 minutes (mail-bombing protection). */
const OPTIN_COOLDOWN_MS = 15 * 60_000;

function canSendOptInMail(optinSentAt: string | null): boolean {
  if (!optinSentAt) {
    return true;
  }
  // D1/SQLite datetime('now') returns UTC without a timezone suffix.
  const sentAt = Date.parse(optinSentAt.replace(' ', 'T') + 'Z');
  return !Number.isFinite(sentAt) || Date.now() - sentAt > OPTIN_COOLDOWN_MS;
}

/** POST /api/schnellcheck-result — store the result + trigger double opt-in. */
export async function schnellcheckResult(request: CfRequest, env: Env): Promise<Response> {
  const body = await readJsonBody(request);
  if (!body) {
    return jsonResponse(400, { error: 'Ungültiger Anfrage-Body.' });
  }
  if (!isSchnellcheckResultRequest(body)) {
    return jsonResponse(400, { error: 'Ungültige oder unvollständige Angaben.' });
  }
  const { email, answers } = body;
  const result = evaluate(SCHNELLCHECK, answers);
  const riskSummary = {
    trafficLight: result.trafficLight,
    findings: result.findings,
  } satisfies CheckResultSummaryDto;

  // Store the answers pseudonymously (§6.7): lead_id stays NULL until confirmation.
  const insertResult = await env.DB.prepare(
    'INSERT INTO check_results (answers_json, risk_summary) VALUES (?, ?)',
  )
    .bind(JSON.stringify(answers), JSON.stringify(riskSummary))
    .run();
  const resultId = insertResult.meta.last_row_id;

  await upsertLeadAndSendOptIn(env, request, email, 'schnellcheck', resultId);
  return jsonResponse(202, { status: 'confirmation-required' });
}

/** POST /api/newsletter — sign-up with double opt-in. */
export async function newsletter(request: CfRequest, env: Env): Promise<Response> {
  const body = await readJsonBody(request);
  if (!body) {
    return jsonResponse(400, { error: 'Ungültiger Anfrage-Body.' });
  }
  if (!isNewsletterRequest(body)) {
    return jsonResponse(400, { error: 'Ungültige oder unvollständige Angaben.' });
  }
  const { email } = body;
  await upsertLeadAndSendOptIn(env, request, email, 'newsletter', null);
  return jsonResponse(202, { status: 'confirmation-required' });
}

/** GET /api/confirm?token=… — double opt-in confirmation, links the result if pending. */
export async function confirm(request: Request, env: Env): Promise<Response> {
  const token = new URL(request.url).searchParams.get('token') ?? '';
  if (!/^[a-f0-9-]{36}$/.test(token)) {
    return confirmationPage(400, 'Der Bestätigungslink ist ungültig.');
  }
  const lead = await env.DB.prepare(
    'SELECT id, token, confirmed_at, pending_check_result_id FROM leads WHERE token = ?',
  )
    .bind(token)
    .first<LeadRow>();
  if (!lead) {
    return confirmationPage(
      404,
      'Der Bestätigungslink ist ungültig oder abgelaufen. Bitte melden Sie sich erneut an.',
    );
  }
  if (!lead.confirmed_at) {
    await env.DB.prepare("UPDATE leads SET confirmed_at = datetime('now') WHERE id = ?")
      .bind(lead.id)
      .run();
  }
  if (lead.pending_check_result_id !== null) {
    // Only now is the e-mail linked to the answers (§6.7).
    await env.DB.prepare('UPDATE check_results SET lead_id = ? WHERE id = ? AND lead_id IS NULL')
      .bind(lead.id, lead.pending_check_result_id)
      .run();
  }
  return confirmationPage(
    200,
    'Vielen Dank — Ihre E-Mail-Adresse ist bestätigt. Sie erhalten die angeforderten Inhalte in Kürze.',
  );
}

/** Cleanup job (cron): delete unconfirmed leads after 30 days (§6.7). */
export async function cleanupUnconfirmedLeads(env: Env): Promise<number> {
  const result = await env.DB.prepare(
    "DELETE FROM leads WHERE confirmed_at IS NULL AND created_at < datetime('now', '-30 days')",
  ).run();
  // Also delete never-confirmed check results (§6.7): without a lead link
  // and no longer referenced by any waiting lead.
  await env.DB.prepare(
    `DELETE FROM check_results
     WHERE lead_id IS NULL
       AND created_at < datetime('now', '-30 days')
       AND id NOT IN (
         SELECT pending_check_result_id FROM leads WHERE pending_check_result_id IS NOT NULL
       )`,
  ).run();
  return result.meta.changes;
}

async function upsertLeadAndSendOptIn(
  env: Env,
  request: CfRequest,
  email: string,
  source: LeadSourceDto,
  resultId: number | null,
): Promise<void> {
  // Data minimization: only the country derived from the IP, never the IP itself.
  const country = request.cf?.country ?? null;

  const existing = await env.DB.prepare(
    'SELECT id, token, confirmed_at, pending_check_result_id, optin_sent_at FROM leads WHERE email = ? AND source = ?',
  )
    .bind(email, source)
    .first<LeadRow>();

  let token: string;
  if (existing) {
    token = existing.token;
    if (resultId !== null) {
      await env.DB.prepare('UPDATE leads SET pending_check_result_id = ? WHERE id = ?')
        .bind(resultId, existing.id)
        .run();
      if (existing.confirmed_at) {
        // Already confirmed leads: link the result directly.
        await env.DB.prepare('UPDATE check_results SET lead_id = ? WHERE id = ?')
          .bind(existing.id, resultId)
          .run();
        return;
      }
    } else if (existing.confirmed_at) {
      return; // Newsletter: already confirmed, nothing to do.
    }
    if (!canSendOptInMail(existing.optin_sent_at)) {
      return; // Cooldown active: don't flood third-party addresses with opt-in mails.
    }
    await env.DB.prepare("UPDATE leads SET optin_sent_at = datetime('now') WHERE id = ?")
      .bind(existing.id)
      .run();
  } else {
    token = crypto.randomUUID();
    await env.DB.prepare(
      "INSERT INTO leads (email, source, token, country, pending_check_result_id, optin_sent_at) VALUES (?, ?, ?, ?, ?, datetime('now'))",
    )
      .bind(email, source, token, country, resultId)
      .run();
  }

  const confirmationUrl = `${env.PUBLIC_SITE_URL}/api/confirm?token=${token}`;
  await createMailer(env).sendConfirmation({ to: email, source, confirmationUrl });
}

function confirmationPage(status: number, message: string): Response {
  const html = `<!doctype html>
<html lang="de">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>E-Mail-Bestätigung — AI for Germany</title>
<style>body{font-family:system-ui,sans-serif;max-width:38rem;margin:4rem auto;padding:0 1rem;color:#1c2430;line-height:1.6}a{color:#17457c}</style></head>
<body><h1>E-Mail-Bestätigung</h1><p>${message}</p><p><a href="/">Zur Startseite von AI for Germany</a></p></body></html>`;
  return new Response(html, {
    status,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'no-store',
      'content-security-policy':
        "default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
      'referrer-policy': 'strict-origin-when-cross-origin',
      'x-content-type-options': 'nosniff',
      'x-frame-options': 'DENY',
    },
  });
}
