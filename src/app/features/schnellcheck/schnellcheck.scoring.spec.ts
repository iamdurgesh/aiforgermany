import { describe, expect, it } from 'vitest';

import {
  Answers,
  CheckDefinition,
  SCHNELLCHECK,
  SCHNELLCHECK_DISCLAIMER,
} from './schnellcheck.definition';
import { evaluate, isComplete } from './schnellcheck.scoring';

/** Answers fixture: for each question the option with 0 points and no flags. */
function harmlessAnswers(definition: CheckDefinition = SCHNELLCHECK): Record<string, string[]> {
  const answers: Record<string, string[]> = {};
  for (const question of definition.questions) {
    const harmless = question.options.find((o) => !o.points && !o.flags?.length);
    if (!harmless) {
      throw new Error(`Question ${question.id} has no harmless option.`);
    }
    answers[question.id] = [harmless.id];
  }
  return answers;
}

function withAnswer(questionId: string, optionId: string): Answers {
  return { ...harmlessAnswers(), [questionId]: [optionId] };
}

describe('SCHNELLCHECK definition', () => {
  it('contains the 10 questions from the WORKING MAP', () => {
    expect(SCHNELLCHECK.questions).toHaveLength(10);
  });

  it('has unique question ids and unique option ids per question', () => {
    const questionIds = SCHNELLCHECK.questions.map((q) => q.id);
    expect(new Set(questionIds).size).toBe(questionIds.length);
    for (const question of SCHNELLCHECK.questions) {
      const optionIds = question.options.map((o) => o.id);
      expect(new Set(optionIds).size).toBe(optionIds.length);
    }
  });

  it('offers a harmless answer for every question (green must be reachable)', () => {
    expect(() => harmlessAnswers()).not.toThrow();
  });

  it('contains the unmodified mandatory disclaimer', () => {
    expect(SCHNELLCHECK.disclaimer).toBe(SCHNELLCHECK_DISCLAIMER);
    expect(SCHNELLCHECK.disclaimer).toContain('ersetzt keine Rechtsberatung');
  });

  it('never states legal consequences as fact ("Sie sind verpflichtet")', () => {
    const allTexts = SCHNELLCHECK.questions
      .flatMap((q) => [q.text, q.hint ?? '', ...q.options.map((o) => o.text)])
      .join(' ');
    expect(allTexts).not.toMatch(/Sie sind verpflichtet/i);
  });
});

describe('isComplete', () => {
  it('is true when every question is answered', () => {
    expect(isComplete(SCHNELLCHECK, harmlessAnswers())).toBe(true);
  });

  it('is false when an answer is missing', () => {
    const answers = harmlessAnswers();
    delete answers['branche'];
    expect(isComplete(SCHNELLCHECK, answers)).toBe(false);
  });

  it('is false for an empty selection', () => {
    const answers = { ...harmlessAnswers(), inventar: [] };
    expect(isComplete(SCHNELLCHECK, answers)).toBe(false);
  });
});

describe('evaluate — basics', () => {
  it('throws on an unknown option id', () => {
    expect(() => evaluate(SCHNELLCHECK, withAnswer('inventar', 'gibt-es-nicht'))).toThrow(
      /Unknown answer option/,
    );
  });

  it('scores missing answers as 0 points (partial states are allowed)', () => {
    expect(evaluate(SCHNELLCHECK, {})).toEqual({
      trafficLight: 'green',
      points: 0,
      flags: [],
      findings: [expect.stringContaining('keine Hinweise auf Hochrisiko-Pflichten')],
    });
  });

  it('sums points across all questions', () => {
    const answers: Answers = {
      ...harmlessAnswers(),
      'ki-tools': ['ja-bewusst'], // 2
      inventar: ['teilweise'], // 1
      richtlinien: ['teilweise'], // 1
    };
    expect(evaluate(SCHNELLCHECK, answers).points).toBe(4);
  });
});

