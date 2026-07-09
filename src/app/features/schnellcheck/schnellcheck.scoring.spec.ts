import { describe, expect, it } from 'vitest';

import {
  Antworten,
  CheckDefinition,
  SCHNELLCHECK,
  SCHNELLCHECK_DISCLAIMER,
} from './schnellcheck.definition';
import { evaluate, istVollstaendig } from './schnellcheck.scoring';

/** Antworten-Fixture: für jede Frage die Option mit 0 Punkten und ohne Flags. */
function harmloseAntworten(definition: CheckDefinition = SCHNELLCHECK): Record<string, string[]> {
  const antworten: Record<string, string[]> = {};
  for (const frage of definition.fragen) {
    const harmlos = frage.optionen.find((o) => !o.punkte && !o.flags?.length);
    if (!harmlos) {
      throw new Error(`Frage ${frage.id} hat keine harmlose Option.`);
    }
    antworten[frage.id] = [harmlos.id];
  }
  return antworten;
}

function mitAntwort(frageId: string, optionId: string): Antworten {
  return { ...harmloseAntworten(), [frageId]: [optionId] };
}

describe('SCHNELLCHECK Definition', () => {
  it('enthält die 10 Fragen aus der WORKING MAP', () => {
    expect(SCHNELLCHECK.fragen).toHaveLength(10);
  });

  it('hat eindeutige Frage-Ids und eindeutige Options-Ids je Frage', () => {
    const frageIds = SCHNELLCHECK.fragen.map((f) => f.id);
    expect(new Set(frageIds).size).toBe(frageIds.length);
    for (const frage of SCHNELLCHECK.fragen) {
      const optionIds = frage.optionen.map((o) => o.id);
      expect(new Set(optionIds).size).toBe(optionIds.length);
    }
  });

  it('bietet für jede Frage eine harmlose Antwort (Grün muss erreichbar sein)', () => {
    expect(() => harmloseAntworten()).not.toThrow();
  });

  it('enthält den unveränderten Pflicht-Disclaimer', () => {
    expect(SCHNELLCHECK.disclaimer).toBe(SCHNELLCHECK_DISCLAIMER);
    expect(SCHNELLCHECK.disclaimer).toContain('ersetzt keine Rechtsberatung');
  });

  it('formuliert keine Rechtsfolgen als Tatsache („Sie sind verpflichtet“)', () => {
    const alleTexte = SCHNELLCHECK.fragen
      .flatMap((f) => [f.text, f.hinweis ?? '', ...f.optionen.map((o) => o.text)])
      .join(' ');
    expect(alleTexte).not.toMatch(/Sie sind verpflichtet/i);
  });
});

describe('istVollstaendig', () => {
  it('ist wahr, wenn jede Frage beantwortet ist', () => {
    expect(istVollstaendig(SCHNELLCHECK, harmloseAntworten())).toBe(true);
  });

  it('ist falsch bei fehlender Antwort', () => {
    const antworten = harmloseAntworten();
    delete antworten['branche'];
    expect(istVollstaendig(SCHNELLCHECK, antworten)).toBe(false);
  });

  it('ist falsch bei leerer Auswahl', () => {
    const antworten = { ...harmloseAntworten(), inventar: [] };
    expect(istVollstaendig(SCHNELLCHECK, antworten)).toBe(false);
  });
});

describe('evaluate — Grundverhalten', () => {
  it('wirft bei unbekannter Options-Id', () => {
    expect(() => evaluate(SCHNELLCHECK, mitAntwort('inventar', 'gibt-es-nicht'))).toThrow(
      /Unbekannte Antwortoption/,
    );
  });

  it('bewertet fehlende Antworten als 0 Punkte (Teilstände sind erlaubt)', () => {
    expect(evaluate(SCHNELLCHECK, {})).toEqual({
      ampel: 'gruen',
      punkte: 0,
      flags: [],
      befunde: [expect.stringContaining('keine Hinweise auf Hochrisiko-Pflichten')],
    });
  });

  it('summiert Punkte über alle Fragen', () => {
    const antworten: Antworten = {
      ...harmloseAntworten(),
      'ki-tools': ['ja-bewusst'], // 2
      inventar: ['teilweise'], // 1
      richtlinien: ['teilweise'], // 1
    };
    expect(evaluate(SCHNELLCHECK, antworten).punkte).toBe(4);
  });
});

