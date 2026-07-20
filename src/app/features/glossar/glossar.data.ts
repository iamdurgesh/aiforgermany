export interface GlossaryLink {
  readonly text: string;
  /** Internal path, e.g. /artikel/ki-inventar-pflicht or /schnellcheck */
  readonly path: string;
}

export interface GlossaryTerm {
  /** Anchor id for deep links, e.g. /glossar#hochrisiko-ki */
  readonly id: string;
  readonly term: string;
  readonly definition: string;
  /** Related internal links ("Mehr dazu"). */
  readonly links?: readonly GlossaryLink[];
}

/**
 * The glossary as one typed constant (WORKING MAP §8.5).
 * New terms: add an entry — the component handles alphabetical sorting.
 */
export const GLOSSARY: readonly GlossaryTerm[] = [
  {
    id: 'ai-act',
    term: 'AI Act (EU-KI-Verordnung)',
    definition:
      'Verordnung (EU) 2024/1689 — die europäische KI-Verordnung. Regelt KI-Systeme nach einem risikobasierten Ansatz: von verbotenen Praktiken über Hochrisiko-Systeme bis zu Transparenzpflichten. Gilt unmittelbar in allen Mitgliedstaaten, mit gestaffelten Fristen.',
    links: [
      { text: 'EU AI Act für den Mittelstand', path: '/artikel/eu-ai-act-mittelstand' },
      { text: 'KI-Act Schnellcheck', path: '/schnellcheck' },
    ],
  },
  {
    id: 'anbieter',
    term: 'Anbieter (Provider)',
    definition:
      'Wer ein KI-System entwickelt oder entwickeln lässt und es unter eigenem Namen in Verkehr bringt. Anbieter tragen die umfangreichsten Pflichten des AI Act — auch Unternehmen, die ein zugekauftes System wesentlich verändern oder umbenennen, können zum Anbieter werden.',
    links: [
      { text: 'EU AI Act für den Mittelstand', path: '/artikel/eu-ai-act-mittelstand' },
    ],
  },
  {
    id: 'anhang-i',
    term: 'Anhang I',
    definition:
      'Liste der Harmonisierungsrechtsvorschriften der EU (u. a. Maschinen, Medizinprodukte, Spielzeug, Aufzüge). KI-Systeme, die als Sicherheitskomponente solcher Produkte dienen, gelten als Hochrisiko-KI — für sie greifen die Pflichten zum Dezember 2027.',
    links: [
      { text: 'Die Dezember-2027-Deadline erklärt', path: '/artikel/deadline-dezember-2027' },
      { text: 'KI-Act Schnellcheck', path: '/schnellcheck' },
    ],
  },
  {
    id: 'anhang-iii',
    term: 'Anhang III',
    definition:
      'Liste der Hochrisiko-Anwendungsfälle des AI Act, u. a. Beschäftigung und Personalmanagement (Bewerber-Screening, Leistungsbewertung), Kreditwürdigkeitsprüfung, kritische Infrastruktur, Bildung und Strafverfolgung. Wer KI in diesen Bereichen einsetzt, fällt voraussichtlich unter Hochrisiko-Pflichten.',
    links: [
      { text: 'EU AI Act für den Mittelstand', path: '/artikel/eu-ai-act-mittelstand' },
      { text: 'KI-Act Schnellcheck', path: '/schnellcheck' },
    ],
  },
  {
    id: 'betreiber',
    term: 'Betreiber (Deployer)',
    definition:
      'Wer ein KI-System in eigener Verantwortung beruflich verwendet — die typische Rolle mittelständischer Unternehmen. Betreiber von Hochrisiko-KI müssen u. a. die Systeme bestimmungsgemäß einsetzen, Aufsicht durch Menschen sicherstellen und Vorfälle melden.',
    links: [
      { text: 'EU AI Act für den Mittelstand', path: '/artikel/eu-ai-act-mittelstand' },
    ],
  },
  {
    id: 'bundesnetzagentur',
    term: 'Bundesnetzagentur',
    definition:
      'Nach dem geplanten KI-MIG die zentrale Marktüberwachungsbehörde für den AI Act in Deutschland. Koordiniert die Aufsicht, ist Anlaufstelle für Unternehmen und arbeitet mit Fachbehörden wie Datenschutzaufsicht und BaFin zusammen.',
    links: [
      { text: 'KI-MIG: Deutschlands Umsetzungsgesetz', path: '/artikel/ki-mig-erklaert' },
    ],
  },
  {
    id: 'ce-kennzeichnung',
    term: 'CE-Kennzeichnung',
    definition:
      'Kennzeichnung, mit der der Anbieter erklärt, dass ein Hochrisiko-KI-System die Anforderungen des AI Act erfüllt. Setzt eine erfolgreich durchlaufene Konformitätsbewertung voraus.',
    links: [
      { text: 'Die Dezember-2027-Deadline erklärt', path: '/artikel/deadline-dezember-2027' },
    ],
  },
  {
    id: 'deepfake',
    term: 'Deepfake',
    definition:
      'Durch KI erzeugter oder manipulierter Bild-, Audio- oder Videoinhalt, der echten Personen, Objekten oder Ereignissen täuschend ähnlich ist. Muss nach Art. 50 AI Act als künstlich erzeugt gekennzeichnet werden.',
    links: [
      {
        text: 'Transparenzpflichten seit August 2026',
        path: '/artikel/art-50-transparenzpflichten',
      },
    ],
  },
  {
    id: 'dsgvo-und-ki',
    term: 'DSGVO und KI',
    definition:
      'Die Datenschutz-Grundverordnung gilt neben dem AI Act weiter: Sobald KI-Anwendungen personenbezogene Daten verarbeiten (Prompts, Trainingsdaten, Ergebnisse), braucht es eine Rechtsgrundlage, Transparenz und ggf. eine Datenschutz-Folgenabschätzung.',
    links: [
      { text: 'ChatGPT im Unternehmen', path: '/artikel/chatgpt-im-unternehmen' },
    ],
  },
  {
    id: 'gpai',
    term: 'GPAI (KI-Modell mit allgemeinem Verwendungszweck)',
    definition:
      'General-Purpose AI — Modelle wie GPT oder Claude, die für viele Zwecke einsetzbar sind. Für ihre Anbieter gelten eigene Pflichten (Dokumentation, Urheberrechts-Policy); besonders leistungsfähige Modelle unterliegen zusätzlichen Anforderungen.',
    links: [
      { text: 'ChatGPT im Unternehmen', path: '/artikel/chatgpt-im-unternehmen' },
    ],
  },
  {
    id: 'hochrisiko-ki',
    term: 'Hochrisiko-KI-System',
    definition:
      'KI-System, das unter Anhang I (Sicherheitskomponente regulierter Produkte) oder Anhang III (sensible Anwendungsfälle) fällt. Für Hochrisiko-Systeme gelten die strengsten Pflichten: Risikomanagement, Datenqualität, Dokumentation, menschliche Aufsicht, Robustheit.',
    links: [
      { text: 'EU AI Act für den Mittelstand', path: '/artikel/eu-ai-act-mittelstand' },
      { text: 'KI-Act Schnellcheck', path: '/schnellcheck' },
    ],
  },
  {
    id: 'ki-inventar',
    term: 'KI-Inventar',
    definition:
      'Strukturierte Übersicht aller im Unternehmen eingesetzten KI-Systeme mit Zweck, Datenarten, Verantwortlichen und Risikoeinstufung. Praktische Grundlage fast aller AI-Act-Pflichten — ohne Inventar lässt sich keine Pflicht zuverlässig erfüllen.',
    links: [
      { text: 'KI-Inventar erstellen', path: '/artikel/ki-inventar-pflicht' },
    ],
  },
  {
    id: 'ki-kompetenz',
    term: 'KI-Kompetenz (Art. 4)',
    definition:
      'Pflicht aller Anbieter und Betreiber, dafür zu sorgen, dass Mitarbeitende, die mit KI-Systemen umgehen, über ausreichende KI-Kompetenz verfügen — etwa durch Schulungen und interne Richtlinien. Gilt bereits seit Februar 2025.',
    links: [
      { text: 'Eine KI-Richtlinie fürs Unternehmen', path: '/artikel/ki-richtlinie-unternehmen' },
    ],
  },
  {
    id: 'ki-mig',
    term: 'KI-MIG',
    definition:
      'KI-Marktüberwachungs- und Innovationsförderungsgesetz — das deutsche Durchführungsgesetz zum AI Act. Benennt die zuständigen Behörden (zentral: die Bundesnetzagentur) und regelt Marktüberwachung sowie Unterstützungsangebote wie Reallabore.',
    links: [
      { text: 'KI-MIG: Deutschlands Umsetzungsgesetz', path: '/artikel/ki-mig-erklaert' },
    ],
  },
  {
    id: 'ki-reallabor',
    term: 'KI-Reallabor (Sandbox)',
    definition:
      'Kontrollierte Testumgebung unter behördlicher Begleitung, in der Unternehmen innovative KI-Systeme vor dem Markteintritt erproben können. Der AI Act verpflichtet die Mitgliedstaaten, solche Reallabore einzurichten.',
    links: [
      { text: 'KI-MIG: Deutschlands Umsetzungsgesetz', path: '/artikel/ki-mig-erklaert' },
    ],
  },
  {
    id: 'ki-system',
    term: 'KI-System (Art. 3)',
    definition:
      'Maschinengestütztes System, das mit unterschiedlichem Grad an Autonomie aus Eingaben Ergebnisse wie Vorhersagen, Empfehlungen oder Entscheidungen ableitet. Die Definition ist bewusst weit — sie erfasst deutlich mehr als Chatbots und umfasst viele eingebettete Funktionen in Standardsoftware.',
    links: [
      { text: 'KI-Inventar erstellen', path: '/artikel/ki-inventar-pflicht' },
    ],
  },
  {
    id: 'konformitaetsbewertung',
    term: 'Konformitätsbewertung',
    definition:
      'Verfahren, mit dem nachgewiesen wird, dass ein Hochrisiko-KI-System die Anforderungen des AI Act erfüllt — je nach Fall als interne Kontrolle oder unter Einbindung einer benannten Stelle. Voraussetzung für die CE-Kennzeichnung.',
    links: [
      { text: 'Die Dezember-2027-Deadline erklärt', path: '/artikel/deadline-dezember-2027' },
    ],
  },
  {
    id: 'marktueberwachung',
    term: 'Marktüberwachung',
    definition:
      'Behördliche Kontrolle, ob KI-Systeme am Markt die gesetzlichen Anforderungen einhalten. Marktüberwachungsbehörden können Unterlagen anfordern, Prüfungen anordnen und Systeme vom Markt nehmen.',
    links: [
      { text: 'KI-MIG: Deutschlands Umsetzungsgesetz', path: '/artikel/ki-mig-erklaert' },
    ],
  },
  {
    id: 'schatten-ki',
    term: 'Schatten-KI',
    definition:
      'KI-Nutzung im Unternehmen ohne Wissen oder Freigabe der IT — etwa private ChatGPT-Konten für Arbeitsaufgaben oder unbemerkt aktivierte KI-Funktionen in SaaS-Tools. Hauptrisiken: Datenabfluss, DSGVO-Verstöße und Lücken im KI-Inventar.',
    links: [
      { text: 'Schatten-KI erkennen: Anleitung', path: '/artikel/schatten-ki-erkennen' },
    ],
  },
  {
    id: 'transparenzpflichten',
    term: 'Transparenzpflichten (Art. 50)',
    definition:
      'Seit August 2026 geltende Pflichten: Menschen müssen erkennen können, wenn sie mit KI interagieren (Chatbots) oder wenn Inhalte KI-generiert sind (synthetische Medien, Deepfakes). Betrifft auch viele Unternehmen ohne Hochrisiko-Systeme.',
    links: [
      {
        text: 'Transparenzpflichten seit August 2026',
        path: '/artikel/art-50-transparenzpflichten',
      },
    ],
  },
  {
    id: 'verbotene-praktiken',
    term: 'Verbotene Praktiken (Art. 5)',
    definition:
      'KI-Anwendungen, die der AI Act seit Februar 2025 vollständig untersagt — u. a. manipulative Techniken mit erheblichem Schadenspotenzial, Social Scoring und bestimmte biometrische Fernidentifizierung im öffentlichen Raum.',
    links: [
      { text: 'EU AI Act für den Mittelstand', path: '/artikel/eu-ai-act-mittelstand' },
    ],
  },
];