describe('evaluate — traffic light', () => {
  it('is green for consistently harmless answers', () => {
    const result = evaluate(SCHNELLCHECK, harmlessAnswers());
    expect(result.trafficLight).toBe('green');
    expect(result.points).toBe(0);
    expect(result.flags).toEqual([]);
  });

  it.each([
    ['personalwesen', 'ja', 'annex-iii'],
    ['kredit-bonitaet', 'ja', 'annex-iii'],
    ['produktsicherheit', 'ja', 'annex-i'],
  ])('is red as soon as %s=%s sets a high-risk flag (%s)', (questionId, optionId, flag) => {
    const result = evaluate(SCHNELLCHECK, withAnswer(questionId, optionId));
    expect(result.trafficLight).toBe('red');
    expect(result.flags).toContain(flag);
  });

  it.each([
    ['ki-tools', 'vermutlich', 'shadow-ai'],
    ['ki-tools', 'unbekannt', 'shadow-ai'],
    ['personenbezogene-daten', 'ja', 'gdpr'],
    ['personenbezogene-daten', 'unbekannt', 'gdpr'],
    ['kundeninteraktion', 'ja', 'art-50'],
    ['kundeninteraktion', 'geplant', 'art-50'],
    ['inventar', 'nein', 'no-inventory'],
    ['richtlinien', 'nein', 'no-policy'],
  ])('is yellow for a flag without high risk (%s=%s → %s)', (questionId, optionId, flag) => {
    const result = evaluate(SCHNELLCHECK, withAnswer(questionId, optionId));
    expect(result.trafficLight).toBe('yellow');
    expect(result.flags).toContain(flag);
  });

  it('is yellow from 4 points even without flags', () => {
    const answers: Answers = {
      ...harmlessAnswers(),
      'ki-tools': ['ja-bewusst'], // 2, no flag
      personalwesen: ['geplant'], // 2, no flag
    };
    const result = evaluate(SCHNELLCHECK, answers);
    expect(result.points).toBe(4);
    expect(result.flags).toEqual([]);
    expect(result.trafficLight).toBe('yellow');
  });

  it('stays green below the yellow threshold without flags', () => {
    const answers: Answers = {
      ...harmlessAnswers(),
      'ki-tools': ['ja-bewusst'], // 2, no flag
      inventar: ['teilweise'], // 1, no flag
    };
    const result = evaluate(SCHNELLCHECK, answers);
    expect(result.points).toBe(3);
    expect(result.trafficLight).toBe('green');
  });

  it('high risk dominates: red even with otherwise harmless answers and few points', () => {
    const result = evaluate(SCHNELLCHECK, withAnswer('produktsicherheit', 'ja'));
    expect(result.points).toBe(4);
    expect(result.trafficLight).toBe('red');
  });
});

describe('evaluate — findings', () => {
  it('returns exactly one reassuring, observational finding for green', () => {
    const result = evaluate(SCHNELLCHECK, harmlessAnswers());
    expect(result.findings).toHaveLength(1);
    expect(result.findings[0]).toContain('keine Hinweise');
  });

  it('mentions the December 2027 deadline for Annex I', () => {
    const result = evaluate(SCHNELLCHECK, withAnswer('produktsicherheit', 'ja'));
    expect(result.findings[0]).toContain('Dezember 2027');
  });

  it('mentions the August 2026 effective date for Art. 50', () => {
    const result = evaluate(SCHNELLCHECK, withAnswer('kundeninteraktion', 'ja'));
    expect(result.findings[0]).toContain('August 2026');
  });

  it('limits to at most 3 findings and prioritizes high risk', () => {
    const answers: Answers = {
      ...harmlessAnswers(),
      'ki-tools': ['vermutlich'], // shadow-ai
      personalwesen: ['ja'], // annex-iii
      produktsicherheit: ['ja'], // annex-i
      'personenbezogene-daten': ['ja'], // gdpr
      kundeninteraktion: ['ja'], // art-50
      inventar: ['nein'], // no-inventory
      richtlinien: ['nein'], // no-policy
    };
    const result = evaluate(SCHNELLCHECK, answers);
    expect(result.findings).toHaveLength(3);
    expect(result.findings[0]).toContain('Anhang III');
    expect(result.findings[1]).toContain('Anhang I');
    expect(result.findings[2]).toContain('Art. 50');
  });

  it('phrases findings as orientation, never as legal consequence', () => {
    const answers: Answers = {
      ...harmlessAnswers(),
      personalwesen: ['ja'],
      produktsicherheit: ['ja'],
      kundeninteraktion: ['ja'],
      inventar: ['nein'],
    };
    for (const finding of evaluate(SCHNELLCHECK, answers).findings) {
      expect(finding).not.toMatch(/Sie sind verpflichtet|Sie müssen/i);
    }
  });
});

describe('evaluate — full option coverage', () => {
  // Every single answer option of every question is scored once in isolation:
  // points and flags must match the definition exactly.
  for (const question of SCHNELLCHECK.questions) {
    for (const option of question.options) {
      it(`${question.id} → ${option.id}: points=${option.points ?? 0}, flags=${(option.flags ?? []).join(',') || '—'}`, () => {
        const result = evaluate(SCHNELLCHECK, { [question.id]: [option.id] });
        expect(result.points).toBe(option.points ?? 0);
        expect([...result.flags].sort()).toEqual([...(option.flags ?? [])].sort());
      });
    }
  }
});