describe('evaluate — Ampel', () => {
  it('ist grün bei durchgehend harmlosen Antworten', () => {
    const result = evaluate(SCHNELLCHECK, harmloseAntworten());
    expect(result.ampel).toBe('gruen');
    expect(result.punkte).toBe(0);
    expect(result.flags).toEqual([]);
  });

  it.each([
    ['personalwesen', 'ja', 'anhang-iii'],
    ['kredit-bonitaet', 'ja', 'anhang-iii'],
    ['produktsicherheit', 'ja', 'anhang-i'],
  ])('ist rot, sobald %s=%s ein Hochrisiko-Flag (%s) setzt', (frageId, optionId, flag) => {
    const result = evaluate(SCHNELLCHECK, mitAntwort(frageId, optionId));
    expect(result.ampel).toBe('rot');
    expect(result.flags).toContain(flag);
  });

  it.each([
    ['ki-tools', 'vermutlich', 'schatten-ki'],
    ['ki-tools', 'unbekannt', 'schatten-ki'],
    ['personenbezogene-daten', 'ja', 'dsgvo'],
    ['personenbezogene-daten', 'unbekannt', 'dsgvo'],
    ['kundeninteraktion', 'ja', 'art-50'],
    ['kundeninteraktion', 'geplant', 'art-50'],
    ['inventar', 'nein', 'kein-inventar'],
    ['richtlinien', 'nein', 'keine-richtlinie'],
  ])('ist gelb bei Flag ohne Hochrisiko (%s=%s → %s)', (frageId, optionId, flag) => {
    const result = evaluate(SCHNELLCHECK, mitAntwort(frageId, optionId));
    expect(result.ampel).toBe('gelb');
    expect(result.flags).toContain(flag);
  });

  it('ist gelb ab 4 Punkten auch ohne Flags', () => {
    const antworten: Antworten = {
      ...harmloseAntworten(),
      'ki-tools': ['ja-bewusst'], // 2, kein Flag
      personalwesen: ['geplant'], // 2, kein Flag
    };
    const result = evaluate(SCHNELLCHECK, antworten);
    expect(result.punkte).toBe(4);
    expect(result.flags).toEqual([]);
    expect(result.ampel).toBe('gelb');
  });

  it('bleibt grün unterhalb der Gelb-Schwelle ohne Flags', () => {
    const antworten: Antworten = {
      ...harmloseAntworten(),
      'ki-tools': ['ja-bewusst'], // 2, kein Flag
      inventar: ['teilweise'], // 1, kein Flag
    };
    const result = evaluate(SCHNELLCHECK, antworten);
    expect(result.punkte).toBe(3);
    expect(result.ampel).toBe('gruen');
  });

  it('Hochrisiko dominiert: rot auch bei sonst harmlosen Antworten und wenigen Punkten', () => {
    const result = evaluate(SCHNELLCHECK, mitAntwort('produktsicherheit', 'ja'));
    expect(result.punkte).toBe(4);
    expect(result.ampel).toBe('rot');
  });
});

describe('evaluate — Befunde', () => {
  it('liefert für Grün genau einen beruhigenden, beobachtenden Befund', () => {
    const result = evaluate(SCHNELLCHECK, harmloseAntworten());
    expect(result.befunde).toHaveLength(1);
    expect(result.befunde[0]).toContain('keine Hinweise');
  });

  it('nennt bei Anhang I die Dezember-2027-Frist', () => {
    const result = evaluate(SCHNELLCHECK, mitAntwort('produktsicherheit', 'ja'));
    expect(result.befunde[0]).toContain('Dezember 2027');
  });

  it('nennt bei Art. 50 den Geltungsbeginn August 2026', () => {
    const result = evaluate(SCHNELLCHECK, mitAntwort('kundeninteraktion', 'ja'));
    expect(result.befunde[0]).toContain('August 2026');
  });

  it('begrenzt auf maximal 3 Befunde und priorisiert Hochrisiko', () => {
    const antworten: Antworten = {
      ...harmloseAntworten(),
      'ki-tools': ['vermutlich'], // schatten-ki
      personalwesen: ['ja'], // anhang-iii
      produktsicherheit: ['ja'], // anhang-i
      'personenbezogene-daten': ['ja'], // dsgvo
      kundeninteraktion: ['ja'], // art-50
      inventar: ['nein'], // kein-inventar
      richtlinien: ['nein'], // keine-richtlinie
    };
    const result = evaluate(SCHNELLCHECK, antworten);
    expect(result.befunde).toHaveLength(3);
    expect(result.befunde[0]).toContain('Anhang III');
    expect(result.befunde[1]).toContain('Anhang I');
    expect(result.befunde[2]).toContain('Art. 50');
  });

  it('formuliert Befunde als Orientierung, nie als Rechtsfolge', () => {
    const antworten: Antworten = {
      ...harmloseAntworten(),
      personalwesen: ['ja'],
      produktsicherheit: ['ja'],
      kundeninteraktion: ['ja'],
      inventar: ['nein'],
    };
    for (const befund of evaluate(SCHNELLCHECK, antworten).befunde) {
      expect(befund).not.toMatch(/Sie sind verpflichtet|Sie müssen/i);
    }
  });
});

describe('evaluate — vollständige Optionsabdeckung', () => {
  // Jede einzelne Antwortoption jeder Frage wird einmal isoliert bewertet:
  // Punkte und Flags müssen exakt der Definition entsprechen.
  for (const frage of SCHNELLCHECK.fragen) {
    for (const option of frage.optionen) {
      it(`${frage.id} → ${option.id}: Punkte=${option.punkte ?? 0}, Flags=${(option.flags ?? []).join(',') || '—'}`, () => {
        const result = evaluate(SCHNELLCHECK, { [frage.id]: [option.id] });
        expect(result.punkte).toBe(option.punkte ?? 0);
        expect([...result.flags].sort()).toEqual([...(option.flags ?? [])].sort());
      });
    }
  }
});
