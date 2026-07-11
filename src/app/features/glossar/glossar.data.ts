export interface GlossarVerweis {
  readonly text: string;
  /** Interner Pfad, z. B. /artikel/ki-inventar-pflicht oder /schnellcheck */
  readonly pfad: string;
}

export interface GlossarBegriff {
  /** Anker-Id für Deep-Links, z. B. /glossar#hochrisiko-ki */
  readonly id: string;
  readonly begriff: string;
  readonly definition: string;
  /** Weiterführende interne Links („Mehr dazu"). */
  readonly verweise?: readonly GlossarVerweis[];
}

/**
 * Glossar als eine typisierte Konstante (WORKING MAP §8.5).
 * Neue Begriffe: Eintrag ergänzen — alphabetische Sortierung übernimmt die Komponente.
 */
export const GLOSSAR: readonly GlossarBegriff[] = [
  {
    id: 'ai-act',
    begriff: 'AI Act (EU-KI-Verordnung)',
    definition:
      'Verordnung (EU) 2024/1689 — die europäische KI-Verordnung. Regelt KI-Systeme nach einem risikobasierten Ansatz: von verbotenen Praktiken über Hochrisiko-Systeme bis zu Transparenzpflichten. Gilt unmittelbar in allen Mitgliedstaaten, mit gestaffelten Fristen.',
    verweise: [
      { text: 'EU AI Act für den Mittelstand', pfad: '/artikel/eu-ai-act-mittelstand' },
      { text: 'KI-Act Schnellcheck', pfad: '/schnellcheck' },
    ],
  },
  {
    id: 'anbieter',
    begriff: 'Anbieter (Provider)',
    definition:
      'Wer ein KI-System entwickelt oder entwickeln lässt und es unter eigenem Namen in Verkehr bringt. Anbieter tragen die umfangreichsten Pflichten des AI Act — auch Unternehmen, die ein zugekauftes System wesentlich verändern oder umbenennen, können zum Anbieter werden.',
    verweise: [
      { text: 'EU AI Act für den Mittelstand', pfad: '/artikel/eu-ai-act-mittelstand' },
    ],
  },
  {
    id: 'anhang-i',
    begriff: 'Anhang I',
    definition:
      'Liste der Harmonisierungsrechtsvorschriften der EU (u. a. Maschinen, Medizinprodukte, Spielzeug, Aufzüge). KI-Systeme, die als Sicherheitskomponente solcher Produkte dienen, gelten als Hochrisiko-KI — für sie greifen die Pflichten zum Dezember 2027.',
    verweise: [
      { text: 'Die Dezember-2027-Deadline erklärt', pfad: '/artikel/deadline-dezember-2027' },
      { text: 'KI-Act Schnellcheck', pfad: '/schnellcheck' },
    ],
  },
  {
    id: 'anhang-iii',
    begriff: 'Anhang III',
    definition:
      'Liste der Hochrisiko-Anwendungsfälle des AI Act, u. a. Beschäftigung und Personalmanagement (Bewerber-Screening, Leistungsbewertung), Kreditwürdigkeitsprüfung, kritische Infrastruktur, Bildung und Strafverfolgung. Wer KI in diesen Bereichen einsetzt, fällt voraussichtlich unter Hochrisiko-Pflichten.',
    verweise: [
      { text: 'EU AI Act für den Mittelstand', pfad: '/artikel/eu-ai-act-mittelstand' },
      { text: 'KI-Act Schnellcheck', pfad: '/schnellcheck' },
    ],
  },
  {
    id: 'betreiber',
    begriff: 'Betreiber (Deployer)',
    definition:
      'Wer ein KI-System in eigener Verantwortung beruflich verwendet — die typische Rolle mittelständischer Unternehmen. Betreiber von Hochrisiko-KI müssen u. a. die Systeme bestimmungsgemäß einsetzen, Aufsicht durch Menschen sicherstellen und Vorfälle melden.',
    verweise: [
      { text: 'EU AI Act für den Mittelstand', pfad: '/artikel/eu-ai-act-mittelstand' },
    ],
  },
  {
    id: 'bundesnetzagentur',
    begriff: 'Bundesnetzagentur',
    definition:
      'Nach dem geplanten KI-MIG die zentrale Marktüberwachungsbehörde für den AI Act in Deutschland. Koordiniert die Aufsicht, ist Anlaufstelle für Unternehmen und arbeitet mit Fachbehörden wie Datenschutzaufsicht und BaFin zusammen.',
    verweise: [
      { text: 'KI-MIG: Deutschlands Umsetzungsgesetz', pfad: '/artikel/ki-mig-erklaert' },
    ],
  },
  {
    id: 'ce-kennzeichnung',
    begriff: 'CE-Kennzeichnung',
    definition:
      'Kennzeichnung, mit der der Anbieter erklärt, dass ein Hochrisiko-KI-System die Anforderungen des AI Act erfüllt. Setzt eine erfolgreich durchlaufene Konformitätsbewertung voraus.',
    verweise: [
      { text: 'Die Dezember-2027-Deadline erklärt', pfad: '/artikel/deadline-dezember-2027' },
    ],
  },
  {
    id: 'deepfake',
    begriff: 'Deepfake',
    definition:
      'Durch KI erzeugter oder manipulierter Bild-, Audio- oder Videoinhalt, der echten Personen, Objekten oder Ereignissen täuschend ähnlich ist. Muss nach Art. 50 AI Act als künstlich erzeugt gekennzeichnet werden.',
    verweise: [
      {
        text: 'Transparenzpflichten seit August 2026',
        pfad: '/artikel/art-50-transparenzpflichten',
      },
    ],
  },
  {
    id: 'dsgvo-und-ki',
    begriff: 'DSGVO und KI',
    definition:
      'Die Datenschutz-Grundverordnung gilt neben dem AI Act weiter: Sobald KI-Anwendungen personenbezogene Daten verarbeiten (Prompts, Trainingsdaten, Ergebnisse), braucht es eine Rechtsgrundlage, Transparenz und ggf. eine Datenschutz-Folgenabschätzung.',
    verweise: [
      { text: 'ChatGPT im Unternehmen', pfad: '/artikel/chatgpt-im-unternehmen' },
    ],
  },
  {
    id: 'gpai',
    begriff: 'GPAI (KI-Modell mit allgemeinem Verwendungszweck)',
    definition:
      'General-Purpose AI — Modelle wie GPT oder Claude, die für viele Zwecke einsetzbar sind. Für ihre Anbieter gelten eigene Pflichten (Dokumentation, Urheberrechts-Policy); besonders leistungsfähige Modelle unterliegen zusätzlichen Anforderungen.',
    verweise: [
      { text: 'ChatGPT im Unternehmen', pfad: '/artikel/chatgpt-im-unternehmen' },
    ],
  },
  {
    id: 'hochrisiko-ki',
    begriff: 'Hochrisiko-KI-System',
    definition:
      'KI-System, das unter Anhang I (Sicherheitskomponente regulierter Produkte) oder Anhang III (sensible Anwendungsfälle) fällt. Für Hochrisiko-Systeme gelten die strengsten Pflichten: Risikomanagement, Datenqualität, Dokumentation, menschliche Aufsicht, Robustheit.',
    verweise: [
      { text: 'EU AI Act für den Mittelstand', pfad: '/artikel/eu-ai-act-mittelstand' },
      { text: 'KI-Act Schnellcheck', pfad: '/schnellcheck' },
    ],
  },
  {
    id: 'ki-inventar',
    begriff: 'KI-Inventar',
    definition:
      'Strukturierte Übersicht aller im Unternehmen eingesetzten KI-Systeme mit Zweck, Datenarten, Verantwortlichen und Risikoeinstufung. Praktische Grundlage fast aller AI-Act-Pflichten — ohne Inventar lässt sich keine Pflicht zuverlässig erfüllen.',
    verweise: [
      { text: 'KI-Inventar erstellen', pfad: '/artikel/ki-inventar-pflicht' },
    ],
  },
  {
    id: 'ki-kompetenz',
    begriff: 'KI-Kompetenz (Art. 4)',
    definition:
      'Pflicht aller Anbieter und Betreiber, dafür zu sorgen, dass Mitarbeitende, die mit KI-Systemen umgehen, über ausreichende KI-Kompetenz verfügen — etwa durch Schulungen und interne Richtlinien. Gilt bereits seit Februar 2025.',
    verweise: [
      { text: 'Eine KI-Richtlinie fürs Unternehmen', pfad: '/artikel/ki-richtlinie-unternehmen' },
    ],
  },
  {
    id: 'ki-mig',
    begriff: 'KI-MIG',
    definition:
      'KI-Marktüberwachungs- und Innovationsförderungsgesetz — das deutsche Durchführungsgesetz zum AI Act. Benennt die zuständigen Behörden (zentral: die Bundesnetzagentur) und regelt Marktüberwachung sowie Unterstützungsangebote wie Reallabore.',
    verweise: [
      { text: 'KI-MIG: Deutschlands Umsetzungsgesetz', pfad: '/artikel/ki-mig-erklaert' },
    ],
  },
  {
    id: 'ki-reallabor',
    begriff: 'KI-Reallabor (Sandbox)',
    definition:
      'Kontrollierte Testumgebung unter behördlicher Begleitung, in der Unternehmen innovative KI-Systeme vor dem Markteintritt erproben können. Der AI Act verpflichtet die Mitgliedstaaten, solche Reallabore einzurichten.',
    verweise: [
      { text: 'KI-MIG: Deutschlands Umsetzungsgesetz', pfad: '/artikel/ki-mig-erklaert' },
    ],
  },
  {
    id: 'ki-system',
    begriff: 'KI-System (Art. 3)',
    definition:
      'Maschinengestütztes System, das mit unterschiedlichem Grad an Autonomie aus Eingaben Ergebnisse wie Vorhersagen, Empfehlungen oder Entscheidungen ableitet. Die Definition ist bewusst weit — sie erfasst deutlich mehr als Chatbots und umfasst viele eingebettete Funktionen in Standardsoftware.',
    verweise: [
      { text: 'KI-Inventar erstellen', pfad: '/artikel/ki-inventar-pflicht' },
    ],
  },
  {
    id: 'konformitaetsbewertung',
    begriff: 'Konformitätsbewertung',
    definition:
      'Verfahren, mit dem nachgewiesen wird, dass ein Hochrisiko-KI-System die Anforderungen des AI Act erfüllt — je nach Fall als interne Kontrolle oder unter Einbindung einer benannten Stelle. Voraussetzung für die CE-Kennzeichnung.',
    verweise: [
      { text: 'Die Dezember-2027-Deadline erklärt', pfad: '/artikel/deadline-dezember-2027' },
    ],
  },
  {
    id: 'marktueberwachung',
    begriff: 'Marktüberwachung',
    definition:
      'Behördliche Kontrolle, ob KI-Systeme am Markt die gesetzlichen Anforderungen einhalten. Marktüberwachungsbehörden können Unterlagen anfordern, Prüfungen anordnen und Systeme vom Markt nehmen.',
    verweise: [
      { text: 'KI-MIG: Deutschlands Umsetzungsgesetz', pfad: '/artikel/ki-mig-erklaert' },
    ],
  },
  {
    id: 'schatten-ki',
    begriff: 'Schatten-KI',
    definition:
      'KI-Nutzung im Unternehmen ohne Wissen oder Freigabe der IT — etwa private ChatGPT-Konten für Arbeitsaufgaben oder unbemerkt aktivierte KI-Funktionen in SaaS-Tools. Hauptrisiken: Datenabfluss, DSGVO-Verstöße und Lücken im KI-Inventar.',
    verweise: [
      { text: 'Schatten-KI erkennen: Anleitung', pfad: '/artikel/schatten-ki-erkennen' },
    ],
  },
  {
    id: 'transparenzpflichten',
    begriff: 'Transparenzpflichten (Art. 50)',
    definition:
      'Seit August 2026 geltende Pflichten: Menschen müssen erkennen können, wenn sie mit KI interagieren (Chatbots) oder wenn Inhalte KI-generiert sind (synthetische Medien, Deepfakes). Betrifft auch viele Unternehmen ohne Hochrisiko-Systeme.',
    verweise: [
      {
        text: 'Transparenzpflichten seit August 2026',
        pfad: '/artikel/art-50-transparenzpflichten',
      },
    ],
  },
  {
    id: 'verbotene-praktiken',
    begriff: 'Verbotene Praktiken (Art. 5)',
    definition:
      'KI-Anwendungen, die der AI Act seit Februar 2025 vollständig untersagt — u. a. manipulative Techniken mit erheblichem Schadenspotenzial, Social Scoring und bestimmte biometrische Fernidentifizierung im öffentlichen Raum.',
    verweise: [
      { text: 'EU AI Act für den Mittelstand', pfad: '/artikel/eu-ai-act-mittelstand' },
    ],
  },
];
