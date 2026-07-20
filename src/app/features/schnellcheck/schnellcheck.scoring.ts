/**
 * Pure, deterministic scoring of the Schnellcheck (WORKING MAP §4).
 * No Angular dependencies — fully unit-testable.
 *
 * Wording constraint (German Legal Services Act): findings are always
 * phrased as orientation ("voraussichtlich", "könnte"), never as a
 * statement of legal consequences.
 */
import { Answers, CheckDefinition, RiskFlag } from './schnellcheck.definition';

export type TrafficLight = 'green' | 'yellow' | 'red';

export interface CheckResult {
  readonly trafficLight: TrafficLight;
  readonly points: number;
  readonly flags: readonly RiskFlag[];
  /** At most three key findings, sorted by priority. */
  readonly findings: readonly string[];
}

/** Point total from which the result is yellow even without a high-risk flag. */
const YELLOW_THRESHOLD = 4;

const HIGH_RISK_FLAGS: readonly RiskFlag[] = ['annex-i', 'annex-iii'];

/** Finding texts per flag, in priority order for the top-3 selection. */
const FINDINGS: readonly { flag: RiskFlag; text: string }[] = [
  {
    flag: 'annex-iii',
    text:
      'Mindestens eine Anwendung könnte unter die Hochrisiko-Pflichten nach Anhang III fallen ' +
      '(z. B. Personalwesen, Bonitätsprüfung).',
  },
  {
    flag: 'annex-i',
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
    flag: 'no-inventory',
    text: 'Ohne KI-Inventar fehlt die Grundlage für alle weiteren Pflichten.',
  },
  {
    flag: 'shadow-ai',
    text:
      'KI-Nutzung ohne Freigabe ist wahrscheinlich — Schatten-KI sollte zuerst sichtbar ' +
      'gemacht werden.',
  },
  {
    flag: 'no-policy',
    text:
      'Interne KI-Richtlinien und Schulungen (KI-Kompetenz, Art. 4) fehlen oder sind ' +
      'unvollständig — diese Pflicht gilt bereits.',
  },
  {
    flag: 'gdpr',
    text:
      'Ihre KI-Anwendungen verarbeiten voraussichtlich personenbezogene Daten — die DSGVO ' +
      'gilt parallel zum AI Act.',
  },
];

const GREEN_FINDING =
  'Nach Ihren Angaben gibt es derzeit keine Hinweise auf Hochrisiko-Pflichten. Beobachten ' +
  'Sie Änderungen im KI-Einsatz und pflegen Sie Ihr KI-Inventar weiter.';

/** Are all questions answered (at least one option each)? */
export function isComplete(definition: CheckDefinition, answers: Answers): boolean {
  return definition.questions.every((question) => (answers[question.id]?.length ?? 0) > 0);
}

/**
 * Scores the answers purely data-driven:
 * points and flags come exclusively from the definition.
 */
export function evaluate(definition: CheckDefinition, answers: Answers): CheckResult {
  let points = 0;
  const flags = new Set<RiskFlag>();

  for (const question of definition.questions) {
    const selected = answers[question.id] ?? [];
    for (const optionId of selected) {
      const option = question.options.find((o) => o.id === optionId);
      if (!option) {
        throw new Error(`Unknown answer option "${optionId}" for question "${question.id}".`);
      }
      points += option.points ?? 0;
      for (const flag of option.flags ?? []) {
        flags.add(flag);
      }
    }
  }

  const trafficLight = determineTrafficLight(points, flags);
  return { trafficLight, points, flags: [...flags], findings: determineFindings(flags) };
}

function determineTrafficLight(points: number, flags: ReadonlySet<RiskFlag>): TrafficLight {
  if (HIGH_RISK_FLAGS.some((flag) => flags.has(flag))) {
    return 'red';
  }
  if (points >= YELLOW_THRESHOLD || flags.size > 0) {
    return 'yellow';
  }
  return 'green';
}

function determineFindings(flags: ReadonlySet<RiskFlag>): readonly string[] {
  const matches = FINDINGS.filter((f) => flags.has(f.flag)).map((f) => f.text);
  if (matches.length === 0) {
    return [GREEN_FINDING];
  }
  return matches.slice(0, 3);
}
