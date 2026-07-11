/**
 * KI-Act Schnellcheck — datengetriebene Definition (WORKING MAP §4).
 *
 * Der gesamte Check ist EINE typisierte Konstante: Fragen, Antwortoptionen,
 * Punkte und Risiko-Flags. Der generische Renderer und die reine
 * Bewertungsfunktion arbeiten ausschließlich auf dieser Struktur — eine neue
 * Frage erfordert nur einen weiteren Eintrag hier, keine Komponentenänderung.
 */

/** Risiko-Flags, die Antwortoptionen auslösen können. */
export type RisikoFlag =
  | 'anhang-i'
  | 'anhang-iii'
  | 'dsgvo'
  | 'art-50'
  | 'schatten-ki'
  | 'kein-inventar'
  | 'keine-richtlinie';

export interface AntwortOption {
  readonly id: string;
  readonly text: string;
  /** Risikopunkte dieser Antwort (Standard: 0). */
  readonly punkte?: number;
  readonly flags?: readonly RisikoFlag[];
}

export interface Frage {
  readonly id: string;
  readonly text: string;
  /** Optionale Erläuterung unter der Frage. */
  readonly hinweis?: string;
  readonly typ: 'single' | 'multi';
  readonly optionen: readonly AntwortOption[];
}

export interface CheckDefinition {
  readonly disclaimer: string;
  readonly fragen: readonly Frage[];
}

/** Antworten: Frage-Id → gewählte Options-Ids (bei `single` genau eine). */
export type Antworten = Readonly<Record<string, readonly string[]>>;

/**
 * PFLICHT-Disclaimer (Rechtsdienstleistungsgesetz): sichtbar vor dem Start
 * und im Ergebnis. Formulierung nicht abschwächen (WORKING MAP §4/§10).
 */
export const SCHNELLCHECK_DISCLAIMER =
  'Der Schnellcheck bietet eine unverbindliche erste Orientierung und ersetzt keine ' +
  'Rechtsberatung. Für verbindliche Einschätzungen wenden Sie sich an qualifizierte ' +
  'Rechtsberatung.';

export const SCHNELLCHECK: CheckDefinition = {
  disclaimer: SCHNELLCHECK_DISCLAIMER,
  fragen: [
    {
      id: 'mitarbeitende',
      text: 'Wie viele Mitarbeitende hat Ihr Unternehmen?',
      typ: 'single',
      optionen: [
        { id: 'bis-99', text: 'Weniger als 100' },
        { id: '100-499', text: '100 bis 499' },
        { id: '500-1999', text: '500 bis 1.999' },
        { id: 'ab-2000', text: '2.000 oder mehr' },
      ],
    },
    {
      id: 'ki-tools',
      text: 'Nutzen Mitarbeitende KI-Tools wie ChatGPT, Copilot oder DeepL?',
      typ: 'single',
      optionen: [
        { id: 'ja-bewusst', text: 'Ja, bewusst und freigegeben', punkte: 2 },
        { id: 'vermutlich', text: 'Vermutlich ja, ohne Freigabe', punkte: 3, flags: ['schatten-ki'] },
        { id: 'nein', text: 'Nein' },
        { id: 'unbekannt', text: 'Unbekannt', punkte: 2, flags: ['schatten-ki'] },
      ],
    },
    {
      id: 'personalwesen',
      text: 'Setzen Sie KI im Personalwesen ein (z. B. Bewerber-Screening, Leistungsbewertung)?',
      hinweis: 'Solche Anwendungen könnten unter Anhang III des EU AI Act fallen (Hochrisiko).',
      typ: 'single',
      optionen: [
        { id: 'ja', text: 'Ja', punkte: 4, flags: ['anhang-iii'] },
        { id: 'geplant', text: 'In Planung', punkte: 2 },
        { id: 'nein', text: 'Nein' },
      ],
    },
    {
      id: 'kredit-bonitaet',
      text: 'Setzen Sie KI bei Kreditvergabe, Versicherung oder Bonitätsprüfung ein?',
      hinweis: 'Auch diese Anwendungen könnten unter Anhang III fallen (Hochrisiko).',
      typ: 'single',
      optionen: [
        { id: 'ja', text: 'Ja', punkte: 4, flags: ['anhang-iii'] },
        { id: 'geplant', text: 'In Planung', punkte: 2 },
        { id: 'nein', text: 'Nein' },
      ],
    },
    {
      id: 'produktsicherheit',
      text: 'Nutzen Sie KI in Produkten mit Sicherheitsfunktion (z. B. Maschinen, Medizinprodukte)?',
      hinweis: 'KI als Sicherheitskomponente regulierter Produkte fällt unter Anhang I — Frist: Dezember 2027.',
      typ: 'single',
      optionen: [
        { id: 'ja', text: 'Ja', punkte: 4, flags: ['anhang-i'] },
        { id: 'unsicher', text: 'Unsicher', punkte: 2 },
        { id: 'nein', text: 'Nein' },
      ],
    },
    {
      id: 'personenbezogene-daten',
      text: 'Verarbeiten Ihre KI-Anwendungen personenbezogene Daten?',
      typ: 'single',
      optionen: [
        { id: 'ja', text: 'Ja', punkte: 2, flags: ['dsgvo'] },
        { id: 'unbekannt', text: 'Unbekannt', punkte: 2, flags: ['dsgvo'] },
        { id: 'nein', text: 'Nein' },
      ],
    },
    {
      id: 'kundeninteraktion',
      text: 'Interagieren Kunden direkt mit KI (z. B. Chatbots, generierte Inhalte)?',
      hinweis: 'Dann gelten voraussichtlich die Transparenzpflichten nach Art. 50 — bereits seit August 2026.',
      typ: 'single',
      optionen: [
        { id: 'ja', text: 'Ja', punkte: 2, flags: ['art-50'] },
        { id: 'geplant', text: 'In Planung', punkte: 1, flags: ['art-50'] },
        { id: 'nein', text: 'Nein' },
      ],
    },
    {
      id: 'inventar',
      text: 'Existiert ein Inventar aller KI-Systeme im Unternehmen?',
      typ: 'single',
      optionen: [
        { id: 'ja', text: 'Ja' },
        { id: 'teilweise', text: 'Teilweise', punkte: 1 },
        { id: 'nein', text: 'Nein', punkte: 2, flags: ['kein-inventar'] },
      ],
    },
    {
      id: 'richtlinien',
      text: 'Gibt es interne KI-Richtlinien und Schulungen (KI-Kompetenz, Art. 4)?',
      typ: 'single',
      optionen: [
        { id: 'ja', text: 'Ja' },
        { id: 'teilweise', text: 'Teilweise', punkte: 1 },
        { id: 'nein', text: 'Nein', punkte: 2, flags: ['keine-richtlinie'] },
      ],
    },
    {
      id: 'branche',
      text: 'In welcher Branche sind Sie tätig?',
      hinweis: 'Dient der Einordnung im E-Mail-Ergebnis.',
      typ: 'single',
      optionen: [
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
