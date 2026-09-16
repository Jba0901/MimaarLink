import test from 'node:test';
import assert from 'node:assert/strict';
import { intakeChoices, matchesChoice } from '../lib/intakeChoices.mjs';

test('preset selections survive either language switch without rewriting the submitted answer', () => {
  for (const kind of ['timeline', 'budget', 'projectSize']) {
    const arabic = intakeChoices(kind, 'ar');
    const english = intakeChoices(kind, 'en');
    for (const [index, option] of arabic.entries()) {
      assert.equal(matchesChoice(english[index], option.value), true);
      assert.equal(matchesChoice(option, english[index].value), true);
      assert.equal(english.filter(item => matchesChoice(item, option.value)).length, 1);
    }
  }
});

test('blank optional answers and custom free text never silently select a preset', () => {
  for (const kind of ['timeline', 'budget', 'projectSize']) {
    for (const lang of ['en', 'ar']) {
      const options = intakeChoices(kind, lang);
      assert.equal(options.some(option => matchesChoice(option, '')), false);
      assert.equal(options.some(option => matchesChoice(option, 'Start after the final drawings are approved')), false);
      assert.equal(options.some(option => matchesChoice(option, '300,000 - 500,000')), false);
    }
  }
});
