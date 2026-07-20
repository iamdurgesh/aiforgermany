/**
 * KI-Act Schnellcheck — data-driven definition (WORKING MAP §4).
 *
 * The whole check is ONE typed constant: questions, answer options, points,
 * and risk flags. The generic renderer and the pure scoring function operate
 * exclusively on this structure — a new question only requires another entry
 * here, no component change.
 *
 * Question and option ids are German slugs on purpose: they are content data,
 * persisted in the database (answers_json) and referenced by the articles.
 */

/** Risk flags that answer options can trigger. */
export type RiskFlag =
  'annex-i' | 'annex-iii' | 'gdpr' | 'art-50' | 'shadow-ai' | 'no-inventory' | 'no-policy';

export interface AnswerOption {
  readonly id: string;
  readonly text: string;
  /** Risk points of this answer (default: 0). */
  readonly points?: number;
  readonly flags?: readonly RiskFlag[];
}

export interface Question {
  readonly id: string;
  readonly text: string;
  /** Optional explanation shown below the question. */
  readonly hint?: string;
  readonly type: 'single' | 'multi';
  readonly options: readonly AnswerOption[];
}

export interface CheckDefinition {
  readonly disclaimer: string;
  readonly questions: readonly Question[];
}

/** Answers: question id → selected option ids (exactly one for `single`). */
export type Answers = Readonly<Record<string, readonly string[]>>;

/**
 * MANDATORY disclaimer (German Legal Services Act): visible before the start
 * and in the result. Do not soften the wording (WORKING MAP §4/§10).
 */
export const SCHNELLCHECK_DISCLAIMER =
  'Der Schnellcheck bietet eine unverbindliche erste Orientierung und ersetzt keine ' +
  'Rechtsberatung. Für verbindliche Einschätzungen wenden Sie sich an qualifizierte ' +
  'Rechtsberatung.';

export const SCHNELLCHECK: CheckDefinition = {
  disclaimer: SCHNELLCHECK_DISCLAIMER,
  questions: [
    {
      id: 'mitarbeitende',
      text: 'Wie viele Mitarbeitende hat Ihr Unternehmen?',
      type: 'single',
      options: [
        { id: 'bis-99', text: 'Weniger als 100' },
        { id: '100-499', text: '100 bis 499' },
        { id: '500-1999', text: '500 bis 1.999' },
        { id: 'ab-2000', text: '2.000 oder mehr' },
      ],
    },
    {
      id: 'ki-tools',
      text: 'Nutzen Mitarbeitende KI-Tools wie ChatGPT, Copilot oder DeepL?',
      type: 'single',
      options: [
        { id: 'ja-bewusst', text: 'Ja, bewusst und freigegeben', points: 2 },
        { id: 'vermutlich', text: 'Vermutlich ja, ohne Freigabe', points: 3, flags: ['shadow-ai'] },
        { id: 'nein', text: 'Nein' },
        { id: 'unbekannt', text: 'Unbekannt', points: 2, flags: ['shadow-ai'] },
      ],
    },
    {
      id: 'personalwesen',
      text: 'Setzen Sie KI im Personalwesen ein (z. B. Bewerber-Screening, Leistungsbewertung)?',
      hint: 'Solche Anwendungen könnten unter Anhang III des EU AI Act fallen (Hochrisiko).',
      type: 'single',
      options: [
        { id: 'ja', text: 'Ja', points: 4, flags: ['annex-iii'] },
        { id: 'geplant', text: 'In Planung', points: 2 },
        { id: 'nein', text: 'Nein' },
      ],
    },
    {
      id: 'kredit-bonitaet',
      text: 'Setzen Sie KI bei Kreditvergabe, Versicherung oder Bonitätsprüfung ein?',
      hint: 'Auch diese Anwendungen könnten unter Anhang III fallen (Hochrisiko).',
      type: 'single',
      options: [
        { id: 'ja', text: 'Ja', points: 4, flags: ['annex-iii'] },
        { id: 'geplant', text: 'In Planung', points: 2 },
        { id: 'nein', text: 'Nein' },
      ],
    },
    {
      id: 'produktsicherheit',
      text: 'Nutzen Sie KI in Produkten mit Sicherheitsfunktion (z. B. Maschinen, Medizinprodukte)?',
      hint: 'KI als Sicherheitskomponente regulierter Produkte fällt unter Anhang I — Frist: Dezember 2027.',
      type: 'single',
      options: [
        { id: 'ja', text: 'Ja', points: 4, flags: ['annex-i'] },
        { id: 'unsicher', text: 'Unsicher', points: 2 },
        { id: 'nein', text: 'Nein' },
      ],
    },
    {
      id: 'personenbezogene-daten',
      text: 'Verarbeiten Ihre KI-Anwendungen personenbezogene Daten?',
      type: 'single',
      options: [
        { id: 'ja', text: 'Ja', points: 2, flags: ['gdpr'] },
        { id: 'unbekannt', text: 'Unbekannt', points: 2, flags: ['gdpr'] },
        { id: 'nein', text: 'Nein' },
      ],
    },
    {
      id: 'kundeninteraktion',
      text: 'Interagieren Kunden direkt mit KI (z. B. Chatbots, generierte Inhalte)?',
      hint: 'Dann gelten voraussichtlich die Transparenzpflichten nach Art. 50 — bereits seit August 2026.',
      type: 'single',
      options: [
        { id: 'ja', text: 'Ja', points: 2, flags: ['art-50'] },
        { id: 'geplant', text: 'In Planung', points: 1, flags: ['art-50'] },
        { id: 'nein', text: 'Nein' },
      ],
    },
    {
      id: 'inventar',
      text: 'Existiert ein Inventar aller KI-Systeme im Unternehmen?',
      type: 'single',
      options: [
        { id: 'ja', text: 'Ja' },
        { id: 'teilweise', text: 'Teilweise', points: 1 },
        { id: 'nein', text: 'Nein', points: 2, flags: ['no-inventory'] },
      ],
    },
    {
      id: 'richtlinien',
      text: 'Gibt es interne KI-Richtlinien und Schulungen (KI-Kompetenz, Art. 4)?',
      type: 'single',
      options: [
        { id: 'ja', text: 'Ja' },
        { id: 'teilweise', text: 'Teilweise', points: 1 },
        { id: 'nein', text: 'Nein', points: 2, flags: ['no-policy'] },
      ],
    },
    {
      id: 'branche',
      text: 'In welcher Branche sind Sie tätig?',
      hint: 'Dient der Einordnung im E-Mail-Ergebnis.',
      type: 'single',
      options: [
        { id: 'industrie', text: 'Industrie / Produktion' },
        { id: 'handel', text: 'Handel' },
        { id: 'finanzen', text: 'Finanzen / Versicherung' },
        { id: 'gesundheit', text: 'Gesundheit / Pflege' },
        { id: 'it', text: 'IT / Software' },
        { id: 'logistik', text: 'Logistik / Verkehr' },
        { id: 'bau', text: 'Bau / Handwerk' },
        { id: 'dienstleistung', text: 'Dienstleistung / Beratung' },
        { id: 'oeffentlich', text: 'Öffentlicher Sektor' },
        { id: 'sonstige', text: 'Sonstige' },
      ],
    },
  ],
};
