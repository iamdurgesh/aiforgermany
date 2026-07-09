/**
 * Reine, deterministische Bewertung des Schnellchecks (WORKING MAP §4).
 * Keine Angular-Abhängigkeiten — vollständig unit-testbar.
 *
 * Formulierungsgrenze (Rechtsdienstleistungsgesetz): Befunde sind stets als
 * Orientierung formuliert („voraussichtlich“, „könnte“), nie als
 * Rechtsfolgenaussage.
 */
import { Antworten, CheckDefinition, RisikoFlag } from './schnellcheck.definition';

export type Ampel = 'gruen' | 'gelb' | 'rot';

export interface CheckResult {
  readonly ampel: Ampel;
  readonly punkte: number;
  readonly flags: readonly RisikoFlag[];
  /** Maximal drei Kernbefunde, nach Priorität sortiert. */
  readonly befunde: readonly string[];
}

/** Punktsumme, ab der es ohne Hochrisiko-Flag Gelb gibt. */
const GELB_SCHWELLE = 4;

const HOCHRISIKO_FLAGS: readonly RisikoFlag[] = ['anhang-i', 'anhang-iii'];

/** Befund-Texte je Flag, in Prioritätsreihenfolge für die Top-3-Auswahl. */
const BEFUNDE: readonly { flag: RisikoFlag; text: string }[] = [
  {
    flag: 'anhang-iii',
    text:
      'Mindestens eine Anwendung könnte unter die Hochrisiko-Pflichten nach Anhang III fallen ' +
      '(z. B. Personalwesen, Bonitätsprüfung).',
  },
  {
    flag: 'anhang-i',
    text:
      'KI in Produkten mit Sicherheitsfunktion fällt voraussichtlich unter Anhang I — ' +
      'relevante Frist: Dezember 2027.',
  },
  {
    flag: 'art-50',
    text:
      'Transparenzpflichten nach Art. 50 gelten bereits seit August 2026 und betreffen Ihr ' +
      'Unternehmen voraussichtlich.',
  },
  {
    flag: 'kein-inventar',
    text: 'Ohne KI-Inventar fehlt die Grundlage für alle weiteren Pflichten.',
  },
  {
    flag: 'schatten-ki',
    text:
      'KI-Nutzung ohne Freigabe ist wahrscheinlich — Schatten-KI sollte zuerst sichtbar ' +
      'gemacht werden.',
  },
  {
    flag: 'keine-richtlinie',
    text:
      'Interne KI-Richtlinien und Schulungen (KI-Kompetenz, Art. 4) fehlen oder sind ' +
      'unvollständig — diese Pflicht gilt bereits.',
  },
  {
    flag: 'dsgvo',
    text:
      'Ihre KI-Anwendungen verarbeiten voraussichtlich personenbezogene Daten — die DSGVO ' +
      'gilt parallel zum AI Act.',
  },
];

const BEFUND_GRUEN =
  'Nach Ihren Angaben gibt es derzeit keine Hinweise auf Hochrisiko-Pflichten. Beobachten ' +
  'Sie Änderungen im KI-Einsatz und pflegen Sie Ihr KI-Inventar weiter.';

/** Sind alle Fragen beantwortet (je mindestens eine Option)? */
export function istVollstaendig(definition: CheckDefinition, antworten: Antworten): boolean {
  return definition.fragen.every((frage) => (antworten[frage.id]?.length ?? 0) > 0);
}

/**
 * Bewertet die Antworten rein datengetrieben:
 * Punkte und Flags kommen ausschließlich aus der Definition.
 */
export function evaluate(definition: CheckDefinition, antworten: Antworten): CheckResult {
  let punkte = 0;
  const flags = new Set<RisikoFlag>();

  for (const frage of definition.fragen) {
    const gewaehlt = antworten[frage.id] ?? [];
    for (const optionId of gewaehlt) {
      const option = frage.optionen.find((o) => o.id === optionId);
      if (!option) {
        throw new Error(
          `Unbekannte Antwortoption "${optionId}" für Frage "${frage.id}".`,
        );
      }
      punkte += option.punkte ?? 0;
      for (const flag of option.flags ?? []) {
        flags.add(flag);
      }
    }
  }

  const ampel = bestimmeAmpel(punkte, flags);
  return { ampel, punkte, flags: [...flags], befunde: bestimmeBefunde(flags) };
}

function bestimmeAmpel(punkte: number, flags: ReadonlySet<RisikoFlag>): Ampel {
  if (HOCHRISIKO_FLAGS.some((flag) => flags.has(flag))) {
    return 'rot';
  }
  if (punkte >= GELB_SCHWELLE || flags.size > 0) {
    return 'gelb';
  }
  return 'gruen';
}

function bestimmeBefunde(flags: ReadonlySet<RisikoFlag>): readonly string[] {
  const treffer = BEFUNDE.filter((b) => flags.has(b.flag)).map((b) => b.text);
  if (treffer.length === 0) {
    return [BEFUND_GRUEN];
  }
  return treffer.slice(0, 3);
}
