import { CfRequest, Env } from './env';
import { erstelleMailer } from './mail';
import {
  istGueltigeAmpel,
  istGueltigeAntworten,
  istGueltigeEmail,
  jsonAntwort,
  leseJsonBody,
  sindGueltigeBefunde,
} from './validation';

type Quelle = 'schnellcheck' | 'newsletter';

interface LeadZeile {
  id: number;
  token: string;
  confirmed_at: string | null;
  pending_check_result_id: number | null;
}

/** POST /api/schnellcheck-result — Ergebnis speichern + Double-Opt-in anstoßen. */
export async function schnellcheckResult(request: CfRequest, env: Env): Promise<Response> {
  const body = await leseJsonBody(request);
  if (!body) {
    return jsonAntwort(400, { fehler: 'Ungültiger Anfrage-Body.' });
  }
  const { email, einwilligung, antworten, ampel, befunde } = body;
  if (
    !istGueltigeEmail(email) ||
    einwilligung !== true ||
    !istGueltigeAntworten(antworten) ||
    !istGueltigeAmpel(ampel) ||
    !sindGueltigeBefunde(befunde)
  ) {
    return jsonAntwort(400, { fehler: 'Ungültige oder unvollständige Angaben.' });
  }

  // Antworten pseudonym speichern (§6.7): lead_id bleibt NULL bis zur Bestätigung.
  const result = await env.DB.prepare(
    'INSERT INTO check_results (answers_json, risk_summary) VALUES (?, ?)',
  )
    .bind(JSON.stringify(antworten), JSON.stringify({ ampel, befunde }))
    .run();
  const resultId = result.meta.last_row_id;

  await upsertLeadUndSendeOptIn(env, request, email, 'schnellcheck', resultId);
  return jsonAntwort(202, { status: 'bestaetigung-erforderlich' });
}

/** POST /api/newsletter — Anmeldung mit Double-Opt-in. */
export async function newsletter(request: CfRequest, env: Env): Promise<Response> {
  const body = await leseJsonBody(request);
  if (!body) {
    return jsonAntwort(400, { fehler: 'Ungültiger Anfrage-Body.' });
  }
  const { email, einwilligung } = body;
  if (!istGueltigeEmail(email) || einwilligung !== true) {
    return jsonAntwort(400, { fehler: 'Ungültige oder unvollständige Angaben.' });
  }
  await upsertLeadUndSendeOptIn(env, request, email, 'newsletter', null);
  return jsonAntwort(202, { status: 'bestaetigung-erforderlich' });
}

/** GET /api/confirm?token=… — Double-Opt-in-Bestätigung, verknüpft ggf. das Ergebnis. */
export async function confirm(request: Request, env: Env): Promise<Response> {
  const token = new URL(request.url).searchParams.get('token') ?? '';
  if (!/^[a-f0-9-]{36}$/.test(token)) {
    return bestaetigungsSeite(400, 'Der Bestätigungslink ist ungültig.');
  }
  const lead = await env.DB.prepare(
    'SELECT id, token, confirmed_at, pending_check_result_id FROM leads WHERE token = ?',
  )
    .bind(token)
    .first<LeadZeile>();
  if (!lead) {
    return bestaetigungsSeite(
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
    // Erst jetzt wird die E-Mail mit den Antworten verknüpft (§6.7).
    await env.DB.prepare(
      'UPDATE check_results SET lead_id = ? WHERE id = ? AND lead_id IS NULL',
    )
      .bind(lead.id, lead.pending_check_result_id)
      .run();
  }
  return bestaetigungsSeite(
    200,
    'Vielen Dank — Ihre E-Mail-Adresse ist bestätigt. Sie erhalten die angeforderten Inhalte in Kürze.',
  );
}

/** Aufräumjob (Cron): unbestätigte Leads nach 30 Tagen löschen (§6.7). */
export async function bereinigeUnbestaetigteLeads(env: Env): Promise<number> {
  const ergebnis = await env.DB.prepare(
    "DELETE FROM leads WHERE confirmed_at IS NULL AND created_at < datetime('now', '-30 days')",
  ).run();
  return ergebnis.meta.changes;
}

async function upsertLeadUndSendeOptIn(
  env: Env,
  request: CfRequest,
  email: string,
  quelle: Quelle,
  resultId: number | null,
): Promise<void> {
  // Datenminimierung: nur das aus der IP abgeleitete Land, nie die IP selbst.
  const land = request.cf?.country ?? null;

  const vorhanden = await env.DB.prepare(
    'SELECT id, token, confirmed_at, pending_check_result_id FROM leads WHERE email = ? AND source = ?',
  )
    .bind(email, quelle)
    .first<LeadZeile>();

  let token: string;
  if (vorhanden) {
    token = vorhanden.token;
    if (resultId !== null) {
      await env.DB.prepare('UPDATE leads SET pending_check_result_id = ? WHERE id = ?')
        .bind(resultId, vorhanden.id)
        .run();
      if (vorhanden.confirmed_at) {
        // Bereits bestätigte Leads: Ergebnis direkt verknüpfen.
        await env.DB.prepare('UPDATE check_results SET lead_id = ? WHERE id = ?')
          .bind(vorhanden.id, resultId)
          .run();
        return;
      }
    } else if (vorhanden.confirmed_at) {
      return; // Newsletter: bereits bestätigt, nichts zu tun.
    }
  } else {
    token = crypto.randomUUID();
    await env.DB.prepare(
      'INSERT INTO leads (email, source, token, land, pending_check_result_id) VALUES (?, ?, ?, ?, ?)',
    )
      .bind(email, quelle, token, land, resultId)
      .run();
  }

  const bestaetigungsUrl = `${env.PUBLIC_SITE_URL}/api/confirm?token=${token}`;
  await erstelleMailer(env).sendeBestaetigung({ an: email, quelle, bestaetigungsUrl });
}

function bestaetigungsSeite(status: number, nachricht: string): Response {
  const html = `<!doctype html>
<html lang="de">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>E-Mail-Bestätigung — AI for Germany</title>
<style>body{font-family:system-ui,sans-serif;max-width:38rem;margin:4rem auto;padding:0 1rem;color:#1c2430;line-height:1.6}a{color:#17457c}</style></head>
<body><h1>E-Mail-Bestätigung</h1><p>${nachricht}</p><p><a href="/">Zur Startseite von AI for Germany</a></p></body></html>`;
  return new Response(html, {
    status,
    headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' },
  });
}
