/** Eingabevalidierung für beide POST-Endpunkte (WORKING MAP §6.9). */

const EMAIL_MAX_LAENGE = 254;
// Pragmatische Prüfung; die eigentliche Verifikation ist das Double-Opt-in.
const EMAIL_MUSTER = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const BODY_MAX_BYTES = 16_384;

export function istGueltigeEmail(wert: unknown): wert is string {
  return (
    typeof wert === 'string' && wert.length <= EMAIL_MAX_LAENGE && EMAIL_MUSTER.test(wert)
  );
}

/** Liest den JSON-Body mit Größenlimit; null bei ungültigem/zu großem Body. */
export async function leseJsonBody(request: Request): Promise<Record<string, unknown> | null> {
  const laenge = Number(request.headers.get('content-length') ?? '0');
  if (!Number.isFinite(laenge) || laenge > BODY_MAX_BYTES) {
    return null;
  }
  try {
    const text = await request.text();
    if (text.length > BODY_MAX_BYTES) {
      return null;
    }
    const daten: unknown = JSON.parse(text);
    return typeof daten === 'object' && daten !== null && !Array.isArray(daten)
      ? (daten as Record<string, unknown>)
      : null;
  } catch {
    return null;
  }
}

/** Antworten-Struktur: Record<string, string[]> mit engen Größenlimits. */
export function istGueltigeAntworten(wert: unknown): wert is Record<string, readonly string[]> {
  if (typeof wert !== 'object' || wert === null || Array.isArray(wert)) {
    return false;
  }
  const eintraege = Object.entries(wert);
  if (eintraege.length === 0 || eintraege.length > 30) {
    return false;
  }
  return eintraege.every(
    ([schluessel, auswahl]) =>
      schluessel.length <= 64 &&
      Array.isArray(auswahl) &&
      auswahl.length <= 20 &&
      auswahl.every((id) => typeof id === 'string' && id.length <= 64),
  );
}

export function istGueltigeAmpel(wert: unknown): wert is 'gruen' | 'gelb' | 'rot' {
  return wert === 'gruen' || wert === 'gelb' || wert === 'rot';
}

export function sindGueltigeBefunde(wert: unknown): wert is readonly string[] {
  return (
    Array.isArray(wert) &&
    wert.length <= 5 &&
    wert.every((b) => typeof b === 'string' && b.length <= 500)
  );
}

export function jsonAntwort(status: number, daten: Record<string, unknown>): Response {
  return new Response(JSON.stringify(daten), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      'x-content-type-options': 'nosniff',
    },
  });
}
