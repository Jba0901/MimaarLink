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

test('visual scales keep labels short and separate non-ordinal answers', () => {
  for (const kind of ['timeline', 'budget', 'projectSize']) {
    for (const lang of ['en', 'ar']) {
      const options = intakeChoices(kind, lang);
      assert.equal(options.every(option => option.shortLabel.length > 0), true);
      assert.equal(options.filter(option => option.auxiliary).length, 1);
      assert.equal(options.filter(option => !option.auxiliary).length >= 4, true);
      assert.equal(options.every(option => option.aliases.length <= 2), true);
      assert.equal(options.every(option => option.aliases.every(alias => typeof alias === 'string')), true);
    }
  }
});

test('owner budget bands do not jump directly from 25,000 to 100,000', () => {
  for (const lang of ['en', 'ar']) {
    const budget = intakeChoices('budget', lang).filter(option => !option.auxiliary);
    assert.equal(budget.length, 5);
    assert.equal(budget[1].aliases.includes('25,000–50,000'), true);
    assert.equal(budget[2].aliases.includes('50,000–100,000'), true);
    assert.equal(budget[1].shortDir, 'ltr');
    assert.equal(budget[2].shortDir, 'ltr');
  }
});
